import { useRef, useState } from "react";
import {
    ImagePlus,
    Type,
    Sparkles,
    X,
    Download,
    Save,
    RotateCcw,
} from "lucide-react";
import EmojiPicker from "./controls/EmojiPicker";
import TextControls from "./controls/TextControls";
import StickerControls from "./controls/StickerControls";

const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export default function Sidebar({
    hasImage,
    onImageSelect,
    onError,
    onAddText,
    selectedLayer,
    onUpdateTextLayer,
    onDeleteTextLayer,
    onAddSticker,
    selectedSticker,
    onUpdateStickerSize,
    onDeleteSticker,
    onDownloadClick,
    onSaveProject,
    onClearProject,
}) {
    const fileInputRef = useRef(null);
    const [showStickerPicker, setShowStickerPicker] = useState(false);

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

    return (
        <aside className="sidebar">
            <h2 className="sidebar-title">Toolbar</h2>

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
                    className="btn btn-secondary btn-full"
                    onClick={() => {
                        if (!hasImage) {
                            onError(
                                "Please upload an image first before adding stickers.",
                            );
                            return;
                        }
                        setShowStickerPicker((prev) => !prev);
                    }}
                >
                    {showStickerPicker ? (
                        <X size={18} />
                    ) : (
                        <Sparkles size={18} />
                    )}
                    {showStickerPicker ? "Close Picker" : "Add Sticker"}
                </button>

                {showStickerPicker && (
                    <EmojiPicker onSelectEmoji={handleEmojiSelect} />
                )}
            </div>

            {/* Selected Text Layer Controls */}
            {selectedLayer && (
                <TextControls
                    layer={selectedLayer}
                    onUpdate={onUpdateTextLayer}
                    onDelete={onDeleteTextLayer}
                />
            )}

            {/* Selected Sticker Layer Controls */}
            {selectedSticker && (
                <StickerControls
                    sticker={selectedSticker}
                    onUpdateSize={onUpdateStickerSize}
                    onDelete={onDeleteSticker}
                />
            )}

            <hr
                style={{
                    borderColor: "var(--border-color)",
                    margin: "0.5rem 0",
                }}
            />

            {/* Storage Controls */}
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
                    margin: "0.5rem 0",
                }}
            />

            {/* Export / Download */}
            <div className="tool-group">
                <button
                    type="button"
                    className="btn btn-primary btn-full"
                    onClick={onDownloadClick}
                >
                    <Download size={18} />
                    Download Meme
                </button>
            </div>
        </aside>
    );
}
