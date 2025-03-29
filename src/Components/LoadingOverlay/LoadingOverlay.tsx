import React from "react";
import { Spinner } from "react-bootstrap";
import "./LoadingOverlay.css";

const LoadingOverlay: React.FC<{ loading: boolean }> = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-overlay">
      <Spinner animation="border" role="status" />
    </div>
  );
};

export default LoadingOverlay;
