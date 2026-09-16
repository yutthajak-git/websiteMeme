import { useRef, useState } from 'react';
import EmojiPicker from './controls/EmojiPicker';
import TextControls from './controls/TextControls';
import StickerControls from './controls/StickerControls';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export default function Sidebar({
  hasImage,
  onImageSelect,
  onError,
  onAddText,
  selectedLayer,
  onUpdateTextLayer,
  onDeleteTextLayer,
  onAddSticker,
  selectedSticker,
  onUpdateStickerSize,
  onDeleteSticker,
  onPlaceholderClick,
}) {
  const fileInputRef = useRef(null);
  const [showStickerPicker, setShowStickerPicker] = useState(false);

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

  const handleEmojiSelect = (emoji) => {
    onAddSticker(emoji);
    setShowStickerPicker(false);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Toolbar</h2>

      <div className="tool-group">
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
          onClick={() => {
            if (!hasImage) {
              onError('Please upload an image first before adding stickers.');
              return;
            }
            setShowStickerPicker((prev) => !prev);
          }}
        >
          ⭐ {showStickerPicker ? 'Close Picker' : 'Add Sticker'}
        </button>

        {/* เรียกใช้ EmojiPicker Component */}
        {showStickerPicker && (
          <EmojiPicker onSelectEmoji={handleEmojiSelect} />
        )}
      </div>

      {/* แผงแก้ไข Text */}
      {selectedLayer && (
        <TextControls
          layer={selectedLayer}
          onUpdate={onUpdateTextLayer}
          onDelete={onDeleteTextLayer}
        />
      )}

      {/* แผงแก้ไข Sticker */}
      {selectedSticker && (
        <StickerControls
          sticker={selectedSticker}
          onUpdateSize={onUpdateStickerSize}
          onDelete={onDeleteSticker}
        />
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