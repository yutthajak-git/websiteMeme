import { Sliders } from "lucide-react";

export const FILTERS = [
    { name: "Normal", value: "none" },
    { name: "Grayscale", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(80%)" },
    { name: "Contrast", value: "contrast(160%)" },
    { name: "Vintage", value: "sepia(50%) hue-rotate(-30deg) saturate(140%)" },
    { name: "Invert", value: "invert(90%)" },
];

export default function FilterControls({ currentFilter, onSelectFilter }) {
    return (
        <div className="layer-controls">
            <div
                style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            >
                <Sliders size={16} />
                <h3 className="layer-controls-title">Image Filter</h3>
            </div>

            <div className="filter-grid">
                {FILTERS.map((f) => (
                    <button
                        key={f.name}
                        type="button"
                        className={`btn btn-secondary ${currentFilter === f.value ? "active" : ""}`}
                        style={{
                            fontSize: "0.75rem",
                            padding: "0.4rem 0.6rem",
                        }}
                        onClick={() => onSelectFilter(f.value)}
                    >
                        {f.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
