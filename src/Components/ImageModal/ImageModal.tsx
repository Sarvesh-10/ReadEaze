import React from "react";
import ReactDOM from "react-dom";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  caption: string;
  isLoading: boolean;
  onDownload: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  caption,
  isLoading,
  onDownload,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="position-fixed bottom-0 start-0 m-3"
      style={{
        zIndex: 1050,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Generating...</span>
          </div>
          <p className="mt-2">Generating image...</p>
        </div>
      ) : (
        <>
          <img
            src={imageUrl}
            alt="Generated"
            className="img-fluid rounded mb-2"
            style={{ width: "200px", height: "200px" }}
          />
          <p className="text-muted small">{caption}</p>
          <div className="d-flex justify-content-between mt-2">
            <button
              onClick={onClose}
              className="btn btn-outline-secondary btn-sm"
            >
              Close
            </button>
            <button
              onClick={onDownload}
              className="btn btn-primary btn-sm"
              disabled={isLoading}
            >
              Download
            </button>
          </div>
        </>
      )}
    </div>,
    document.getElementById("portal-root") as HTMLElement
  );
};

export default ImageModal;
