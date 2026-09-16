import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import PreviewArea from "./components/PreviewArea";
import Sidebar from "./components/Sidebar";
import { exportMemeAsPng } from "./utils/exportMeme";
import "./App.css";

export default function App() {
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Layers State
    const [textLayers, setTextLayers] = useState([]);
    const [selectedTextId, setSelectedTextId] = useState(null);
    const [stickers, setStickers] = useState([]);
    const [selectedStickerId, setSelectedStickerId] = useState(null);

    // Ref สำหรับเข้าถึง DOM กล่อง Preview
    const previewBoxRef = useRef(null);

    useEffect(() => {
        return () => {
            if (image) {
                URL.revokeObjectURL(image);
            }
        };
    }, [image]);

    const handleImageSelect = (file) => {
        setErrorMessage(null);
        if (image) {
            URL.revokeObjectURL(image);
        }
        const previewUrl = URL.createObjectURL(file);
        setImage(previewUrl);
    };

    // --- Text Layer Handlers ---
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

    // --- Sticker Handlers ---
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

    // --- Export Action Handler ---
    const handleDownloadMeme = async () => {
        if (!image) {
            setErrorMessage("Please upload an image first before downloading.");
            return;
        }

        try {
            setErrorMessage(null);
            // เคลียร์ selection ชั่วคราวก่อนเริ่ม export
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
            console.error("Export failed:", err);
            setErrorMessage("Failed to export meme. Please try again.");
        }
    };

    const selectedLayer = textLayers.find(
        (layer) => layer.id === selectedTextId,
    );
    const selectedSticker = stickers.find((s) => s.id === selectedStickerId);

    return (
        <div className="editor-container">
            <Header onDownloadClick={handleDownloadMeme} />

            <div className="editor-body">
                <PreviewArea
                    ref={previewBoxRef}
                    image={image}
                    errorMessage={errorMessage}
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
                />
            </div>
        </div>
    );
}
