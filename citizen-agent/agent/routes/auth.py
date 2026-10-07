from __future__ import annotations
import hashlib, hmac, logging, os, random, secrets, string
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import APIRouter, Header, HTTPException, status
from pydantic import BaseModel, field_validator
from agent import db

logger = logging.getLogger('agent.auth')
router = APIRouter()
_SESSIONS: dict = {}
_SECRET = os.environ.get('AUTH_SECRET', 'citizen-agent-demo-2026')

def _hash_password(pw):
    salt = hashlib.sha256(_SECRET.encode()).hexdigest()[:16]
    return hashlib.pbkdf2_hmac('sha256', pw.encode(), salt.encode(), 100000).hex()

def _verify_password(plain, hashed):
    return hmac.compare_digest(_hash_password(plain), hashed)

def _token():
    return secrets.token_urlsafe(32)

def _otp():
    return ''.join(random.choices(string.digits, k=6))

def _now():
    return datetime.now(tz=timezone.utc)

def _now_iso():
    return _now().isoformat()

def _store_session(uid, uname, phone, full_name):
    tok = _token()
    _SESSIONS[tok] = {'user_id': uid, 'username': uname, 'phone': phone,
                      'full_name': full_name or uname,
                      'expires_at': (_now() + timedelta(hours=24)).isoformat()}
    return tok

def _get_session(token):
    sess = _SESSIONS.get(token)
    if not sess:
        raise HTTPException(status_code=401, detail='Invalid or expired session token.')
    if _now_iso() > sess['expires_at']:
        _SESSIONS.pop(token, None)
        raise HTTPException(status_code=401, detail='Session expired. Please log in again.')
    return sess

class RegisterRequest(BaseModel):
    username: str
    password: str
    confirm_password: str
    phone: str
    full_name: Optional[str] = None
    @field_validator('username')
    @classmethod
    def val_user(cls, v):
        v = v.strip()
        if len(v) < 3: raise ValueError('Username must be at least 3 characters.')
        return v
    @field_validator('password')
    @classmethod
    def val_pw(cls, v):
        if len(v) < 6: raise ValueError('Password must be at least 6 characters.')
        return v
    @field_validator('phone')
    @classmethod
    def val_phone(cls, v):
        d = v.strip().lstrip('+').replace(' ','').replace('-','')
        if not d.isdigit(): raise ValueError('Phone must contain only digits.')
        if len(d) < 10: raise ValueError('Phone must be at least 10 digits.')
        return d[-10:]

class LoginRequest(BaseModel):
    username: str
    password: str

class SendOtpRequest(BaseModel):
    phone: str
    token: str

class VerifyOtpRequest(BaseModel):
    phone: str
    code: str
    token: str

@router.post('/auth/register', tags=['Auth'])
async def register(req: RegisterRequest):
    if req.password != req.confirm_password:
        raise HTTPException(status_code=400, detail='Passwords do not match. Please re-enter.')
    if db.fetchone('SELECT id FROM users WHERE username=?', (req.username,)):
        raise HTTPException(status_code=409, detail='Username already taken. Choose another.')
    if db.fetchone('SELECT id FROM users WHERE phone=?', (req.phone,)):
        raise HTTPException(status_code=409, detail='Phone number already registered.')
    pwd_hash = _hash_password(req.password)
    with db.transaction():
        db.execute('INSERT INTO users (username, password_hash, phone, phone_verified, full_name, created_at) VALUES (?, ?, ?, 0, ?, ?)',
                   (req.username, pwd_hash, req.phone, req.full_name, _now_iso()))
    user = db.fetchone('SELECT id, username, phone, full_name FROM users WHERE username=?', (req.username,))
    tok = _store_session(user['id'], user['username'], user['phone'], user['full_name'])
    return {'success': True, 'message': 'Account created successfully!', 'token': tok,
            'user': {'id': user['id'], 'username': user['username'], 'phone': user['phone'],
                     'full_name': user['full_name'] or user['username'], 'phone_verified': False}}

