import { TextBox, Position } from "./types";

interface DraggableTextProps {
  box: TextBox;
  onMove: (id: string, position: Position) => void;
}

export const DraggableText: React.FC<DraggableTextProps>  = ({
  box,
  onMove,
}: {
  box: TextBox;
  onMove: (id: string, position: Position) => void;
}) => {
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default behavior to stop pull-to-refresh
    e.preventDefault();

    const isTouch = "touches" in e;
    const startX = isTouch
      ? e.touches[0].clientX
      : (e as React.MouseEvent).clientX;
    const startY = isTouch
      ? e.touches[0].clientY
      : (e as React.MouseEvent).clientY;

    const element = isTouch
      ? (e.target as HTMLElement).getBoundingClientRect()
      : (e.currentTarget as HTMLElement).getBoundingClientRect();

    const offsetX = startX - element.left;
    const offsetY = startY - element.top;

    const handleDragMove = (event: MouseEvent | TouchEvent) => {
      // Prevent default to stop unwanted behaviors
      event.preventDefault();

      const moveX =
        "touches" in event
          ? event.touches[0].clientX
          : (event as MouseEvent).clientX;
      const moveY =
        "touches" in event
          ? event.touches[0].clientY
          : (event as MouseEvent).clientY;

      // Get the container boundaries
      const container = document.querySelector(".image-container");
      if (!container) return;

      const containerRect = container.getBoundingClientRect();

      // Calculate new position relative to container
      let newX = moveX - containerRect.left - offsetX;
      let newY = moveY - containerRect.top - offsetY;

      // Constrain movement within container bounds
      newX = Math.max(0, Math.min(newX, containerRect.width - element.width));
      newY = Math.max(0, Math.min(newY, containerRect.height - element.height));

      onMove(box.id, {
        x: newX,
        y: newY,
      });
    };

    const handleDragEnd = () => {
      window.removeEventListener("mousemove", handleDragMove);
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchmove", handleDragMove);
      window.removeEventListener("touchend", handleDragEnd);
    };

    window.addEventListener("mousemove", handleDragMove, { passive: false });
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchmove", handleDragMove, { passive: false });
    window.addEventListener("touchend", handleDragEnd);
  };

  return (
    <div
      className="absolute touch-none cursor-move p-3 bg-black/50 rounded-lg backdrop-blur-sm"
      style={{
        left: `${box.position.x}px`,
        top: `${box.position.y}px`,
        fontSize: `${box.fontSize}px`,
        color: box.color,
        textShadow: "2px 2px 2px rgba(0,0,0,0.8)",
        WebkitUserSelect: "none",
        userSelect: "none",
        transform: "translate3d(0,0,0)", // Forces GPU acceleration
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      <div className="text-white">{box.text}</div>
    </div>
  );
};
