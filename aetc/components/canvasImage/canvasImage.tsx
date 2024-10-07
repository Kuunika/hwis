import { useRef, useState, useEffect } from "react";


interface Point {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasProps {
  imageUrl: string;
}

export const CanvasImage: React.FC<CanvasProps> = ({ imageUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [clickPositions, setClickPositions] = useState<Point[]>([]);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [currentWidth, setCurrentWidth] = useState<number>(50);
  const [currentHeight, setCurrentHeight] = useState<number>(30);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (context) {
          context.drawImage(img, 0, 0);
          drawHighlights(clickPositions, currentPoint);
        }
      };
    }
  }, [imageUrl, clickPositions, currentPoint]);

  const drawHighlights = (positions: Point[], currentPoint: Point | null) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(img, 0, 0);

          positions.forEach((position) => {
            drawOval(context, position.x, position.y, position.width, position.height);
          });

          if (currentPoint && !clickPositions.includes(currentPoint)) {
            drawOval(context, currentPoint.x, currentPoint.y, currentWidth, currentHeight);
          }

          if (currentPoint && clickPositions.includes(currentPoint)) {
            drawOval(context, currentPoint.x, currentPoint.y, currentPoint.width, currentPoint.height, true);
          }
        }
      };
    }
  };

  const drawOval = (context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, highlight: boolean = false) => {
    context.beginPath();
    context.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    context.fillStyle = highlight ? "rgba(0, 0, 255, 0.1)" : "rgba(255, 0, 0, 0.4)";
    context.fill();
    context.strokeStyle = "black";
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const existingPoint = clickPositions.find(
        (point) => Math.hypot(point.x - x, point.y - y) <= Math.max(point.width, point.height) + 5
      );

      if (existingPoint) {
        setCurrentPoint(existingPoint);
        setCurrentWidth(existingPoint.width);
        setCurrentHeight(existingPoint.height);
      } else {
        setCurrentPoint({ x, y, width: currentWidth, height: currentHeight });
      }
    }
  };

  const confirmPoint = () => {
    if (currentPoint) {
      if (clickPositions.includes(currentPoint)) {
        setClickPositions((prevPositions) =>
          prevPositions.map((point) =>
            point === currentPoint ? { ...point, width: currentWidth, height: currentHeight } : point
          )
        );
      } else {
        setClickPositions((prevPositions) => [...prevPositions, { ...currentPoint, width: currentWidth, height: currentHeight }]);
      }
      setCurrentPoint(null);
    }
  };

  const deletePoint = () => {
    if (currentPoint) {
      setClickPositions((prevPositions) => prevPositions.filter((point) => point !== currentPoint));
      setCurrentPoint(null);
    }
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = Number(e.target.value);
    setCurrentWidth(newWidth);

    if (currentPoint) {
      setCurrentPoint((prevPoint) => ({
        ...prevPoint,
        width: newWidth,
      }));
    }
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = Number(e.target.value);
    setCurrentHeight(newHeight);

    if (currentPoint) {
      setCurrentPoint((prevPoint) => ({
        ...prevPoint,
        height: newHeight,
      }));
    }
  };

  // Calculate the position for the popover
  const popoverStyle = currentPoint
    ? {
        position: "absolute" as "absolute", // Type assertion for CSS position
        left: currentPoint.x + 10, // Offset for better visibility
        top: currentPoint.y - 10, // Offset for better visibility
        backgroundColor: "white",
        border: "1px solid black",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      }
    : { display: "none" };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ marginBottom: "10px" }}>
        <label>
          Adjust Oval Width: {currentWidth}
          <input type="range" min="1" max="100" value={currentWidth} onChange={handleWidthChange} style={{ marginLeft: "10px" }} />
        </label>
        <label style={{ marginLeft: "20px" }}>
          Adjust Oval Height: {currentHeight}
          <input type="range" min="1" max="100" value={currentHeight} onChange={handleHeightChange} style={{ marginLeft: "10px" }} />
        </label>
      </div>
      <canvas ref={canvasRef} onClick={handleClick} style={{ border: "1px solid black", cursor: "crosshair" }} />
      {currentPoint && (
        <div style={popoverStyle}>
          <p>
            Current position: x: {currentPoint.x}, y: {currentPoint.y}, width: {currentWidth}, height: {currentHeight}
          </p>
          <button onClick={confirmPoint} style={{ marginTop: "10px" }}>
            Confirm Point
          </button>
          <button onClick={deletePoint} style={{ marginLeft: "10px" }}>
            Delete Point
          </button>
        </div>
      )}
      <div>
        {clickPositions.map((position, index) => (
          <div key={index}>
            Clicked position: x: {position.x}, y: {position.y}, width: {position.width}, height: {position.height}
          </div>
        ))}
      </div>
    </div>
  );
};


 