export default function Header({ onDownloadClick }) {
  return (
    <header className="editor-header">
      <h1 className="brand-title">Meme Generator</h1>
      <button
        type="button"
        className="btn btn-primary"
        onClick={onDownloadClick}
      >
        Download
      </button>
    </header>
  );
}