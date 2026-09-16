export default function PreviewArea({ image, errorMessage }) {
  return (
    <main className="preview-area">
      {errorMessage && (
        <div className="error-banner" role="alert">
          {errorMessage}
        </div>
      )}

      <div className={`meme-canvas-placeholder ${image ? 'has-image' : ''}`}>
        {image ? (
          <img
            src={image}
            alt="Selected Meme Preview"
            className="preview-image"
          />
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