import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-600 text-white shadow-md hover:shadow-lg focus:ring-cyan-500 border border-transparent",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg focus:ring-emerald-500 border border-transparent",
    outline: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm focus:ring-gray-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 border border-transparent shadow-none"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};