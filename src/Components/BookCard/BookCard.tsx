import { Card } from "react-bootstrap";

import booksImage from "../../assets/books.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ id, bookName }: { id: number; bookName: string }) => {


    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/view-pdf/${id}`); // Redirects to the PDF viewer page
    };
    
    return (
        <Card className="book-card" onClick={handleClick}>
        <Card.Img variant="top" src= {booksImage} />
          <Card.Body>
            <Card.Text>{bookName}</Card.Text>
          </Card.Body>
        </Card>
    );
}

export default BookCard;