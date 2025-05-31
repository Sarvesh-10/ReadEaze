import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import LoadingOverlay from "../Components/LoadingOverlay/LoadingOverlay";
import { Button, Card, Col, Navbar, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "./Shelf.css";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import BookCard from "../Components/BookCard/BookCard";

const Shelf = () => {
  const loading = useSelector((state: RootState) => state.user.loading);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [books, setBooks] = useState<
    { id: number; title: string; image: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    const fetchBooksurl  = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.GET_BOOKS}`;
    try {
      const response = await axios.get(fetchBooksurl, {
        withCredentials: true,
      });
      const booksData = response.data.map(
        (book: { id: number; name: string; coverUrl?: string }) => ({
          id: book.id,
          title: book.name,
          image: book.coverUrl || "/assets/dummy-book.jpg", // Use default if no cover
        })
      );
      setBooks(booksData);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to fetch books. Please try again later.");
      navigate("/login");
      toast("Login Again");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.UPLOAD_BOOK}`;
      await axios.post(uploadUrl, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchBooks(); // Refresh books after upload
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <>
      <LoadingOverlay loading={loading} />
      <div className="shelf-container">
        <Navbar bg="dark" variant="dark" className="navbar-custom">
          <Navbar.Brand>ReadEaze</Navbar.Brand>
        </Navbar>

        <div className="shelf-content">
          <Row className="g-4">
            {/* Add Book Tile */}
            <Col xs={6} sm={4} md={3} lg={2}>
              <Card className="text-center add-book-card">
                <Card.Body>
                  <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="outline-primary"
                    className="rounded-circle p-3"
                    onClick={handleButtonClick}
                  >
                    <FaPlus size={40} />
                  </Button>
                  <Card.Title className="mt-2">Add Book</Card.Title>
                </Card.Body>
              </Card>
            </Col>

            {/* Display Books */}
            {error ? (
              <p className="text-danger">{error}</p>
            ) : books.length === 0 ? (
              <p>No books available</p>
            ) : (
              books.map((book) => (
                <Col key={book.id} xs={6} sm={4} md={3} lg={2}>
                  <BookCard id={book.id} bookName={book.title} />
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </>
  );
};

export default Shelf;
