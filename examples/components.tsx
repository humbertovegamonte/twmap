import React from 'react';

interface CardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({ title, description, buttonText, onClick }) => {
  return (
    <div className="tw-f3dfc670bb1">
      <div className="tw-b3afa1b438d">
        <div className="tw-b3afa1">{title}</div>
        <p className="tw-d3e5a2">{description}</p>
      </div>
      <div className="tw-e547d8">
        <button 
          onClick={onClick}
          className="tw-f5f5c932792"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="tw-f5f5c9">
      {children}
    </div>
  );
};

export const Header: React.FC = () => {
  return (
    <header className="tw-a">
      <h1 className="tw-b2d01e">My App</h1>
      <p className="tw-d5b524">Built with React and Tailwind</p>
    </header>
  );
};
