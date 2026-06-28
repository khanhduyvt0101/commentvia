#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
POST_IMAGE = ROOT / "src/assets/creator-post.png"
AVATAR_IMAGE = ROOT / "src/assets/author-account-avatar.png"


def font(size: int, weight: str = "regular") -> ImageFont.FreeTypeFont:
    candidates = {
        "bold": [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Supplemental/Helvetica Bold.ttf",
        ],
        "regular": [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Supplemental/Helvetica.ttf",
        ],
    }[weight]

    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)

    return ImageFont.load_default()


def rounded(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], radius: int, fill: str, outline: str | None = None, width: int = 1) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def paste_cover(canvas: Image.Image, image: Image.Image, box: tuple[int, int, int, int], radius: int = 0) -> None:
    x1, y1, x2, y2 = box
    target_w = x2 - x1
    target_h = y2 - y1
    source = image.convert("RGB")
    ratio = max(target_w / source.width, target_h / source.height)
    resized = source.resize((round(source.width * ratio), round(source.height * ratio)), Image.Resampling.LANCZOS)
    crop_x = max(0, (resized.width - target_w) // 2)
    crop_y = max(0, (resized.height - target_h) // 2)
    cropped = resized.crop((crop_x, crop_y, crop_x + target_w, crop_y + target_h))

    if radius:
        mask = Image.new("L", (target_w, target_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
        canvas.paste(cropped, (x1, y1), mask)
        return

    canvas.paste(cropped, (x1, y1))


def paste_contain(canvas: Image.Image, image: Image.Image, box: tuple[int, int, int, int], fill: str = "#f1f2ef", radius: int = 0) -> None:
    x1, y1, x2, y2 = box
    target_w = x2 - x1
    target_h = y2 - y1
    source = image.convert("RGB")
    ratio = min(target_w / source.width, target_h / source.height)
    resized = source.resize((round(source.width * ratio), round(source.height * ratio)), Image.Resampling.LANCZOS)
    layer = Image.new("RGB", (target_w, target_h), fill)
    layer.paste(resized, ((target_w - resized.width) // 2, (target_h - resized.height) // 2))

    if radius:
        mask = Image.new("L", (target_w, target_h), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, target_w, target_h), radius=radius, fill=255)
        canvas.paste(layer, (x1, y1), mask)
        return

    canvas.paste(layer, (x1, y1))


def paste_circle(canvas: Image.Image, image: Image.Image, xy: tuple[int, int], size: int) -> None:
    avatar = image.convert("RGB").resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    canvas.paste(avatar, xy, mask)


def text_center(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font_obj: ImageFont.FreeTypeFont, fill: str) -> None:
    x, y = xy
    box = draw.textbbox((0, 0), text, font=font_obj)
    draw.text((x - (box[2] - box[0]) / 2, y), text, font=font_obj, fill=fill)


def shadowed_round_rect(canvas: Image.Image, box: tuple[int, int, int, int], radius: int, fill: str, shadow: tuple[int, int, int, int] = (15, 23, 42, 20), offset: tuple[int, int] = (0, 18), blur: int = 28, outline: str | None = None, width: int = 1) -> None:
    x1, y1, x2, y2 = box
    shadow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow_layer)
    shadow_box = (x1 + offset[0], y1 + offset[1], x2 + offset[0], y2 + offset[1])
    shadow_draw.rounded_rectangle(shadow_box, radius=radius, fill=shadow)
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(blur))
    canvas.paste(Image.alpha_composite(canvas.convert("RGBA"), shadow_layer).convert("RGB"))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def build(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)

    canvas = Image.new("RGB", (1200, 630), "#f7f7f5")
    draw = ImageDraw.Draw(canvas)
    post = Image.open(POST_IMAGE)
    avatar = Image.open(AVATAR_IMAGE)

    black = "#111111"
    muted = "#6b7280"
    border = "#d8ded6"
    card = "#ffffff"
    green = "#0f8f52"
    blue = "#1d9bf0"

    # A Tailwind-style social preview: one roomy browser canvas, two focused cards,
    # and only the UI details that stay readable at OG size.
    draw.rounded_rectangle((0, 0, 1200, 630), radius=0, fill="#f8faf8")
    draw.ellipse((980, -120, 1300, 220), fill="#e7f7ee")
    draw.ellipse((-120, 420, 220, 760), fill="#eef5f0")

    draw.text((72, 46), "CommentVia", font=font(27, "bold"), fill=green)
    draw.text(
        (72, 90),
        "Instagram comments become Auto DMs",
        font=font(43, "bold"),
        fill=black,
    )
    draw.text(
        (74, 146),
        "A product link is sent the moment someone asks in comments.",
        font=font(21),
        fill=muted,
    )

    shell = (64, 196, 1136, 574)
    shadowed_round_rect(canvas, shell, 30, "#ffffff", outline="#dfe5de", width=2)
    draw = ImageDraw.Draw(canvas)

    # Browser dots and subtle top rail.
    for index, color in enumerate(["#fb6b5f", "#f6c76a", "#62c87f"]):
        draw.ellipse((94 + index * 24, 224, 106 + index * 24, 236), fill=color)
    draw.line((64, 258, 1136, 258), fill="#edf1ec", width=2)

    left = (104, 292, 526, 552)
    right = (674, 292, 1096, 552)

    draw.text((left[0], 270), "Instagram comment", font=font(23, "bold"), fill=black)
    draw.text((right[0], 270), "Auto DM sent", font=font(23, "bold"), fill=black)

    rounded(draw, left, 24, "#fbfcfb", "#dfe6dc", 2)
    rounded(draw, right, 24, "#fbfcfb", "#dfe6dc", 2)

    # Left card: post image + comment.
    image_box = (left[0] + 28, left[1] + 28, left[0] + 178, left[3] - 28)
    rounded(draw, (image_box[0] - 10, image_box[1] - 10, image_box[2] + 10, image_box[3] + 10), 22, "#f1f3ef")
    paste_contain(canvas, post, image_box, fill="#f1f3ef", radius=16)

    paste_circle(canvas, avatar, (left[0] + 220, left[1] + 48), 44)
    draw.text((left[0] + 278, left[1] + 48), "sophia.tran", font=font(18, "bold"), fill=black)
    draw.text((left[0] + 278, left[1] + 76), "commented", font=font(16), fill=muted)
    rounded(draw, (left[0] + 220, left[1] + 118, left[2] - 28, left[1] + 190), 24, "#ffffff", "#e0e7de", 2)
    draw.text((left[0] + 248, left[1] + 136), "outfit", font=font(31, "bold"), fill=black)
    rounded(draw, (left[0] + 220, left[1] + 204, left[2] - 28, left[1] + 240), 18, "#eaf8f0", "#c7ecd5", 2)
    draw.text((left[0] + 248, left[1] + 211), "Keyword matched", font=font(17, "bold"), fill=green)

    # Center arrow.
    rounded(draw, (579, 362, 621, 404), 21, "#ffffff", "#dfe6dc", 2)
    draw.line((591, 383, 609, 383), fill=muted, width=3)
    draw.line((603, 375, 611, 383), fill=muted, width=3)
    draw.line((603, 391, 611, 383), fill=muted, width=3)

    # Right card: DM bubble + product link preview.
    paste_circle(canvas, avatar, (right[0] + 28, right[1] + 28), 44)
    draw.text((right[0] + 86, right[1] + 30), "yourusername", font=font(18, "bold"), fill=black)
    draw.ellipse((right[0] + 212, right[1] + 38, right[0] + 224, right[1] + 50), fill=blue)
    draw.text((right[0] + 86, right[1] + 58), "sent now", font=font(16), fill=muted)

    bubble = (right[0] + 40, right[1] + 86, right[2] - 28, right[1] + 176)
    rounded(draw, bubble, 28, "#eef1f3")
    draw.text((bubble[0] + 28, bubble[1] + 20), "Check your inbox.", font=font(23, "bold"), fill=black)
    draw.text((bubble[0] + 28, bubble[1] + 52), "I sent the outfit link.", font=font(19), fill=black)

    link = (right[0] + 40, right[1] + 188, right[2] - 28, right[1] + 244)
    rounded(draw, link, 22, "#ffffff", "#e1e7df", 2)
    paste_contain(canvas, post, (link[0] + 16, link[1] + 10, link[0] + 58, link[3] - 10), fill="#f1f3ef", radius=12)
    draw.text((link[0] + 76, link[1] + 11), "My outfit details", font=font(17, "bold"), fill=black)
    draw.text((link[0] + 76, link[1] + 34), "linktr.ee", font=font(15), fill=muted)
    rounded(draw, (link[2] - 126, link[1] + 14, link[2] - 20, link[1] + 42), 14, "#0f8f52")
    draw.text((link[2] - 108, link[1] + 20), "Delivered", font=font(13, "bold"), fill="#ffffff")

    draw.text((92, 590), "Comment-to-DM automation for creator commerce", font=font(18), fill=muted)

    canvas.save(output_path, "PNG", optimize=True)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: generate-og-image.py <output-path>")
    build(Path(sys.argv[1]))
