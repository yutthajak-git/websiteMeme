import { useState } from 'react';
import { EMOJI_CATEGORIES } from '../../data/emojis';

export default function EmojiPicker({ onSelectEmoji }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="sticker-picker-box">
      {/* Category Tabs */}
      <div className="emoji-tabs">
        {EMOJI_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            type="button"
            className={`emoji-tab-btn ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            className="emoji-btn"
            onClick={() => onSelectEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}