@router.post('/auth/login', tags=['Auth'])
async def login(req: LoginRequest):
    user = db.fetchone('SELECT id, username, password_hash, phone, phone_verified, full_name FROM users WHERE username=?', (req.username.strip(),))
    if not user or not _verify_password(req.password, user['password_hash']):
        raise HTTPException(status_code=401, detail='Invalid username or password.')
    with db.transaction():
        db.execute('UPDATE users SET last_login=? WHERE id=?', (_now_iso(), user['id']))
    tok = _store_session(user['id'], user['username'], user['phone'], user['full_name'])
    return {'success': True, 'message': 'Login successful!', 'token': tok,
            'user': {'id': user['id'], 'username': user['username'], 'phone': user['phone'],
                     'full_name': user['full_name'] or user['username'],
                     'phone_verified': bool(user['phone_verified'])}}

@router.post('/auth/send-otp', tags=['Auth'])
async def send_otp(req: SendOtpRequest):
    sess = _get_session(req.token)
    phone = req.phone.strip().lstrip('+').replace(' ','').replace('-','')[-10:]
    if phone != sess['phone']:
        raise HTTPException(status_code=400, detail='Phone does not match your registered number.')
    cnt = db.fetchone('SELECT COUNT(*) as c FROM otp_codes WHERE phone=? AND used=0 AND expires_at > ?', (phone, _now_iso()))
    if cnt and cnt['c'] >= 3:
        raise HTTPException(status_code=429, detail='Too many OTP requests. Please wait.')
    otp = _otp()
    exp = (_now() + timedelta(minutes=10)).isoformat()
    with db.transaction():
        db.execute('INSERT INTO otp_codes (phone, code, purpose, attempts, used, expires_at, created_at) VALUES (?, ?, ?, 0, 0, ?, ?)',
                   (phone, otp, 'phone_verify', exp, _now_iso()))
    return {'success': True, 'message': 'OTP sent to +91-XXXXXX' + phone[-4:] + '. Valid for 10 minutes.',
            'otp_demo': otp, 'expires_in_minutes': 10}

@router.post('/auth/verify-otp', tags=['Auth'])
async def verify_otp(req: VerifyOtpRequest):
    _get_session(req.token)
    phone = req.phone.strip().lstrip('+').replace(' ','').replace('-','')[-10:]
    record = db.fetchone('SELECT id, code, attempts FROM otp_codes WHERE phone=? AND purpose=? AND used=0 ORDER BY created_at DESC LIMIT 1',
                         (phone, 'phone_verify'))
    if not record:
        raise HTTPException(status_code=400, detail='No active OTP found. Request a new one.')
    if record['attempts'] >= 5:
        raise HTTPException(status_code=429, detail='Too many incorrect attempts. Request a new OTP.')
    if not hmac.compare_digest(record['code'], req.code.strip()):
        with db.transaction():
            db.execute('UPDATE otp_codes SET attempts=attempts+1 WHERE id=?', (record['id'],))
        raise HTTPException(status_code=400, detail='Incorrect OTP. Please try again.')
    with db.transaction():
        db.execute('UPDATE otp_codes SET used=1 WHERE id=?', (record['id'],))
        db.execute('UPDATE users SET phone_verified=1 WHERE phone=?', (phone,))
    return {'success': True, 'message': 'Phone number verified successfully!', 'phone_verified': True}

@router.get('/auth/me', tags=['Auth'])
async def get_me(authorization: str = Header(default='')):
    token = authorization.replace('Bearer ', '').strip()
    if not token:
        raise HTTPException(status_code=401, detail='No authorization token provided.')
    sess = _get_session(token)
    user = db.fetchone('SELECT id, username, phone, phone_verified, full_name, last_login FROM users WHERE id=?', (sess['user_id'],))
    if not user:
        raise HTTPException(status_code=404, detail='User not found.')
    return {'id': user['id'], 'username': user['username'], 'phone': user['phone'],
            'phone_verified': bool(user['phone_verified']),
            'full_name': user['full_name'] or user['username'], 'last_login': user['last_login']}

@router.post('/auth/logout', tags=['Auth'])
async def logout(authorization: str = Header(default='')):
    token = authorization.replace('Bearer ', '').strip()
    _SESSIONS.pop(token, None)
    return {'success': True, 'message': 'Logged out successfully.'}
