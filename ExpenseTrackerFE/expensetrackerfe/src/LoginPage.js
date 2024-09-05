import React, { useState } from "react";
import './App.css';
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import hide from './hide.png'; 
import view from './view.png';
function LoginPage() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [forgetPassClicked, setForgetPassClicked] = useState(false);
    const [isNewUserClicked, setIsNewUserClicked] = useState(false);
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [errUsername, setErrUsername] = useState(false);
    const [errPassword, setErrPassword] = useState(false);

    const handleForgetPassword = () => {
        setForgetPassClicked(true);
    }

    const handleReset = () => {
        setUserName("");
        setPassword("");

    }

    const handleIconClicking = () => {
        setIsIconClicked(!isIconClicked);
    }

    const handleIsNewUserClicked = () => {
        setIsNewUserClicked(true);
    }

    const handleUsername = (evt) => {
        setUserName(evt.target.value);
    }

    const handlePassword = (evt) => {
        setPassword(evt.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page reload on form submission

        const loginData = {
            username: userName,
            password: password
        };

        axios.post("http://localhost:9090/api/login", loginData)
            .then(response => {
                // Handle success, e.g., navigate to another page or show success message
                console.log("Login successful:", response.data);
            })
            .catch(error => {
                // Handle error, e.g., show error message
                console.error("Error logging in:", error);
            });
    };

    return (
        <div className="expense-tracker">
            <div className="login-page">
                <Form onSubmit={handleSubmit}>
                    {/* Username field */}
                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Username</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            placeholder="Enter username"
                            onChange={handleUsername}
                            value={userName}
                        />
                    </Form.Group>

                    {/* Password field with icon inside */}
                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">Password</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type={!isIconClicked ? "password" : "text"}
                                placeholder="Enter Password"
                                onChange={handlePassword}
                                value={password}
                            />
                            {!isIconClicked ? 
                            <img src={hide} alt="hide" className="password-icon" onClick={handleIconClicking} /> : <img src={view} className="password-icon" onClick={handleIconClicking}/> }
                        </div>
                    </Form.Group>

                    <div className="btn-grps">
                        <Button variant="success" type="submit">
                            Submit
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant="danger" type="button" onClick={handleForgetPassword}>
                            Password Forget
                        </Button>
                    </div>

                    <div className="new-user">
                        <Form.Label>
                            New User?
                            <label className="click-btn" onClick={handleIsNewUserClicked}>
                                Click here!
                            </label>
                        </Form.Label>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;
