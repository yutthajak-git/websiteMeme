import { useRef, useState } from "react";
import {
    ImagePlus,
    Type,
    Sparkles,
    X,
    Download,
    Save,
    RotateCcw,
    FileText,
    Undo2,
    Redo2,
} from "lucide-react";
import EmojiPicker from "./controls/EmojiPicker";
import TextControls from "./controls/TextControls";
import StickerControls from "./controls/StickerControls";
import FilterControls from "./controls/FilterControls";

const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export default function Sidebar({
    hasImage,
    onImageSelect,
    onError,
    filter,
    onSelectFilter,
    onAddText,
    selectedLayer,
    onUpdateTextLayer,
    onDeleteTextLayer,
    onDeselectText,
    onAddSticker,
    selectedSticker,
    onUpdateStickerSize,
    onDeleteSticker,
    onDeselectSticker,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onDownloadClick,
    onDownloadPdfClick,
    onSaveProject,
    onClearProject,
}) {
    const fileInputRef = useRef(null);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const handleUploadBtnClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!SUPPORTED_FORMATS.includes(file.type)) {
            onError(
                "Unsupported file format. Please upload a JPG, JPEG, PNG, or WEBP image.",
            );
            return;
        }

        onImageSelect(file);
    };

    const handleEmojiSelect = (emoji) => {
        onAddSticker(emoji);
        setShowStickerPicker(false);
    };

    const toggleStickerPicker = () => {
        if (!hasImage) {
            onError("Please upload an image first before adding stickers.");
            return;
        }
        setShowStickerPicker((prev) => !prev);
        if (!showStickerPicker) setShowFilterDropdown(false);
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown((prev) => !prev);
        if (!showFilterDropdown) setShowStickerPicker(false);
    };

    return (
        <aside className="sidebar">
            {/* Undo / Redo Header Row */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <h2 className="sidebar-title" style={{ margin: 0 }}>
                    Toolbar
                </h2>
                <div style={{ display: "flex", gap: "0.35rem" }}>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onUndo}
                        disabled={!canUndo}
                        style={{
                            padding: "0.35rem 0.6rem",
                            opacity: canUndo ? 1 : 0.35,
                            cursor: canUndo ? "pointer" : "not-allowed",
                        }}
                        title="Undo"
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onRedo}
                        disabled={!canRedo}
                        style={{
                            padding: "0.35rem 0.6rem",
                            opacity: canRedo ? 1 : 0.35,
                            cursor: canRedo ? "pointer" : "not-allowed",
                        }}
                        title="Redo"
                    >
                        <Redo2 size={16} />
                    </button>
                </div>
            </div>

            {/* Action Tools */}
            <div className="tool-group">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg, .jpeg, .png, .webp, image/jpeg, image/png, image/webp"
                    className="hidden-file-input"
                />

                <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    onClick={handleUploadBtnClick}
                >
                    <ImagePlus size={18} />
                    {hasImage ? "Replace Image" : "Upload Image"}
                </button>

                <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    onClick={onAddText}
                >
                    <Type size={18} />
                    Add Text
                </button>

                <button
                    type="button"
                    className={`btn btn-secondary btn-full ${showStickerPicker ? "btn-primary" : ""}`}
                    onClick={toggleStickerPicker}
                >
                    {showStickerPicker ? (
                        <X size={18} />
                    ) : (
                        <Sparkles size={18} />
                    )}
                    {showStickerPicker ? "Close Stickers" : "Add Sticker"}
                </button>

                {showStickerPicker && (
                    <EmojiPicker onSelectEmoji={handleEmojiSelect} />
                )}
            </div>

            {/* Edit Selected Text Layer */}
            {selectedLayer && (
                <TextControls
                    layer={selectedLayer}
                    onUpdate={onUpdateTextLayer}
                    onDelete={onDeleteTextLayer}
                    onClose={onDeselectText}
                />
            )}

            {/* Edit Selected Sticker Layer */}
            {selectedSticker && (
                <StickerControls
                    sticker={selectedSticker}
                    onUpdateSize={onUpdateStickerSize}
                    onDelete={onDeleteSticker}
                    onClose={onDeselectSticker}
                />
            )}

            {/* Image Filter */}
            {hasImage && (
                <FilterControls
                    currentFilter={filter}
                    onSelectFilter={onSelectFilter}
                    isOpen={showFilterDropdown}
                    onToggle={toggleFilterDropdown}
                />
            )}

            <hr
                style={{
                    borderColor: "var(--border-color)",
                    margin: "0.25rem 0",
                }}
            />

            {/* Project Storage */}
            <div className="tool-group">
                <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    onClick={onSaveProject}
                >
                    <Save size={18} />
                    Save Project
                </button>

                <button
                    type="button"
                    className="btn btn-danger btn-full"
                    onClick={onClearProject}
                >
                    <RotateCcw size={18} />
                    Clear Project
                </button>
            </div>

            <hr
                style={{
                    borderColor: "var(--border-color)",
                    margin: "0.25rem 0",
                }}
            />

            {/* Export / Download Buttons */}
            <div className="tool-group">
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={onDownloadClick}
                >
                    <Download size={18} />
                    Download PNG
                </button>

                <button
                    type="button"
                    className="btn btn-secondary btn-full"
                    onClick={onDownloadPdfClick}
                >
                    <FileText size={18} />
                    Export PDF
                </button>
            </div>
        </aside>
    );
}
