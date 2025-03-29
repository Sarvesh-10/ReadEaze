import React, { useState } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import "./Signup.css"; // Custom styles
import { AppDispatch } from "../store/store";
import { signupUser } from "../store/actions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingOverlay from "../Components/LoadingOverlay/LoadingOverlay";
import { toast } from "react-toastify";

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("form data is ", formData);
    try {
      await dispatch(signupUser(formData))
        .unwrap()
        .catch((err) => {
          setErr(err.message);
          return;
        });
        toast.success("Signup Successful");

      navigate("/login");
    } catch (err) {
      toast.error("Signup Failed");
      console.log("Failed to Signup");
    }
  };

  return (
    <>
      <LoadingOverlay loading={false}></LoadingOverlay>
      <div className="signup-page">
        <Container className="d-flex justify-content-center align-items-center vh-100 vw-100">
          <Card className="p-4 shadow-lg" style={{ width: "25rem" }}>
            <Card.Body>
              <h2 className="text-center mb-4">Sign Up</h2>
              <Form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    name="name"
                    required
                    value={formData.name}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    onChange={handleChange}
                    name="email"
                    required
                    value={formData.email}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    name="password"
                    required
                    value={formData.password}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default Signup;
