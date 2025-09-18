import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import { FileEarmarkArrowUp } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { fetchBooks, uploadBook } from '../../store/actions';
import { toast } from 'react-toastify';

interface UploadModalProps {
  show: boolean;
  onHide: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ show, onHide }) => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'study' | 'casual' | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    } else {
      setFile(null);
      setFileName(null);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFile(null);
  };

  const handleModeChange = (selectedMode: 'study' | 'casual') => {
    setMode(selectedMode);
  };

  const handleUpload = () => {
    if (file && mode) {
      // Dispatch the uploadBook action with the selected file and moded
      dispatch(uploadBook({ file, mode })).then((result) => {
        if (uploadBook.fulfilled.match(result)) {
          // If upload was successful, refresh the book list
          dispatch(fetchBooks());
          toast.success("Book uploaded successfully");
        } else {
          // Handle error case
          toast.error("Failed to upload book: " + result.error.message);
        }
      });
            
      console.log('Uploading:', file.name, 'Mode:', mode);
      onHide();
    }
  };

  const isDisabled = !file || !mode;

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>📚 Upload Book</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto', scrollbarWidth:'none' }}>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select a PDF file</Form.Label>
          <Form.Control type="file" accept="application/pdf" onChange={handleFileChange} />
          {file && (
            <div
              className="d-flex justify-content-between align-items-center mt-2 px-3 py-2 bg-light rounded"
              style={{
                maxHeight: '44px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              <span
                className="text-truncate"
                style={{ maxWidth: '85%', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {fileName}
              </span>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={handleRemoveFile}
                style={{ padding: '0 8px' }}
                title="Remove file"
              >
                ❌
              </Button>
            </div>
          )}
        </Form.Group>

        <div className="mt-4">
          <h6>🧠 Choose How You Want to Read</h6>

          <Row className="mt-3">
            <Col md={6}>
              <Card
                onClick={() => handleModeChange('study')}
                className={`p-3 mb-3 ${mode === 'study' ? 'border-primary shadow' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <Card.Title>📖 Study Mode</Card.Title>
                <Card.Text style={{ fontSize: '0.9rem' }}>
                  Perfect for learning and deep understanding. The AI will remember what’s in your book —
                  so you can ask questions, get summaries, and explore topics like a smart study partner.
                </Card.Text>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Ideal for: textbooks, research papers, technical guides.
                </div>
              </Card>
            </Col>

            <Col md={6}>
              <Card
                onClick={() => handleModeChange('casual')}
                className={`p-3 mb-3 ${mode === 'casual' ? 'border-success shadow' : 'border-light'}`}
                style={{ cursor: 'pointer' }}
              >
                <Card.Title>🌴 Casual Mode</Card.Title>
                <Card.Text style={{ fontSize: '0.9rem' }}>
                  Just here to chill? Choose casual mode. You can read and chat freely, but the AI won’t
                  dig into the book — great for novels, stories, or relaxed browsing.
                </Card.Text>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Ideal for: novels, stories, leisure reading.
                </div>
              </Card>
            </Col>
          </Row>

          <div className="text-center mt-3 text-muted" style={{ fontSize: '0.85rem' }}>
            Think of it like reading with a tutor vs. reading for fun.
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
    <Button
  variant="primary"
  onClick={!isDisabled ? handleUpload : undefined}
  style={{
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    pointerEvents: isDisabled ? 'auto' : 'auto',
    opacity: isDisabled ? 0.6 : 1,
  }}
  aria-disabled={isDisabled} // for accessibility
  title={isDisabled ? 'Select a file and mode to enable upload' : ''}
>

          <FileEarmarkArrowUp className="me-2" />
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadModal;
