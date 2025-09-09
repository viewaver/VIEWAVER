import React from 'react';

type Point3D = [number, number, number];
type Point2D = [number, number];
type Edge = [number, number];

// Vertices of a more complex shape (Icosahedron) for a "Super HD" look
const X = 0.525731112119133606;
const Z = 0.850650808352039932;
const vertices: Point3D[] = [
    [-X, 0.0, Z], [X, 0.0, Z], [-X, 0.0, -Z], [X, 0.0, -Z],
    [0.0, Z, X], [0.0, Z, -X], [0.0, -Z, X], [0.0, -Z, -X],
    [Z, X, 0.0], [-Z, X, 0.0], [Z, -X, 0.0], [-Z, -X, 0.0]
];

// Edges connecting the vertices of the Icosahedron
const edges: Edge[] = [
    [0,1], [0,4], [0,6], [0,9], [0,11], [1,4], [1,6], [1,8], [1,10], [2,3], [2,5], [2,7], [2,9], [2,11],
    [3,5], [3,7], [3,8], [3,10], [4,5], [4,8], [4,9], [5,8], [5,9], [6,7], [6,10], [6,11], [7,10], [7,11],
    [8,10], [9,11]
];


interface PolyhedronProps {
  rotationX: number;
  rotationY: number;
  size?: number;
  color?: string;
}

const Polyhedron: React.FC<PolyhedronProps> = ({ 
  rotationX, 
  rotationY, 
  size = 300,
  color = '#000000'
}) => {
  
  const projectedPoints = vertices.map(point => {
    let [x, y, z] = point;

    // Rotate around Y axis (based on mouseX)
    const sinY = Math.sin(rotationY);
    const cosY = Math.cos(rotationY);
    let tempX = cosY * x + sinY * z;
    let tempZ = -sinY * x + cosY * z;
    x = tempX;
    z = tempZ;

    // Rotate around X axis (based on mouseY)
    const sinX = Math.sin(rotationX);
    const cosX = Math.cos(rotationX);
    let tempY = cosX * y - sinX * z;
    tempZ = sinX * y + cosX * z;
    y = tempY;
    
    // Add a simple perspective effect
    const perspective = 3;
    const scale = perspective / (perspective - z);
    
    return [x * scale, y * scale] as Point2D;
  });

  const halfSize = size / 2;
  const scaleFactor = size / 3;
  const shadowOffsetY = halfSize * 1.8; // How far down to push the shadow
  const shadowScaleY = 0.3; // How much to squash the shadow vertically

  return (
    <svg 
      width={size} 
      height={size * 1.5} // Make SVG taller to accommodate the shadow
      viewBox={`-${halfSize} -${halfSize} ${size} ${size * 1.5}`}
    >
      <defs>
        {/* A simple blur filter for the shadow */}
        <filter id="floor-shadow-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
        </filter>
      </defs>

      {/* Shadow Group: A squashed, blurred, and transparent version of the shape */}
      <g
        transform={`translate(0, ${shadowOffsetY}) scale(1, ${shadowScaleY})`}
        filter="url(#floor-shadow-blur)"
        opacity="0.3"
      >
        {edges.map(([startIdx, endIdx], i) => {
          const p1 = projectedPoints[startIdx];
          const p2 = projectedPoints[endIdx];
          return (
            <line
              key={`shadow-${i}`}
              x1={p1[0] * scaleFactor}
              y1={p1[1] * scaleFactor}
              x2={p2[0] * scaleFactor}
              y2={p2[1] * scaleFactor}
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Main Shape Group */}
      <g>
        {edges.map(([startIdx, endIdx], i) => {
          const p1 = projectedPoints[startIdx];
          const p2 = projectedPoints[endIdx];
          
          return (
            <line
              key={i}
              x1={p1[0] * scaleFactor}
              y1={p1[1] * scaleFactor}
              x2={p2[0] * scaleFactor}
              y2={p2[1] * scaleFactor}
              stroke={color}
              strokeWidth="0.75"
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
};

export default Polyhedron;