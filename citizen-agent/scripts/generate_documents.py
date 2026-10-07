#!/usr/bin/env python3
"""
scripts/generate_documents.py
Generate synthetic government document images (with DEMO watermark) and
their sidecar JSON files for all 20 demo citizens.

Variants per document type:
  _good       - correct data
  _wrongname  - name differs (abbreviated)
  _blurry     - Gaussian blur applied
  _expired    - income_proof issued 400+ days ago (only for income_proof)
  _wrongtype  - wrong document type in the slot (aadhaar image used as ration_card)
  _unknown    - Aadhaar / ration number NOT in citizens.json

Usage:
  cd citizen-agent
  python scripts/generate_documents.py
"""
from __future__ import annotations

import json
import math
import os
import sys
import datetime
import random

# ── Ensure we run from the citizen-agent root ─────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    print("PIL not installed. Run: pip install Pillow")
    sys.exit(1)

from agent import clock

clock.from_env()

CITIZENS_PATH = os.path.join(ROOT, "data", "citizens.json")
DOCS_DIR = os.path.join(ROOT, "data", "docs")
FONTS_DIR = os.path.join(ROOT, "data", "fonts")
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(FONTS_DIR, exist_ok=True)

with open(CITIZENS_PATH, encoding="utf-8") as f:
    CITIZENS: list[dict] = json.load(f)

# ── Font loading ───────────────────────────────────────────────────────────────
def _load_font(size: int = 18) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        os.path.join(FONTS_DIR, "NotoSans-Regular.ttf"),
        os.path.join(FONTS_DIR, "NotoSansDevanagari-Regular.ttf"),
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


def _load_big_font(size: int = 28) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    return _load_font(size)


# ── Image helpers ─────────────────────────────────────────────────────────────
W, H = 800, 500
BG_COLORS = {
    "aadhaar": (255, 235, 235),
    "ration_card": (235, 255, 235),
    "income_proof": (235, 235, 255),
    "photo": (240, 240, 240),
}
HEADER_COLORS = {
    "aadhaar": (180, 30, 30),
    "ration_card": (30, 120, 30),
    "income_proof": (30, 30, 160),
    "photo": (80, 80, 80),
}
DOC_LABELS = {
    "aadhaar": "AADHAAR CARD  |  आधार कार्ड",
    "ration_card": "RATION CARD  |  राशन कार्ड",
    "income_proof": "INCOME PROOF  |  आय प्रमाण",
    "photo": "PASSPORT PHOTO  |  फोटो",
}


def _make_image(doc_type: str, lines: list[str], watermark: str = "DEMO / SAMPLE") -> Image.Image:
    bg = BG_COLORS.get(doc_type, (245, 245, 245))
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Header bar
    hc = HEADER_COLORS.get(doc_type, (60, 60, 60))
    draw.rectangle([(0, 0), (W, 60)], fill=hc)
    big_font = _load_big_font(24)
    draw.text((20, 15), DOC_LABELS.get(doc_type, doc_type.upper()), fill="white", font=big_font)

    # Sub-header
    draw.rectangle([(0, 60), (W, 80)], fill=(200, 200, 200))
    small_font = _load_font(14)
    draw.text((20, 63), "Government of Jharkhand  |  झारखंड सरकार  [DEMO ONLY]",
              fill=(60, 60, 60), font=small_font)

    # Body text
    body_font = _load_font(18)
    y = 100
    for line in lines:
        draw.text((40, y), line, fill=(20, 20, 20), font=body_font)
        y += 32

    # Watermark (diagonal)
    wm_font = _load_big_font(60)
    wm_img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    wm_draw = ImageDraw.Draw(wm_img)
    wm_draw.text((80, 200), watermark, fill=(200, 30, 30, 60), font=wm_font)
    wm_img = wm_img.rotate(25, expand=False)
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, wm_img)
    img = img.convert("RGB")

    return img


def _save(img: Image.Image, path: str) -> None:
    img.save(path, "JPEG", quality=85)


