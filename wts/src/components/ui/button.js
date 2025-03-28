// src/components/ui/button.js
import React from 'react';

export const Button = ({ children, onClick, className, variant }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant === 'outline' ? 'btn-outline' : 'btn-solid'} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
