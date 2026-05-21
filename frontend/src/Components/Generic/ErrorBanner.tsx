import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative flex items-start gap-3 max-w-md w-full mx-4"
        role="alert"
      >
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
        <span className="block sm:inline grow">{message}</span>
        <button onClick={onClose} className="text-red-700 hover:text-red-900 ml-2">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default ErrorBanner;