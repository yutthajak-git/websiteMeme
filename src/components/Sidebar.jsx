import { useRef } from 'react';

const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];

export default function Sidebar({
  hasImage,
  onImageSelect,
  onError,
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
    event.target.value = ''; // เคลียร์เพื่อให้เลือกไฟล์เดิมซ้ำได้

    if (!file) return;

    if (!SUPPORTED_FORMATS.includes(file.type)) {
      onError('Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.');
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
          onClick={() => onPlaceholderClick('Add Text')}
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