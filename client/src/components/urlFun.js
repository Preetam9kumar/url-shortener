

// import {setError, setIsLoading, setOriginalUrl, setShortenedUrls} from "../pages/index.jsx";
export const validateUrl = (url) => {
    try {
        new URL(url);
        return true;
    } catch {
        // Try adding https:// if missing
        try {
            new URL(`https://${url}`);
            return true;
        } catch {
            return false;
        }
    }
};

export const formatUrl = (url) => {
    // Add https:// if no protocol is specified
    if (!url.match(/^https?:\/\//)) {
        return `https://${url}`;
    }
    return url;
};

