import React from 'react';

export const HelloWorld: React.FC = () => {
  return (
    <div style={{
      fontSize: '48px',
      color: '#ffffff',
      backgroundColor: '#000000',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      Hello World
    </div>
  );
};