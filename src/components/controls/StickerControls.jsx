import { Trash2, X } from "lucide-react";

export default function StickerControls({
    sticker,
    onUpdateSize,
    onDelete,
    onClose,
}) {
    if (!sticker) return null;

    return (
        <div className="layer-controls">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <h3 className="layer-controls-title">
                    Edit Sticker {sticker.emoji}
                </h3>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "2px",
                        display: "flex",
                        alignItems: "center",
                    }}
                    title="Close sticker editor"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="control-field">
                <label htmlFor="sticker-size">
                    Size ({sticker.size || 48}px)
                </label>
                <input
                    id="sticker-size"
                    type="range"
                    min="24"
                    max="120"
                    value={sticker.size || 48}
                    onChange={(e) => onUpdateSize(Number(e.target.value))}
                />
            </div>

            <button
                type="button"
                className="btn btn-danger btn-full"
                onClick={onDelete}
            >
                <Trash2 size={16} />
                Delete Sticker
            </button>
        </div>
    );
}
