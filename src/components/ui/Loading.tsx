import React from "react";

const Loading: React.FC<{ size?: "sm" | "md" | "lg"; text?: string }> = ({
  size = "md",
  text,
}) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200 dark:border-neutral-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-celtic-blue animate-spin"></div>
      </div>
      {text && (
        <p className="mt-4 text-neutral-600 dark:text-neutral-400 text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loading;
