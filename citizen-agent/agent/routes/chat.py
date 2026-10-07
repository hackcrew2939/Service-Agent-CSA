"""
agent/routes/chat.py – Chat and SSE endpoints
"""
from __future__ import annotations

import asyncio
import json
from typing import Optional
from fastapi import APIRouter, Cookie, Header, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from agent import clock, db
from agent.state_machine import handle_message, get_or_create_queue, poll_status_loop, State

router = APIRouter()


class ChatRequest(BaseModel):
    session_id: str
    text: str
    language: Optional[str] = None

    class Config:
        extra = "forbid"


@router.post("/chat")
async def chat_endpoint(
    req: ChatRequest,
    session_id_cookie: Optional[str] = Cookie(None, alias="session_id"),
    x_csrf_token: Optional[str] = Header(None, alias="X-CSRF-Token"),
):
    # Cookie session check (if cookie present)
    if session_id_cookie and session_id_cookie != req.session_id:
        raise HTTPException(status_code=403, detail="Session cookie mismatch")

    session = db.get_session(req.session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    res = await handle_message(
        session_id=req.session_id,
        user_text=req.text,
        lang_override=req.language,
    )

    # If state moved to TRACKING_STATUS, start background polling task
    if res.get("state") == State.TRACKING_STATUS:
        asyncio.create_task(poll_status_loop(req.session_id, interval=10.0))

    return res


@router.get("/stream/{session_id}")
async def sse_stream(session_id: str):
    session = db.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")

    queue = get_or_create_queue(session_id)

    async def event_generator():
        yield f"event: connect\ndata: {json.dumps({'session_id': session_id, 'timestamp': clock.now_iso()})}\n\n"
        
        while True:
            try:
                # 15 second heartbeat timeout
                msg = await asyncio.wait_for(queue.get(), timeout=15.0)
                event_type = msg.get("type", "message")
                data_str = json.dumps(msg.get("data", {}), ensure_ascii=False)
                yield f"event: {event_type}\ndata: {data_str}\n\n"
            except asyncio.TimeoutError:
                # Send SSE keep-alive heartbeat
                yield f": heartbeat {clock.now_iso()}\n\n"
            except asyncio.CancelledError:
                break
            except Exception as e:
                yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
