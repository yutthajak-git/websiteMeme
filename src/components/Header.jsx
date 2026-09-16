import { Smile, Download, FileText, Undo2, Redo2 } from "lucide-react";

export default function Header({
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onDownloadPng,
    onDownloadPdf,
}) {
    return (
        <header className="editor-header">
            <div className="brand-wrapper">
                <Smile className="brand-logo" size={28} color="#6366f1" />
                <h1 className="brand-title">Meme Generator</h1>
            </div>

            <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
                {/* Undo / Redo Buttons */}
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onUndo}
                    disabled={!canUndo}
                    style={{
                        opacity: canUndo ? 1 : 0.35,
                        cursor: canUndo ? "pointer" : "not-allowed",
                        padding: "0.5rem",
                    }}
                    title="Undo (Ctrl+Z)"
                >
                    <Undo2 size={16} />
                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onRedo}
                    disabled={!canRedo}
                    style={{
                        opacity: canRedo ? 1 : 0.35,
                        cursor: canRedo ? "pointer" : "not-allowed",
                        padding: "0.5rem",
                    }}
                    title="Redo (Ctrl+Y)"
                >
                    <Redo2 size={16} />
                </button>

                {/* Download Buttons */}
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
