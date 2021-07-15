import React, { useState, useEffect } from 'react';
import { fabric } from 'fabric';
const App = () => {
  const [canvas, setCanvas] = useState('');
  useEffect(() => {
    setCanvas(initCanvas());
  }, []);
  const initCanvas = () => (
    new fabric.Canvas('canvas', {
      height: 500,
      width: 500,
      backgroundColor: '#ff2800'
    })
  )
  return(
    <div>
      <h1>Canvas avec React et Fabric.js</h1>
      <canvas id="canvas" />
    </div>
  );
}
export default App