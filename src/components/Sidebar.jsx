import { useRef } from 'react';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export default function Sidebar({
  hasImage,
  onImageSelect,
  onError,
  onAddText,
  selectedLayer,
  onUpdateTextLayer,
  onDeleteTextLayer,
  onPlaceholderClick,
}) {
  const fileInputRef = useRef(null);

  const handleUploadBtnClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      onError(
        'Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.'
      );
      return;
    }

    onImageSelect(file);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Toolbar</h2>

      <div className="tool-group">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
          className="hidden-file-input"
        />

        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={handleUploadBtnClick}
        >
          📷 {hasImage ? 'Replace Image' : 'Upload Image'}
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={onAddText}
        >
          🔤 Add Text
        </button>

        <button
          type="button"
          className="btn btn-secondary btn-full"
          onClick={() => onPlaceholderClick('Add Sticker')}
        >
          ⭐ Add Sticker
        </button>
      </div>

      {/* Selected Text Layer Controls */}
      {selectedLayer && (
        <div className="layer-controls">
          <h3 className="layer-controls-title">Edit Selected Text</h3>

          <div className="control-field">
            <label htmlFor="text-content">Text</label>
            <input
              id="text-content"
              type="text"
              className="control-input"
              value={selectedLayer.text}
              onChange={(e) => onUpdateTextLayer('text', e.target.value)}
              placeholder="Enter text..."
            />
          </div>

          <div className="control-row">
            <div className="control-field" style={{ flex: 1 }}>
              <label htmlFor="font-size">Size ({selectedLayer.fontSize}px)</label>
              <input
                id="font-size"
                type="range"
                min="14"
                max="72"
                value={selectedLayer.fontSize}
                onChange={(e) =>
                  onUpdateTextLayer('fontSize', Number(e.target.value))
                }
              />
            </div>

            <div className="control-field">
              <label htmlFor="text-color">Color</label>
              <input
                id="text-color"
                type="color"
                className="color-picker"
                value={selectedLayer.color}
                onChange={(e) => onUpdateTextLayer('color', e.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="btn btn-danger btn-full"
            onClick={onDeleteTextLayer}
          >
            🗑️ Delete Text
          </button>
        </div>
      )}

      <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

      <div className="tool-group">
        <button
          type="button"
          className="btn btn-primary btn-full"
          onClick={() => onPlaceholderClick('Download')}
        >
          💾 Download Meme
        </button>
      </div>
    </aside>
  );
}