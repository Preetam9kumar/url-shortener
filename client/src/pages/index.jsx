import React, { useState, useEffect } from 'react';
import { Copy, Link, Loader2, CheckCircle, ExternalLink, Trash2, AlertCircle } from 'lucide-react';
import { validateUrl, formatUrl } from "../components/urlFun.js";
import { copyToClipboard } from '../components/copyToClipboard.js';




const UrlShortener = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortenedUrls, setShortenedUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState(null);


    const handleSubmit = async () => {
        setError('');

        if (!originalUrl.trim()) {
            setError('Please enter a URL');
            return;
        }

        if (!validateUrl(originalUrl)) {
            setError('Please enter a valid URL');
            return;
        }

        setIsLoading(true);

        try {
            const formattedUrl = formatUrl(originalUrl);

            // Make API call using fetch
            const response = await fetch(`/api/shorten`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    originalUrl: formattedUrl
                })
            });

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Too many requests. Please try again later.');
                }
                throw new Error('Failed to shorten URL');
            }

            const data = await response.json();
            // Extract short code from response
            const shortUrl = data.shortUrl;
            const originalURL = data.originalUrl;
            const newUrl = {
                id: Date.now(),
                original: formattedUrl,
                short: `${shortUrl}`,
                shortUrl: shortUrl,
                createdAt: new Date().toISOString(),
                clicks: 0
            };

            setShortenedUrls([newUrl, ...shortenedUrls]);
            setOriginalUrl('');
        } catch (err) {
            console.error('Error shortening URL:', err);
            if (err.message) {
                setError(err.message);
            } else {
                setError('Cannot connect to server. Make sure your backend is running on port 3000.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const deleteUrl = (id) => {
        setShortenedUrls(shortenedUrls.filter(url => url.id !== id));
    };

    // Load saved URLs from component state (in-memory storage)
    useEffect(() => {
        // Initialize with sample data for demonstration
        setShortenedUrls([]);
    }, []);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-200">
                            <Link className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">URL Shortener</h1>
                    <p className="text-gray-600">Transform long URLs into short, shareable links</p>
                </div>

                {/* Input Section */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 transform hover:shadow-2xl transition-shadow duration-200">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Enter your long URL
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={originalUrl}
                                    onChange={(e) => setOriginalUrl(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="https://example.com/very-long-url-here"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    disabled={isLoading}
                                />
                                <Link className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Shortening...
                                </>
                            ) : (
                                <>
                                    <Link className="w-5 h-5 mr-2" />
                                    Shorten URL
                                </>
                            )}
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            <strong>Note:</strong> Make sure shortening a valid uRLs e.g. <code className="bg-blue-100 px-1 py-0.5 rounded">http://facebook.com/myprofile97e12o6e</code>
                        </p>
                    </div>
                </div>

                {/* Shortened URLs List */}
                {shortenedUrls.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Your Shortened URLs</h2>
                            <span className="text-sm text-gray-500">{shortenedUrls.length} link{shortenedUrls.length !== 1 ? 's' : ''}</span>
                        </div>

                        {shortenedUrls.map((url) => (
                            <div
                                key={url.id}
                                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transform hover:scale-[1.01] transition-all duration-200"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-2 mb-2">
                                            <p className="text-sm text-gray-500 truncate" title={url.original}>
                                                {url.original}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={url.short}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 group"
                                            >
                                                <span>{url.short}</span>
                                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <p className="text-xs text-gray-400">
                                                Created {formatDate(url.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => copyToClipboard(url.short, url.id, setCopiedId)}
                                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-2 hover:shadow-md"
                                        >
                                            {copiedId === url.id ? (
                                                <>
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-green-600 font-medium">Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 text-gray-600" />
                                                    <span className="text-gray-600 font-medium">Copy</span>
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deleteUrl(url.id, setShortenedUrls, shortenedUrls)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {shortenedUrls.length === 0 && !error && (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                            <Link className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No shortened URLs yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto">
                            Start by entering a long URL above and we'll create a short link for you
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-500">
                    <p>Built with MERN Stack by Preetam Kumar @DevWeekends </p>
                </div>
            </div>
        </div>
    );
}


export default UrlShortener;