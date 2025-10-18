import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-neutral-300 mb-1.5">
            {label}
            {props.required && (
              <span className="text-imperial-red ml-1">*</span>
            )}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-celtic-blue focus:border-transparent
            disabled:bg-neutral-100 disabled:cursor-not-allowed
            ${
              error
                ? "border-imperial-red focus:ring-imperial-red"
                : "border-neutral-300 dark:border-neutral-600"
            }
            dark:bg-neutral-800 dark:text-white
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-imperial-red dark:text-danger-light flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
