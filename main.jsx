import React from 'react';
import { createRoot } from 'react-dom/client';
import { HoverCardDemo } from './components/HoverCardDemo';

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
  const hoverCardContainer = document.getElementById('hover-card-demo');
  
  if (hoverCardContainer) {
    const root = createRoot(hoverCardContainer);
    root.render(<HoverCardDemo />);
  }
}); 