def _sidecar(path: str, data: dict) -> None:
    with open(path.replace(".jpg", ".json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# ── Reference date ────────────────────────────────────────────────────────────
TODAY = clock.today()
GOOD_ISSUE = (TODAY - datetime.timedelta(days=15)).isoformat()   # 15 days ago
EXPIRED_ISSUE = (TODAY - datetime.timedelta(days=400)).isoformat()  # 400 days ago


# ── Generators per document type ──────────────────────────────────────────────

def gen_aadhaar(c: dict, variant: str, out_dir: str) -> None:
    cid = c["citizen_id"]
    base = os.path.join(out_dir, f"{cid}_aadhaar")

    def _write(fname: str, name: str, aadhaar: str, readable: bool = True,
               doc_type: str = "aadhaar") -> None:
        lines = [
            f"Name / नाम: {name}",
            f"Aadhaar: {aadhaar}",
            f"DOB / जन्मतिथि: {c['dob']}",
            f"Address: {c['address']}",
        ]
        img = _make_image(doc_type, lines)
        if not readable:
            img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_{fname}.jpg")
        if readable and doc_type == "aadhaar":
            _sidecar(f"{base}_{fname}.jpg", {
                "document_type": doc_type,
                "name": name,
                "aadhaar_number": aadhaar,
                "dob": c["dob"],
                "address": c["address"],
                "readable": True,
            })
        elif not readable:
            _sidecar(f"{base}_{fname}.jpg", {"readable": False})
        else:
            _sidecar(f"{base}_{fname}.jpg", {
                "document_type": doc_type,
                "name": name,
                "aadhaar_number": aadhaar,
                "readable": True,
            })

    if variant == "good":
        _write("good", c["name"], c["aadhaar"])
    elif variant == "wrongname":
        # Abbreviated first name
        parts = c["name"].split()
        short = parts[0][0] + ". " + " ".join(parts[1:]) if len(parts) > 1 else parts[0][:3]
        _write("wrongname", short, c["aadhaar"])
    elif variant == "blurry":
        lines = [f"Name: {c['name']}", f"Aadhaar: {c['aadhaar']}", f"DOB: {c['dob']}"]
        img = _make_image("aadhaar", lines)
        img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_blurry.jpg")
        _sidecar(f"{base}_blurry.jpg", {"readable": False})
    elif variant == "wrongtype":
        # Aadhaar image but labelled as ration_card doc_type in the sidecar
        _write("wrongtype", c["name"], c["aadhaar"], doc_type="ration_card")
    elif variant == "unknown":
        # Aadhaar number not in registry
        fake_aadhaar = "0000 0000 0000"
        _write("unknown", c["name"], fake_aadhaar)


def gen_ration_card(c: dict, variant: str, out_dir: str) -> None:
    cid = c["citizen_id"]
    base = os.path.join(out_dir, f"{cid}_ration_card")

    def _write(fname: str, name: str, rc_no: str, readable: bool = True) -> None:
        lines = [
            f"Name / नाम: {name}",
            f"Ration Card No: {rc_no}",
            f"Address: {c['address']}",
        ]
        img = _make_image("ration_card", lines)
        if not readable:
            img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_{fname}.jpg")
        if readable:
            _sidecar(f"{base}_{fname}.jpg", {
                "document_type": "ration_card",
                "name": name,
                "ration_card_no": rc_no,
                "address": c["address"],
                "readable": True,
            })
        else:
            _sidecar(f"{base}_{fname}.jpg", {"readable": False})

    if variant == "good":
        _write("good", c["name"], c["ration_card_no"])
    elif variant == "wrongname":
        parts = c["name"].split()
        short = parts[0][0] + ". " + " ".join(parts[1:]) if len(parts) > 1 else parts[0][:3]
        _write("wrongname", short, c["ration_card_no"])
    elif variant == "blurry":
        lines = [f"Name: {c['name']}", f"RC: {c['ration_card_no']}"]
        img = _make_image("ration_card", lines)
        img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_blurry.jpg")
        _sidecar(f"{base}_blurry.jpg", {"readable": False})
    elif variant == "wrongtype":
        lines = [f"Name: {c['name']}", f"RC: {c['ration_card_no']}"]
        img = _make_image("aadhaar", lines)  # wrong visual type
        _save(img, f"{base}_wrongtype.jpg")
        _sidecar(f"{base}_wrongtype.jpg", {
            "document_type": "aadhaar",
            "name": c["name"],
            "aadhaar_number": "0000 0000 0000",
            "readable": True,
        })
    elif variant == "unknown":
        _write("unknown", c["name"], "JH-RC-000000")


def gen_income_proof(c: dict, variant: str, out_dir: str) -> None:
    cid = c["citizen_id"]
    base = os.path.join(out_dir, f"{cid}_income_proof")

    def _write(fname: str, name: str, income: int, issue_date: str,
               readable: bool = True) -> None:
        lines = [
            f"Name / नाम: {name}",
            f"Annual Income / वार्षिक आय: Rs {income:,}",
            f"Issue Date / जारी तिथि: {issue_date}",
            "Self-declaration / स्व-घोषणा",
        ]
        img = _make_image("income_proof", lines)
        if not readable:
            img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_{fname}.jpg")
        if readable:
            _sidecar(f"{base}_{fname}.jpg", {
                "document_type": "income_proof",
                "name": name,
                "annual_income": income,
                "issue_date": issue_date,
                "readable": True,
            })
        else:
            _sidecar(f"{base}_{fname}.jpg", {"readable": False})

    if variant == "good":
        _write("good", c["name"], c["annual_income"], GOOD_ISSUE)
    elif variant == "wrongname":
        parts = c["name"].split()
        short = parts[0][0] + ". " + " ".join(parts[1:]) if len(parts) > 1 else parts[0][:3]
        _write("wrongname", short, c["annual_income"], GOOD_ISSUE)
    elif variant == "blurry":
        lines = [f"Name: {c['name']}", f"Income: Rs {c['annual_income']:,}", f"Date: {GOOD_ISSUE}"]
        img = _make_image("income_proof", lines)
        img = img.filter(ImageFilter.GaussianBlur(radius=8))
        _save(img, f"{base}_blurry.jpg")
        _sidecar(f"{base}_blurry.jpg", {"readable": False})
    elif variant == "expired":
        _write("expired", c["name"], c["annual_income"], EXPIRED_ISSUE)
    elif variant == "wrongtype":
        lines = [f"Name: {c['name']}", f"Income: Rs {c['annual_income']:,}"]
        img = _make_image("aadhaar", lines)
        _save(img, f"{base}_wrongtype.jpg")
        _sidecar(f"{base}_wrongtype.jpg", {
            "document_type": "aadhaar",
            "name": c["name"],
            "readable": True,
        })


def gen_photo(c: dict, variant: str, out_dir: str) -> None:
    cid = c["citizen_id"]
    base = os.path.join(out_dir, f"{cid}_photo")

    def _write(fname: str, readable: bool = True) -> None:
        # Draw a simple placeholder portrait
        img = Image.new("RGB", (300, 400), (220, 200, 180))
        draw = ImageDraw.Draw(img)
        # Head circle
        draw.ellipse([(75, 30), (225, 180)], fill=(200, 160, 130))
        # Body
        draw.rectangle([(60, 180), (240, 380)], fill=(100, 120, 180))
        # Label
        font = _load_font(16)
        draw.text((20, 360), f"{c['name'][:15]} [DEMO]", fill=(30, 30, 30), font=font)
        if not readable:
            img = img.filter(ImageFilter.GaussianBlur(radius=8))
        img.save(f"{base}_{fname}.jpg", "JPEG", quality=85)
        if readable:
            _sidecar(f"{base}_{fname}.jpg", {
                "document_type": "photo",
                "readable": True,
            })
        else:
            _sidecar(f"{base}_{fname}.jpg", {"readable": False})

    if variant == "good":
        _write("good")
    elif variant == "blurry":
        _write("blurry", readable=False)


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print(f"Generating documents in {DOCS_DIR} (reference date: {TODAY})")
    demo = CITIZENS[:3]  # first 3 citizens get full variant set for demo
    rest = CITIZENS[3:]

    for c in demo:
        for variant in ("good", "wrongname", "blurry", "expired", "wrongtype", "unknown"):
            if variant in ("expired", "wrongtype", "unknown") and True:
                gen_aadhaar(c, variant if variant != "expired" else "good", DOCS_DIR)
            gen_aadhaar(c, variant if variant != "expired" else "good", DOCS_DIR)
        gen_aadhaar(c, "good", DOCS_DIR)
        gen_aadhaar(c, "wrongname", DOCS_DIR)
        gen_aadhaar(c, "blurry", DOCS_DIR)
        gen_aadhaar(c, "wrongtype", DOCS_DIR)
        gen_aadhaar(c, "unknown", DOCS_DIR)

        gen_ration_card(c, "good", DOCS_DIR)
        gen_ration_card(c, "wrongname", DOCS_DIR)
        gen_ration_card(c, "blurry", DOCS_DIR)
        gen_ration_card(c, "wrongtype", DOCS_DIR)
        gen_ration_card(c, "unknown", DOCS_DIR)

        gen_income_proof(c, "good", DOCS_DIR)
        gen_income_proof(c, "wrongname", DOCS_DIR)
        gen_income_proof(c, "blurry", DOCS_DIR)
        gen_income_proof(c, "expired", DOCS_DIR)
        gen_income_proof(c, "wrongtype", DOCS_DIR)

        gen_photo(c, "good", DOCS_DIR)
        gen_photo(c, "blurry", DOCS_DIR)

    # Good-only for the remaining citizens
    for c in rest:
        gen_aadhaar(c, "good", DOCS_DIR)
        gen_ration_card(c, "good", DOCS_DIR)
        gen_income_proof(c, "good", DOCS_DIR)
        gen_photo(c, "good", DOCS_DIR)

    print("Done.  Files written to data/docs/")


if __name__ == "__main__":
    main()
