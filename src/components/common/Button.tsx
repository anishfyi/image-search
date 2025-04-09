import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-primary-blue text-white hover:bg-primary-hover hover:shadow-button',
    secondary: 'bg-neutral-hover text-neutral-text border border-neutral-hover hover:border-neutral-border hover:shadow-button-sm',
    icon: 'flex items-center justify-center rounded-full hover:bg-neutral-hover'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const iconSizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const buttonStyles = variant === 'icon' 
    ? `${baseStyles} ${variantStyles[variant]} ${iconSizeStyles[size]}`
    : `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`;

  return (
    <button
      className={`${buttonStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 