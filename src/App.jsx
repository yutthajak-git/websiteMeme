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
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);

    const [textLayers, setTextLayers] = useState(savedData?.textLayers || []);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [stickers, setStickers] = useState(savedData?.stickers || []);
    const [selectedStickerId, setSelectedStickerId] = useState(null);

    const previewBoxRef = useRef(null);

    const handleImageSelect = (file) => {
        setErrorMessage(null);
        setInfoMessage(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            setImage(e.target.result);
        };
        reader.onerror = () => {
            setErrorMessage("Failed to read image file.");
        };
        reader.readAsDataURL(file);
    };

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

        setTextLayers((prev) => [...prev, newLayer]);
        setSelectedTextId(newLayer.id);
        setSelectedStickerId(null);
    };

    const handleUpdateTextPosition = (id, x, y) => {
        setTextLayers((prev) =>
            prev.map((layer) => (layer.id === id ? { ...layer, x, y } : layer)),
        );
    };

    const handleUpdateTextLayer = (field, value) => {
        setTextLayers((prev) =>
            prev.map((layer) =>
                layer.id === selectedTextId
                    ? { ...layer, [field]: value }
                    : layer,
            ),
        );
    };

    const handleDeleteTextLayer = () => {
        setTextLayers((prev) =>
            prev.filter((layer) => layer.id !== selectedTextId),
        );
        setSelectedTextId(null);
    };

    const handleAddSticker = (emoji) => {
        if (!image) {
            setErrorMessage(
                "Please upload an image first before adding stickers.",
            );
            return;
        }
        setErrorMessage(null);

        const newSticker = {
            id: Date.now(),
            emoji,
            x: 180,
            y: 180,
            size: 48,
        };

        setStickers((prev) => [...prev, newSticker]);
        setSelectedStickerId(newSticker.id);
        setSelectedTextId(null);
    };

    const handleUpdateStickerPosition = (id, x, y) => {
        setStickers((prev) =>
            prev.map((sticker) =>
                sticker.id === id ? { ...sticker, x, y } : sticker,
            ),
        );
    };

    const handleUpdateStickerSize = (size) => {
        setStickers((prev) =>
            prev.map((s) => (s.id === selectedStickerId ? { ...s, size } : s)),
        );
    };

    const handleDeleteSticker = () => {
        setStickers((prev) => prev.filter((s) => s.id !== selectedStickerId));
        setSelectedStickerId(null);
    };

    const handleSaveProject = () => {
        setErrorMessage(null);
        setInfoMessage(null);

        if (!image && textLayers.length === 0 && stickers.length === 0) {
            setErrorMessage("No project content to save.");
            return;
        }

        const result = saveProjectToStorage({ image, textLayers, stickers });
        if (result.success) {
            setInfoMessage(
                "Project saved successfully! You can refresh safely.",
            );
            setTimeout(() => setInfoMessage(null), 3500);
        } else {
            setErrorMessage(result.error);
        }
    };

    const handleClearProject = () => {
        if (
            !window.confirm("Are you sure you want to clear this meme project?")
        ) {
            return;
        }

        clearProjectFromStorage();
        setImage(null);
        setTextLayers([]);
        setStickers([]);
        setSelectedTextId(null);
        setSelectedStickerId(null);
        setErrorMessage(null);
        setInfoMessage("Project cleared.");
        setTimeout(() => setInfoMessage(null), 2500);
    };

    // Export PNG
    const handleDownloadMeme = async () => {
        if (!image) {
            setErrorMessage("Please upload an image first before downloading.");
            return;
        }

        try {
            setErrorMessage(null);
            setSelectedTextId(null);
            setSelectedStickerId(null);

            await exportMemeAsPng({
                containerElement: previewBoxRef.current,
                imageUrl: image,
                textLayers,
                stickers,
                filename: `meme-${Date.now()}.png`,
            });
        } catch (err) {
            console.error("PNG export failed:", err);
            setErrorMessage("Failed to export PNG. Please try again.");
        }
    };

    // Export PDF
    const handleDownloadPdf = async () => {
        if (!image) {
            setErrorMessage(
                "Please upload an image first before exporting PDF.",
            );
            return;
        }

        try {
            setErrorMessage(null);
            setSelectedTextId(null);
            setSelectedStickerId(null);

            await exportMemeAsPdf({
                containerElement: previewBoxRef.current,
                imageUrl: image,
                textLayers,
                stickers,
                filename: `meme-${Date.now()}.pdf`,
            });
        } catch (err) {
            console.error("PDF export failed:", err);
            setErrorMessage("Failed to export PDF. Please try again.");
        }
    };

    const selectedLayer = textLayers.find(
        (layer) => layer.id === selectedTextId,
    );
    const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

    return (
        <div className="editor-container">
            <Header
                onDownloadPng={handleDownloadMeme}
                onDownloadPdf={handleDownloadPdf}
            />

            <div className="editor-body">
                <PreviewArea
                    ref={previewBoxRef}
                    image={image}
                    errorMessage={errorMessage || infoMessage}
                    textLayers={textLayers}
                    selectedTextId={selectedTextId}
                    onSelectText={(id) => {
                        setSelectedTextId(id);
                        if (id) setSelectedStickerId(null);
                    }}
                    onUpdateTextPosition={handleUpdateTextPosition}
                    stickers={stickers}
                    selectedStickerId={selectedStickerId}
                    onSelectSticker={(id) => {
                        setSelectedStickerId(id);
                        if (id) setSelectedTextId(null);
                    }}
                    onUpdateStickerPosition={handleUpdateStickerPosition}
                />

                <Sidebar
                    hasImage={Boolean(image)}
                    onImageSelect={handleImageSelect}
                    onError={setErrorMessage}
                    onAddText={handleAddText}
                    selectedLayer={selectedLayer}
                    onUpdateTextLayer={handleUpdateTextLayer}
                    onDeleteTextLayer={handleDeleteTextLayer}
                    onAddSticker={handleAddSticker}
                    selectedSticker={selectedSticker}
                    onUpdateStickerSize={handleUpdateStickerSize}
                    onDeleteSticker={handleDeleteSticker}
                    onDownloadClick={handleDownloadMeme}
                    onDownloadPdfClick={handleDownloadPdf}
                    onSaveProject={handleSaveProject}
                    onClearProject={handleClearProject}
                />
            </div>
        </div>
    );
}
