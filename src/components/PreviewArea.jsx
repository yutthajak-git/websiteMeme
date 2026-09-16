import { useRef } from 'react';

export default function PreviewArea({
  image,
  errorMessage,
  textLayers,
  selectedTextId,
  onSelectText,
  onUpdateTextPosition,
  stickers,
  selectedStickerId,
  onSelectSticker,
  onUpdateStickerPosition,
}) {
  const containerRef = useRef(null);

  // Generic drag handler for any movable layer (Text or Sticker)
  const handleItemMouseDown = (e, item, onUpdatePosition, onSelect) => {
    e.stopPropagation();
    onSelect(item.id);

    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const initialX = item.x;
    const initialY = item.y;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startMouseX;
      const deltaY = moveEvent.clientY - startMouseY;

      let newX = initialX + deltaX;
      let newY = initialY + deltaY;

      newX = Math.max(0, Math.min(newX, containerRect.width - 40));
      newY = Math.max(0, Math.min(newY, containerRect.height - 40));

      onUpdatePosition(item.id, newX, newY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleContainerClick = (e) => {
    if (
      e.target === containerRef.current ||
      e.target.classList.contains('preview-image')
    ) {
      onSelectText(null);
      onSelectSticker(null);
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
        className={`meme-canvas-placeholder ${image ? 'has-image' : ''}`}
      >
        {image ? (
          <>
            <img
              src={image}
              alt="Selected Meme Preview"
              className="preview-image"
            />

            {/* Render Text Layers */}
            {textLayers.map((layer) => (
              <div
                key={layer.id}
                onMouseDown={(e) =>
                  handleItemMouseDown(e, layer, onUpdateTextPosition, onSelectText)
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectText(layer.id);
                  onSelectSticker(null);
                }}
                className={`meme-text-layer ${
                  selectedTextId === layer.id ? 'selected' : ''
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

            {/* Render Sticker Layers */}
            {stickers.map((sticker) => (
              <div
                key={sticker.id}
                onMouseDown={(e) =>
                  handleItemMouseDown(
                    e,
                    sticker,
                    onUpdateStickerPosition,
                    onSelectSticker
                  )
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSticker(sticker.id);
                  onSelectText(null);
                }}
                className={`meme-sticker-layer ${
                  selectedStickerId === sticker.id ? 'selected' : ''
                }`}
                style={{
                  left: `${sticker.x}px`,
                  top: `${sticker.y}px`,
                  fontSize: `${sticker.size || 48}px`,
                }}
              >
                {sticker.emoji}
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