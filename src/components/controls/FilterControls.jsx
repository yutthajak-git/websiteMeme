import { Sliders, ChevronDown, ChevronUp } from "lucide-react";

export const FILTERS = [
    { name: "Normal", value: "none" },
    { name: "Grayscale", value: "grayscale(100%)" },
    { name: "Sepia", value: "sepia(80%)" },
    { name: "Contrast", value: "contrast(160%)" },
    { name: "Vintage", value: "sepia(50%) hue-rotate(-30deg) saturate(140%)" },
    { name: "Invert", value: "invert(90%)" },
];

export default function FilterControls({
    currentFilter,
    onSelectFilter,
    isOpen,
    onToggle,
}) {
    return (
        <div className="layer-controls">
            {/* Header ที่กดเพื่อย่อ/ขยายได้ */}
            <button
                type="button"
                onClick={onToggle}
                style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    cursor: "pointer",
                    padding: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                    }}
                >
                    <Sliders size={16} />
                    <h3 className="layer-controls-title" style={{ margin: 0 }}>
                        Image Filter
                    </h3>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {/* ซ่อน/แสดงเนื้อหาตาม isOpen */}
            {isOpen && (
                <div className="filter-grid" style={{ marginTop: "0.5rem" }}>
                    {FILTERS.map((f) => (
                        <button
                            key={f.name}
                            type="button"
                            className={`btn btn-secondary ${
                                currentFilter === f.value ? "active" : ""
                            }`}
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
            )}
        </div>
    );
}
