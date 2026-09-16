import { Smile, Download, FileText } from "lucide-react";

export default function Header({ onDownloadPng, onDownloadPdf }) {
    return (
        <header className="editor-header">
            <div className="brand-wrapper">
                <Smile className="brand-logo" size={28} color="#6366f1" />
                <h1 className="brand-title">Meme Generator</h1>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onDownloadPdf}
                >
                    <FileText size={16} />
                    PDF
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onDownloadPng}
                >
                    <Download size={16} />
                    PNG
                </button>
            </div>
        </header>
    );
}
