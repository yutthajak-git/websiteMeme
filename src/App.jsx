import { useState, useEffect } from "react";
import Header from "./components/Header";
import PreviewArea from "./components/PreviewArea";
import Sidebar from "./components/Sidebar";
import "./App.css";

export default function App() {
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [textLayers, setTextLayers] = useState([]);
    const [selectedTextId, setSelectedTextId] = useState(null);

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

    // Add Text Layer
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
    };

    // Drag position update
    const handleUpdateTextPosition = (id, x, y) => {
        setTextLayers((prev) =>
            prev.map((layer) => (layer.id === id ? { ...layer, x, y } : layer)),
        );
    };

    // Update text property (text, fontSize, color)
    const handleUpdateTextLayer = (field, value) => {
        setTextLayers((prev) =>
            prev.map((layer) =>
                layer.id === selectedTextId
                    ? { ...layer, [field]: value }
                    : layer,
            ),
        );
    };

    // Delete current selected text layer
    const handleDeleteTextLayer = () => {
        setTextLayers((prev) =>
            prev.filter((layer) => layer.id !== selectedTextId),
        );
        setSelectedTextId(null);
    };

    const handlePlaceholderClick = (actionName) => {
        alert(`[Placeholder] ${actionName} feature will be implemented next.`);
    };

    const selectedLayer = textLayers.find(
        (layer) => layer.id === selectedTextId,
    );

    return (
        <div className="editor-container">
            <Header
                onDownloadClick={() => handlePlaceholderClick("Download")}
            />

            <div className="editor-body">
                <PreviewArea
                    image={image}
                    errorMessage={errorMessage}
                    textLayers={textLayers}
                    selectedTextId={selectedTextId}
                    onSelectText={setSelectedTextId}
                    onUpdateTextPosition={handleUpdateTextPosition}
                />

                <Sidebar
                    hasImage={Boolean(image)}
                    onImageSelect={handleImageSelect}
                    onError={setErrorMessage}
                    onAddText={handleAddText}
                    selectedLayer={selectedLayer}
                    onUpdateTextLayer={handleUpdateTextLayer}
                    onDeleteTextLayer={handleDeleteTextLayer}
                    onPlaceholderClick={handlePlaceholderClick}
                />
            </div>
        </div>
    );
}
