import React from "react";
import { useState } from "react";
import type { SubmitEvent } from "react";
import { Sparkles, ExternalLink, Image as ImageIcon } from "lucide-react";

// Own Components
import DropZone from "./DropZoneProps";
import ResultsInput from "./ResultsInput";
import SubmitButton from "./SubmitButton";
import ErrorBanner from "../Generic/ErrorBanner";

const ReverseImageSearch: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("limit", String(limit));

    try {
      const response = await fetch("https://api.dinofind.com/search", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResults([]);
      } else {
        setResults(data.results || []);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center max-w-4xl w-full mx-auto px-4 py-8">
      {error && <ErrorBanner message={error} onClose={() => setError(null)} />}

      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight flex items-center justify-center gap-2">
          Reverse Image Search
        </h1>
        <p className="text-lg text-gray-700 mb-1">Search through over 30,000 images</p>
        <p className="text-gray-500 text-sm">Your search is private and we do not store your search images.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 text-left transition-all duration-300 hover:shadow-2xl">
        <div className="p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select an image</label>
              <DropZone onFileSelect={setFile} fileSelected={!!file} />
            </div>
            <ResultsInput value={limit} onChange={setLimit} />
            <SubmitButton isLoading={isLoading} />
          </form>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div className="mt-12 text-left">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon className="text-indigo-600 w-6 h-6" />
              Search Results
            </h2>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {results.length} {results.length === 1 ? "match" : "matches"} found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {results.map((imageUrl, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-50 relative flex items-center justify-center">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`Match ${index + 1}`}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon className="w-12 h-12 mb-2 stroke-1" />
                      <span className="text-xs">No image preview available</span>
                    </div>
                  )}
                  {/* Subtle rank tag */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                    #{index + 1}
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 truncate max-w-[70%]">
                    {imageUrl ? imageUrl.split("/").pop() : "Unnamed Image"}
                  </span>
                  {imageUrl && (
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      Open
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {!isLoading && results.length === 0 && file && (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 max-w-md mx-auto text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3 stroke-1" />
          <p className="text-gray-700 font-semibold mb-1">No matching images found</p>
          <p className="text-sm text-gray-500">Try adjusting the results limit or uploading a different image.</p>
        </div>
      )}
    </div>
  );
};

export default ReverseImageSearch;