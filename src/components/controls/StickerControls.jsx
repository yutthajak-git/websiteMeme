import { Trash2 } from "lucide-react";

export default function StickerControls({ sticker, onUpdateSize, onDelete }) {
    if (!sticker) return null;

    return (
        <div className="layer-controls">
            <h3 className="layer-controls-title">
                Edit Sticker {sticker.emoji}
            </h3>

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
