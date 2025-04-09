import React from 'react';

interface NavigationProps {
  items: {
    label: string;
    href: string;
  }[];
  className?: string;
  itemClassName?: string;
}

const Navigation: React.FC<NavigationProps> = ({ 
  items, 
  className = 'flex space-x-6',
  itemClassName = 'text-sm text-neutral-text hover:text-primary-blue'
}) => {
  return (
    <nav className={className}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href}
          className={itemClassName}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
};

export default Navigation; 