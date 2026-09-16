import { Trash2 } from "lucide-react";

export default function TextControls({ layer, onUpdate, onDelete }) {
    if (!layer) return null;

    return (
        <div className="layer-controls">
            <h3 className="layer-controls-title">Edit Selected Text</h3>

            <div className="control-field">
                <label htmlFor="text-content">Text</label>
                <input
                    id="text-content"
                    type="text"
                    className="control-input"
                    value={layer.text}
                    onChange={(e) => onUpdate("text", e.target.value)}
                    placeholder="Enter text..."
                />
            </div>

            <div className="control-row">
                <div className="control-field" style={{ flex: 1 }}>
                    <label htmlFor="font-size">Size ({layer.fontSize}px)</label>
                    <input
                        id="font-size"
                        type="range"
                        min="14"
                        max="72"
                        value={layer.fontSize}
                        onChange={(e) =>
                            onUpdate("fontSize", Number(e.target.value))
                        }
                    />
                </div>

                <div className="control-field">
                    <label htmlFor="text-color">Color</label>
                    <input
                        id="text-color"
                        type="color"
                        className="color-picker"
                        value={layer.color}
                        onChange={(e) => onUpdate("color", e.target.value)}
                    />
                </div>
            </div>

            <button
                type="button"
                className="btn btn-danger btn-full"
                onClick={onDelete}
            >
                <Trash2 size={16} />
                Delete Text
            </button>   
        </div>
    );
}
