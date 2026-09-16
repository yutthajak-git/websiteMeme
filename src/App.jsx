import { useState, useRef } from "react";
import Header from "./components/Header";
import PreviewArea from "./components/PreviewArea";
import Sidebar from "./components/Sidebar";
import { exportMemeAsPng } from "./utils/exportMeme";
import { exportMemeAsPdf } from "./utils/exportPdf";
import {
    loadProjectFromStorage,
    saveProjectToStorage,
    clearProjectFromStorage,
} from "./utils/storage";
import "./App.css";

export default function App() {
    const savedData = loadProjectFromStorage();

    const [image, setImage] = useState(savedData?.image || null);
    const [filter, setFilter] = useState(savedData?.filter || "none");
    const [textLayers, setTextLayers] = useState(savedData?.textLayers || []);
    const [stickers, setStickers] = useState(savedData?.stickers || []);

    const [selectedTextId, setSelectedTextId] = useState(null);
    const [selectedStickerId, setSelectedStickerId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);

    const previewBoxRef = useRef(null);

    // --- Undo / Redo History Stack ---
    const [history, setHistory] = useState([
        {
            image: savedData?.image || null,
            filter: savedData?.filter || "none",
            textLayers: savedData?.textLayers || [],
            stickers: savedData?.stickers || [],
        },
    ]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const pushHistory = (newState) => {
        const updated = {
            image,
            filter,
            textLayers,
            stickers,
            ...newState,
        };
        const nextHistory = history.slice(0, historyIndex + 1);
        setHistory([...nextHistory, updated]);
        setHistoryIndex(nextHistory.length);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const prev = history[historyIndex - 1];
            setImage(prev.image);
            setFilter(prev.filter);
            setTextLayers(prev.textLayers);
            setStickers(prev.stickers);
            setHistoryIndex((idx) => idx - 1);
            setSelectedTextId(null);
            setSelectedStickerId(null);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const next = history[historyIndex + 1];
            setImage(next.image);
            setFilter(next.filter);
            setTextLayers(next.textLayers);
            setStickers(next.stickers);
            setHistoryIndex((idx) => idx + 1);
            setSelectedTextId(null);
            setSelectedStickerId(null);
        }
    };

    // Upload Image
    const handleImageSelect = (file) => {
        setErrorMessage(null);
        setInfoMessage(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            const newImg = e.target.result;
            setImage(newImg);
            pushHistory({ image: newImg });
        };
        reader.onerror = () => {
            setErrorMessage("Failed to read image file.");
        };
        reader.readAsDataURL(file);
    };

    // Filter Selection
    const handleSelectFilter = (newFilter) => {
        setFilter(newFilter);
        pushHistory({ filter: newFilter });
    };

    // Text Handlers
    const handleAddText = () => {
        if (!image) {
            setErrorMessage("Please upload an image first before adding text.");
            return;
        }
        setErrorMessage(null);
        const newLayer = {
            id: Date.now(),
            text: textLayers.length === 0 ? "TOP TEXT" : "BOTTOM TEXT",
            x: 30,
            y: textLayers.length === 0 ? 30 : 380,
            fontSize: 36,
            color: "#ffffff",
        };
        const updated = [...textLayers, newLayer];
        setTextLayers(updated);
        setSelectedTextId(newLayer.id);
        setSelectedStickerId(null);
        pushHistory({ textLayers: updated });
    };

    const handleUpdateTextPosition = (id, x, y) => {
        setTextLayers((prev) =>
            prev.map((layer) => (layer.id === id ? { ...layer, x, y } : layer)),
        );
    };

    const handleUpdateTextLayer = (field, value) => {
        const updated = textLayers.map((layer) =>
            layer.id === selectedTextId ? { ...layer, [field]: value } : layer,
        );
        setTextLayers(updated);
        pushHistory({ textLayers: updated });
    };

    const handleDeleteTextLayer = () => {
        const updated = textLayers.filter(
            (layer) => layer.id !== selectedTextId,
        );
        setTextLayers(updated);
        setSelectedTextId(null);
        pushHistory({ textLayers: updated });
    };

    // Sticker Handlers
    const handleAddSticker = (emoji) => {
        if (!image) {
            setErrorMessage(
                "Please upload an image first before adding stickers.",
            );
            return;
        }
        setErrorMessage(null);
        const newSticker = { id: Date.now(), emoji, x: 180, y: 180, size: 48 };
        const updated = [...stickers, newSticker];
        setStickers(updated);
        setSelectedStickerId(newSticker.id);
        setSelectedTextId(null);
        pushHistory({ stickers: updated });
    };

    const handleUpdateStickerPosition = (id, x, y) => {
        setStickers((prev) =>
            prev.map((s) => (s.id === id ? { ...s, x, y } : s)),
        );
    };

    const handleUpdateStickerSize = (size) => {
        const updated = stickers.map((s) =>
            s.id === selectedStickerId ? { ...s, size } : s,
        );
        setStickers(updated);
        pushHistory({ stickers: updated });
    };

    const handleDeleteSticker = () => {
        const updated = stickers.filter((s) => s.id !== selectedStickerId);
        setStickers(updated);
        setSelectedStickerId(null);
        pushHistory({ stickers: updated });
    };

    // Drag Finish Handler (บันทึก Snapshot ลงประวัติเมื่อปล่อยเมาส์)
    const handleEndDrag = () => {
        pushHistory({ textLayers, stickers });
    };

    // Save / Clear
    const handleSaveProject = () => {
        if (!image && textLayers.length === 0 && stickers.length === 0) {
            setErrorMessage("No project content to save.");
            return;
        }

        const result = saveProjectToStorage({
            image,
            filter,
            textLayers,
            stickers,
        });
        if (result.success) {
            setInfoMessage("Project saved!");
            setTimeout(() => setInfoMessage(null), 2500);
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleClearProject = () => {
        if (window.confirm("Clear all project content?")) {
            clearProjectFromStorage();
            setImage(null);
            setFilter("none");
            setTextLayers([]);
            setStickers([]);
            setSelectedTextId(null);
            setSelectedStickerId(null);
            setErrorMessage(null);
            setInfoMessage("Project cleared.");
            setTimeout(() => setInfoMessage(null), 2500);
            pushHistory({
                image: null,
                filter: "none",
                textLayers: [],
                stickers: [],
            });
        }
    };

    // Export Handlers
    const handleDownloadMeme = async () => {
        if (!image) return setErrorMessage("Upload image first");
        try {
            setErrorMessage(null);
            setSelectedTextId(null);
            setSelectedStickerId(null);
            await exportMemeAsPng({
                containerElement: previewBoxRef.current,
                imageUrl: image,
                textLayers,
                stickers,
                filter,
                filename: `meme-${Date.now()}.png`,
            });
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to export PNG.");
        }
    };

    const handleDownloadPdf = async () => {
        if (!image) return setErrorMessage("Upload image first");
        try {
            setErrorMessage(null);
            setSelectedTextId(null);
            setSelectedStickerId(null);
            await exportMemeAsPdf({
                containerElement: previewBoxRef.current,
                imageUrl: image,
                textLayers,
                stickers,
                filter,
                filename: `meme-${Date.now()}.pdf`,
            });
        } catch (err) {
            console.error(err);
            setErrorMessage("Failed to export PDF.");
        }
    };

    const selectedLayer = textLayers.find((l) => l.id === selectedTextId);
    const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

    return (
        <div className="editor-container">
            <Header />

            <div className="editor-body">
                <PreviewArea
                    ref={previewBoxRef}
                    image={image}
                    filter={filter}
                    errorMessage={errorMessage || infoMessage}
                    textLayers={textLayers}
                    selectedTextId={selectedTextId}
                    onSelectText={(id) => {
                        setSelectedTextId(id);
                        if (id) setSelectedStickerId(null);
                    }}
                    onUpdateTextPosition={handleUpdateTextPosition}
                    onEndTextDrag={handleEndDrag}
                    stickers={stickers}
                    selectedStickerId={selectedStickerId}
                    onSelectSticker={(id) => {
                        setSelectedStickerId(id);
                        if (id) setSelectedTextId(null);
                    }}
                    onUpdateStickerPosition={handleUpdateStickerPosition}
                    onEndStickerDrag={handleEndDrag}
                />

                <Sidebar
                    hasImage={Boolean(image)}
                    onImageSelect={handleImageSelect}
                    onError={setErrorMessage}
                    filter={filter}
                    onSelectFilter={handleSelectFilter}
                    onAddText={handleAddText}
                    selectedLayer={selectedLayer}
                    onUpdateTextLayer={handleUpdateTextLayer}
                    onDeleteTextLayer={handleDeleteTextLayer}
                    onDeselectText={() => setSelectedTextId(null)}
                    onAddSticker={handleAddSticker}
                    selectedSticker={selectedSticker}
                    onUpdateStickerSize={handleUpdateStickerSize}
                    onDeleteSticker={handleDeleteSticker}
                    onDeselectSticker={() => setSelectedStickerId(null)}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    onDownloadClick={handleDownloadMeme}
                    onDownloadPdfClick={handleDownloadPdf}
                    onSaveProject={handleSaveProject}
                    onClearProject={handleClearProject}
                />
            </div>
        </div>
    );
}
