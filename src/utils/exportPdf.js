import { jsPDF } from "jspdf";

export async function exportMemeAsPdf({
    containerElement,
    imageUrl,
    textLayers,
    stickers,
    filename = "meme.pdf",
}) {
    if (!containerElement || !imageUrl) {
        throw new Error("Image or preview container missing.");
    }

    const rect = containerElement.getBoundingClientRect();
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    // ขยาย Canvas 2.5x เพื่อความคมชัดสูง
    const scale = 2.5;

    const canvas = document.createElement("canvas");
    canvas.width = cssWidth * scale;
    canvas.height = cssHeight * scale;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
        throw new Error("Could not get Canvas 2D context.");
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";

    await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
        bgImg.src = imageUrl;
    });

    ctx.fillStyle = "#0b1120";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const imgRatio = bgImg.naturalWidth / bgImg.naturalHeight;
    const canvasRatio = cssWidth / cssHeight;

    let renderWidth = cssWidth;
    let renderHeight = cssHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
        renderHeight = cssWidth / imgRatio;
        offsetY = (cssHeight - renderHeight) / 2;
    } else {
        renderWidth = cssHeight * imgRatio;
        offsetX = (cssWidth - renderWidth) / 2;
    }

    ctx.drawImage(
        bgImg,
        offsetX * scale,
        offsetY * scale,
        renderWidth * scale,
        renderHeight * scale,
    );

    // Stickers
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    stickers.forEach((sticker) => {
        const scaledSize = (sticker.size || 48) * scale;
        ctx.font = `${scaledSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
        ctx.fillText(sticker.emoji, sticker.x * scale, sticker.y * scale);
    });

    // Text Layers
    textLayers.forEach((layer) => {
        const scaledFontSize = (layer.fontSize || 36) * scale;
        ctx.font = `900 ${scaledFontSize}px Impact, "Arial Black", sans-serif`;
        ctx.textBaseline = "top";
        ctx.textAlign = "left";

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = Math.max(4, scaledFontSize / 8);
        ctx.lineJoin = "miter";
        ctx.miterLimit = 2;
        ctx.strokeText(layer.text, layer.x * scale, layer.y * scale);

        ctx.fillStyle = layer.color || "#ffffff";
        ctx.fillText(layer.text, layer.x * scale, layer.y * scale);
    });

    // แปลงภาพ High-Res ลงหน้ากระดาษ PDF
    const imgData = canvas.toDataURL("image/png", 1.0);

    const pdf = new jsPDF({
        orientation: cssWidth > cssHeight ? "landscape" : "portrait",
        unit: "px",
        format: [cssWidth, cssHeight], // ขอบเขตหน้ากระดาษเท่าเดิม แต่ภาพความละเอียดสูงขึ้น
    });

    pdf.addImage(imgData, "PNG", 0, 0, cssWidth, cssHeight);
    pdf.save(filename);
}
