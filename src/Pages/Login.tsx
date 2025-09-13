import React from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { loginUser } from "../store/actions";
import LoadingOverlay from "../Components/LoadingOverlay/LoadingOverlay";
import { toast } from "react-toastify";
import { useAuth } from "../Contexts/AuthContext";


export interface LoginFormData {
    email: string;
    password: string;
}
const Login: React.FC = () => {
    const loading = useSelector((state: RootState) => state.loading.loading);
    const {setIsLoggedIn} = useAuth()!;

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [formData, setFormData] = React.useState<LoginFormData>({
        email: "",
        password: ""
    });
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await dispatch(loginUser(formData)).unwrap();
            toast.success("Login Successful");
            setIsLoggedIn(true);
            navigate("/bookshelf");

        }catch(err){
            console.log("Failed to Login")
            toast.error("Login Failed");
            
        }
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    }
  return (
    <>
    <LoadingOverlay loading={loading}></LoadingOverlay>
    <div className="login-container">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" required name="email" onChange={handleChange}/>
              </Form.Group>

              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter password" required name="password" onChange={handleChange}/>
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-4">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              <small>
                Don't have an account? <Link to="/signup">Sign up</Link>
              </small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
    </>
  );
};

export default Login;
