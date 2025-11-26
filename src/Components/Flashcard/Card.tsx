import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  const hoverClasses = hoverEffect 
    ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-xl" 
    : "";

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};