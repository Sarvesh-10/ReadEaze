import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMenu } from "../../store/slices/menuslice";
import { generateImage } from "../../store/actions";
import { AppDispatch } from "../../store/store";

interface ContextMenuProps {
  selectedText: string | null;
  sendMessage: ((text: string, id: string) => void) | undefined;
  bookId: string | undefined;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  selectedText,
  sendMessage,
  bookId,
  menuRef,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [menuOpen, x, y, isOpen]: [boolean, number | null, number | null, boolean] = useSelector(
    (state: any) => [
      state.menu.isOpen,
      state.menu.x,
      state.menu.y,
      state.image.isOpen,
    ]
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText ?? "");
    dispatch(closeMenu());
  };

  const handleHighlight = () => {
    dispatch(closeMenu());
  };

  const handleAIExplain = () => {
    if (sendMessage && selectedText && bookId) {
      sendMessage(selectedText, bookId);
    }
    dispatch(closeMenu());
  };

  const handleGenerateImage = () => {
    dispatch(generateImage(selectedText ?? "")).unwrap();
    dispatch(closeMenu());
  };

  if (!menuOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: `${y ?? 0}px`,
        left: `${x ?? 0}px`,
        background: "white",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.2)",
        padding: "5px",
        zIndex: 1000,
      }}
    >
    <div>
      <button style={buttonStyle} onClick={handleCopy}>📋 Copy</button>
    </div>
    <div>
      <button style={buttonStyle} onClick={handleHighlight}>🔆 Highlight</button>
    </div>
    <div>
      <button style={buttonStyle} onClick={handleAIExplain}>🤖 AI Explain</button>
    </div>
    <div>
      <button style={buttonStyle} hidden={isOpen} onClick={handleGenerateImage}>🎨 Generate Image</button>
    </div>
    </div>
  );
};

const buttonStyle = {
  padding: "8px 12px",
  cursor: "pointer",
  fontSize: "14px",
  background: "none",
  border: "none",
  outline: "none",
  textAlign: "left" as const,
  width: "100%",
  color:"black",
};

export default ContextMenu;
