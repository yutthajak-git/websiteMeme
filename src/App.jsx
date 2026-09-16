import "./App.css";

export default function App() {
    const handlePlaceholderClick = (actionName) => {
        alert(`[Placeholder] ${actionName} feature will be implemented next.`);
    };

    return (
        <div className="editor-container">
            {/* Top Navbar */}
            <header className="editor-header">
                <h1 className="brand-title">Meme Generator</h1>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handlePlaceholderClick("Download")}
                >
                    Download
                </button>
            </header>

            {/* Main Studio Area */}
            <div className="editor-body">
                {/* Meme Stage / Preview Workspace */}
                <main className="preview-area">
                    <div className="meme-canvas-placeholder">
                        <div className="placeholder-content">
                            <span className="placeholder-icon">🖼️</span>
                            <h3>Preview Area</h3>
                            <p>Meme canvas will appear here</p>
                        </div>
                    </div>
                </main>

                {/* Editing Tools Sidebar */}
                <aside className="sidebar">
                    <h2 className="sidebar-title">Toolbar</h2>

                    <div className="tool-group">
                        <button
                            type="button"
                            className="btn btn-secondary btn-full"
                            onClick={() =>
                                handlePlaceholderClick("Upload Image")
                            }
                        >
                            📷 Upload Image
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-full"
                            onClick={() => handlePlaceholderClick("Add Text")}
                        >
                            🔤 Add Text
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary btn-full"
                            onClick={() =>
                                handlePlaceholderClick("Add Sticker")
                            }
                        >
                            ⭐ Add Sticker
                        </button>
                    </div>

                    <hr
                        style={{
                            borderColor: "var(--border-color)",
                            margin: "0.5rem 0",
                        }}
                    />

                    <div className="tool-group">
                        <button
                            type="button"
                            className="btn btn-primary btn-full"
                            onClick={() => handlePlaceholderClick("Download")}
                        >
                            Download Meme
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
