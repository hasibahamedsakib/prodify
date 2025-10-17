import React from "react";
import Button from "./Button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-danger/10 dark:bg-danger-dark/20 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-imperial-red dark:text-danger-light"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
        Oops! Something went wrong
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 text-center mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
