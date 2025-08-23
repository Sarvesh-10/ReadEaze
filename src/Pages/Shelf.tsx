import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import LoadingOverlay from "../Components/LoadingOverlay/LoadingOverlay";
import { Button, Card, Col, Navbar, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import "./Shelf.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBooks } from "../store/actions"; // Adjust the import path as necessary
import BookCard from "../Components/BookCard/BookCard";
import UploadModal from "../Components/UploadBookComponent/UploadBookModal";

const Shelf = () => {
  const loading = useSelector((state: RootState) => state.loading.loading);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((state: RootState) => state.books.books);
  
  const [uploadModal,showUploadModal] = useState(false);

  const [error, setError] = useState<string | null>(null);

 
  

useEffect(() => {
  const loadBooks = async () => {
    const result = await dispatch(fetchBooks());

    // Check if the action was rejected
    if (fetchBooks.rejected.match(result)) {
      // Optional: log error or show toast
      setError("Failed to fetch books. Please try again.");
      console.error("Unauthorized or failed to fetch books:", result.payload);
      navigate("/login"); // redirect to login
    }
  };

  loadBooks();
}, [dispatch, navigate]);


  const uploadBookButton = () => {
    showUploadModal(true);
  };




  return (
    <div style={{height: "100vh", overflowY: "auto"}}>
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
                  <Button
                    variant="outline-primary"
                    className="rounded-circle p-3"
                    onClick= {uploadBookButton}
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
                  <BookCard id={book.id} bookName={book.title} bookCoverUrl={book.image}/>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
      {uploadModal && (
        <UploadModal
        show={uploadModal}
        onHide={() => showUploadModal(false)}/>)}
    </div>
  );
};

export default Shelf;
