import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-gradient-to-r from-celtic-blue to-delft-blue text-white hover:from-[#276FBF] hover:to-[#183059] focus:ring-celtic-blue shadow-lg shadow-celtic-blue/30 hover:shadow-xl",
      secondary:
        "bg-gradient-to-r from-pomp-and-power to-indigo text-white hover:from-[#785589] hover:to-[#5F0A87] focus:ring-pomp-and-power shadow-lg shadow-pomp-and-power/30 hover:shadow-xl",
      danger:
        "bg-gradient-to-r from-imperial-red to-chestnut text-white hover:from-[#F03A47] hover:to-[#A44A3F] focus:ring-imperial-red shadow-lg shadow-imperial-red/30 hover:shadow-xl",
      outline:
        "border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 hover:border-celtic-blue focus:ring-celtic-blue dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:border-accent",
      ghost:
        "text-neutral-700 hover:bg-neutral-100 hover:text-celtic-blue focus:ring-celtic-blue dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-accent",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} cursor-pointer`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
