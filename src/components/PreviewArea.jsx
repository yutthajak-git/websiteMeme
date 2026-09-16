import { useRef } from "react";

export default function PreviewArea({
    image,
    errorMessage,
    textLayers,
    selectedTextId,
    onSelectText,
    onUpdateTextPosition,
}) {
    const containerRef = useRef(null);

    const handleMouseDown = (e, layer) => {
        // ป้องกันไม่ให้ event ทะลุไปตัวแม่
        e.stopPropagation();

        // เลือก Layer ทันทีตั้งแต่กดเมาส์ลงไป
        onSelectText(layer.id);

        if (!containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const startMouseX = e.clientX;
        const startMouseY = e.clientY;
        const initialLayerX = layer.x;
        const initialLayerY = layer.y;

        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startMouseX;
            const deltaY = moveEvent.clientY - startMouseY;

            let newX = initialLayerX + deltaX;
            let newY = initialLayerY + deltaY;

            // ล็อกขอบเขตไม่ให้ลากหลุดนอกกรอบ
            newX = Math.max(0, Math.min(newX, containerRect.width - 40));
            newY = Math.max(0, Math.min(newY, containerRect.height - 40));

            onUpdateTextPosition(layer.id, newX, newY);
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    const handleTextClick = (e, layerId) => {
        // สำคัญมาก: หยุดการส่ง event ไปหา handleContainerClick
        e.stopPropagation();
        onSelectText(layerId);
    };

    const handleContainerClick = (e) => {
        // ยกเลิกการเลือกเฉพาะตอนคลิกที่พื้นที่ว่างจริง ๆ (ไม่ใช่คลิกโดนข้อความ)
        if (
            e.target === containerRef.current ||
            e.target.classList.contains("preview-image")
        ) {
            onSelectText(null);
        }
    };

    return (
        <main className="preview-area">
            {errorMessage && (
                <div className="error-banner" role="alert">
                    {errorMessage}
                </div>
            )}

            <div
                ref={containerRef}
                onClick={handleContainerClick}
                className={`meme-canvas-placeholder ${image ? "has-image" : ""}`}
            >
                {image ? (
                    <>
                        <img
                            src={image}
                            alt="Selected Meme Preview"
                            className="preview-image"
                        />
                        {textLayers.map((layer) => (
                            <div
                                key={layer.id}
                                onMouseDown={(e) => handleMouseDown(e, layer)}
                                onClick={(e) => handleTextClick(e, layer.id)}
                                className={`meme-text-layer ${
                                    selectedTextId === layer.id
                                        ? "selected"
                                        : ""
                                }`}
                                style={{
                                    left: `${layer.x}px`,
                                    top: `${layer.y}px`,
                                    fontSize: `${layer.fontSize}px`,
                                    color: layer.color,
                                }}
                            >
                                {layer.text}
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="placeholder-content">
                        <span className="placeholder-icon">🖼️</span>
                        <h3>Preview Area</h3>
                        <p>Upload an image to start creating your meme</p>
                    </div>
                )}
            </div>
        </main>
    );
}
