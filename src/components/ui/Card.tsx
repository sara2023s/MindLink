import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  bordered?: boolean;
  padded?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  padded = true,
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg 
        ${bordered ? 'border border-gray-200' : ''}
        ${padded ? 'p-6' : ''}
        ${hoverable ? 'transition-shadow duration-200 hover:shadow-md' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardTitle: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <h3 className={`text-lg font-medium text-gray-900 mb-2 ${className}`}>
      {children}
    </h3>
  );
};

export const CardContent: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
};