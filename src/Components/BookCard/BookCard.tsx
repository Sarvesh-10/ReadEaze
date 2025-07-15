import { Card } from "react-bootstrap";

import booksImage from "../../assets/books.jpg";
import { useNavigate } from "react-router-dom";
import "./BookCard.css"; // Import the CSS file for styling

const BookCard = ({ id, bookName }: { id: number; bookName: string }) => {


    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/view-pdf/${id}`); // Redirects to the PDF viewer page
    };
    
    return (
        <Card className="book-card with-tooltip" onClick={handleClick} border="dark">
          <div className="card-tooltip">{bookName}</div>
        <Card.Img variant="top" src= {booksImage} />
          <Card.Body>
            <Card.Text className="book-name">{bookName}</Card.Text>
          </Card.Body>
        </Card>
    );
}

export default BookCard;