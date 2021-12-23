import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { handleLogIn, UserContext } from "../reducers/user";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmailChanged = (e) => setEmail(e.target.value);
    const handlePasswordChanged = (e) => setPassword(e.target.value);

    const handleLoginClicked = async (e) => {
        e.preventDefault();
        try {
            await handleLogIn(email, password)(dispatch);
            navigate('/')
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div>
            <Container className="py-5 mt-5 w-50 border border-dark rounded">
                <h1 className="display-5 w-75 mx-auto mb-4">Login</h1>
                <Form className="w-75 mx-auto">
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            value={email || ""}
                            onChange={handleEmailChanged}
                            type="email"
                            placeholder="Enter email"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={password || ""}
                            onChange={handlePasswordChanged}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={handleLoginClicked}>
                        Login
                    </Button>
                    <br />

                    <Link to="/signup">Create Account</Link>
                </Form>
            </Container>
        </div>
    );
};

export default Login;
