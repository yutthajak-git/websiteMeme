import { Smile, Download } from "lucide-react";

export default function Header({ onDownloadClick }) {
    return (
        <header className="editor-header">
            <div className="brand-wrapper">
                <Smile className="brand-logo" size={28} color="#6366f1" />
                <h1 className="brand-title">Meme Generator</h1>
            </div>

            <button
                type="button"
                className="btn btn-primary"
                onClick={onDownloadClick}
            >
                <Download size={16} />
                Download
            </button>
        </header>
    );
}
