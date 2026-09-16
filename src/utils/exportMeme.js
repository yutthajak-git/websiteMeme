/**
 * Utility to render Meme elements (Image, Text Layers, Stickers)
 * onto an off-screen HTML5 Canvas and trigger a PNG download.
 */
export async function exportMemeAsPng({
    containerElement,
    imageUrl,
    textLayers,
    stickers,
    filename = "meme.png",
}) {
    if (!containerElement || !imageUrl) {
        throw new Error("Image or preview container missing.");
    }

    // 1. ขนาดจริงของกล่องแสดงผลใน Browser
    const rect = containerElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 2. สร้าง Off-screen Canvas
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get Canvas 2D context.");
    }

    // 3. วาดภาพพื้นหลัง (จัดการสเกลแบบ object-fit: contain)
    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = imageUrl;
    });

    // เติมพื้นหลังสีเข้มเหมือน CSS (.has-image { background-color: #0b1120 })
    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, width, height);

    // คำนวณขนาดและตำแหน่งให้อยู่ตรงกลางตามแบบ object-fit: contain
    const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
    const canvasRatio = width / height;

    let renderWidth = width;
    let renderHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
        renderHeight = width / imgRatio;
        offsetY = (height - renderHeight) / 2;
    } else {
        renderWidth = height * imgRatio;
        offsetX = (width - renderWidth) / 2;
    }

    ctx.drawImage(bgImg, offsetX, offsetY, renderWidth, renderHeight);

    // 4. วาด Stickers / Emojis
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    stickers.forEach((sticker) => {
        const size = sticker.size || 48;
        ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.fillText(sticker.emoji, sticker.x, sticker.y);
    });

    // 5. วาด Text Layers (Impact Font พร้อมขอบดำ)
    textLayers.forEach((layer) => {
        const fontSize = layer.fontSize || 36;
        ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        // ขอบเส้นสีดำ (Stroke) สไตล์ Meme
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(3, fontSize / 8);
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2;
        ctx.strokeText(layer.text, layer.x, layer.y);

        // สีตัวอักษรด้านใน (Fill)
        ctx.fillStyle = layer.color || "#ffffff";
        ctx.fillText(layer.text, layer.x, layer.y);
    });

    // 6. ดาวน์โหลดไฟล์เป็น PNG
    const dataUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = dataUrl;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
