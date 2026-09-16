import { useState, useEffect } from 'react';
import Header from './components/Header';
import PreviewArea from './components/PreviewArea';
import Sidebar from './components/Sidebar';
import './App.css';

export default function App() {
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // คืน Memory เมื่อ Component Unmount หรือเมื่อ Image เปลี่ยน
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

  const handlePlaceholderClick = (actionName) => {
    alert(`[Placeholder] ${actionName} feature will be implemented next.`);
  };

  return (
    <div className="editor-container">
      <Header onDownloadClick={() => handlePlaceholderClick('Download')} />

      <div className="editor-body">
        <PreviewArea image={image} errorMessage={errorMessage} />

        <Sidebar
          hasImage={Boolean(image)}
          onImageSelect={handleImageSelect}
          onError={setErrorMessage}
          onPlaceholderClick={handlePlaceholderClick}
        />
      </div>
    </div>
  );
}