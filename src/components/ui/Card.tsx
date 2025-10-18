import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  hover = false,
}) => {
  return (
    <div
      className={`
        bg-neutral-800 rounded-xl shadow-md 
        ${hover ? "hover:shadow-xl hover:-translate-y-1" : ""} 
        transition-all duration-300 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;
