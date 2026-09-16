const STORAGE_KEY = "meme_project_data";

/**
 * Safely load saved project data from browser localStorage.
 */
export function loadProjectFromStorage() {
    try {
        const rawData = localStorage.getItem(STORAGE_KEY);
        if (!rawData) return null;

        const parsed = JSON.parse(rawData);

        return {
            image: typeof parsed.image === "string" ? parsed.image : null,
            textLayers: Array.isArray(parsed.textLayers)
                ? parsed.textLayers
                : [],
            stickers: Array.isArray(parsed.stickers) ? parsed.stickers : [],
        };
    } catch (error) {
        console.error(
            "Failed to parse saved project from localStorage:",
            error,
        );
        return null;
    }
}

/**
 * Save project data to localStorage with quota-exceeded safeguard.
 */
export function saveProjectToStorage({ image, textLayers, stickers }) {
    try {
        const payload = JSON.stringify({
            image,
            textLayers,
            stickers,
            savedAt: Date.now(),
        });

        localStorage.setItem(STORAGE_KEY, payload);
        return { success: true };
    } catch (error) {
        console.error("Failed to save project to localStorage:", error);
        if (error.name === "QuotaExceededError" || error.code === 22) {
            return {
                success: false,
                error: "Image is too large to fit in browser storage. Try a smaller image.",
            };
        }
        return {
            success: false,
            error: "Failed to save project. Please try again.",
        };
    }
}

/**
 * Remove saved project data from localStorage.
 */
export function clearProjectFromStorage() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error("Failed to clear storage:", error);
        return false;
    }
}
