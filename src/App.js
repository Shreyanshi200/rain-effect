// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

const ROWS = 15;
const COLS = 20;

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const getColorGradient = (startColor, step, totalSteps) => {
  const startRGB = [
    parseInt(startColor.slice(1, 3), 16),
    parseInt(startColor.slice(3, 5), 16),
    parseInt(startColor.slice(5, 7), 16),
  ];
  const endColor = [0, 0, 0]; // Darken to black

  const r = startRGB[0] - ((startRGB[0] / totalSteps) * step);
  const g = startRGB[1] - ((startRGB[1] / totalSteps) * step);
  const b = startRGB[2] - ((startRGB[2] / totalSteps) * step);

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};


const App = () => {
  const [grid, setGrid] = useState([]);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const initialGrid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops((prevDrops) => {
        const newDrops = [...prevDrops];
        const col = Math.floor(Math.random() * COLS);
        const color = getRandomColor();
        for (let row = 0; row < ROWS; row++) {
          newDrops.push({ col, row, color });
        }
        return newDrops;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((row) => row.slice());
        setDrops((prevDrops) => {
          let newDrops = [];
  
          prevDrops.forEach((drop) => {
            // Check if drop is within the grid bounds
            if (drop.row < ROWS) {
              newGrid[drop.row][drop.col] = getColorGradient(drop.color, drop.row, ROWS - 1);
              drop.row += 1;
              newDrops.push(drop);
            }
            else{
              newDrops=[];
            }
            // Optionally, handle animation or cleanup here before removing the drop
          });
  
          return newDrops;
        });
  
        return newGrid;
      });
    }, 80);
  
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="grid">
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="cell"
            style={{ backgroundColor: cell || 'rgba(255, 255, 255, 0.1)' }}
          ></div>
        ))
      )}
    </div>
  );
};

export default App;
