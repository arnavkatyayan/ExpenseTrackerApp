import React from "react";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from "react-bootstrap";
import hide from './hide.png';
import view from './view.png';
import hideConfirmPass from './hide.png';
import viewConfirmPass from './view.png';
import swal from 'sweetalert';
import axios from "axios";

function SignUpPage() {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [isIconClickedConfirmPassWord, setIsIconClickedConfirmPassword] = useState(false);
    const [errUsername, setErrUsername] = useState(false);
    const [errPassword, setErrPassword] = useState(false);
    const [errConfirmPassword, setErrConfirmPassword] = useState(false);
    const [errEmail, setErrEmail] = useState(false);
    const warningMessages = ["The username maximum length should be 10", "Invalid email format"];
    const [errUsernameLen, setErrUserNameLen] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const handleUsername = (evt) => {
        setUserName(evt.target.value);
    }

    const handlePassword = (evt) => {
        setPassword(evt.target.value);
    }

    const handleConfirmPassword = (evt) => {
        setConfirmPassword(evt.target.value);
    }

    const handleEmail = (evt) => {
        setEmail(evt.target.value);
    }

    const handleIconClicking = () => {
        setIsIconClicked(!isIconClicked);
    }

    const handleIconClickingConfirmPass = () => {
        setIsIconClickedConfirmPassword(!isIconClickedConfirmPassWord);
    }

    const isEmailValid = (mail) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailRegex.test(mail)) {
            return true;
        }
        else {
            return false;
        }
    }


    const checkValidations = () => {

        if (userName && userName.trim().length > 10) {

            setErrUserNameLen(true);
        }
        if (email && !isEmailValid(email.trim())) {
            setInvalidEmail(true);
        }

        if (userName.trim().length === 0) {
            setErrUsername(true);
        }
        if (password.trim().length === 0) {
            setErrPassword(true);
        }
        if (email.trim().length === 0) {
            setErrEmail(true);
        }
        if (confirmPassword.trim().length === 0) {
            setErrConfirmPassword(true);
        }
    }

    const handleReset = () => {
        setUserName("");
        setPassword("");
        setErrConfirmPassword("");
        setErrEmail("");
        setErrUsername("");
        setErrPassword(false);
        setIsIconClicked(false);
        setIsIconClickedConfirmPassword(false);
        setEmail("");
        setConfirmPassword("");
        setInvalidEmail(false);
        setErrUserNameLen(false);
    }

    const isUserNamePresent = async (name) => {
        try {
            const response = await axios.post(`http://localhost:9090/api-signup/signup/${name}`);
            return response.status !== 200;  // Return true if username is taken
        } catch (error) {
            console.error("Error checking user availability", error);
            return true;  // Assume username is taken if an error occurs
        }
    };
    
    // Example usage in handleSubmit:
    const handleSubmit = async () => {
        checkValidations();
        let isMismatch = checkBothPasswords();
        if (isMismatch) {
            passMismatch();
            return;
        }
    
        const signUpData = {
            username: userName,
            password: password,
            email: email
        };
        const isPresent = await isUserNamePresent(userName.trim());
        if (isPresent) {
            swal("Error!", "Username taken please change.", "warning");
        } else {
            axios.post("http://localhost:9090/api-signup/signup", signUpData)
                .then(response => {
                    swal("Success!", "Signup completed.", "success");
                })
                .catch(error => {
                    swal("Error!", "Signup Failed.", "warning");
                    console.error("Error signing up:", error);
                });
        }
    };
    const showPassValidations = () => {
        swal({
            title: "Password Validations",
            text: "1. The password must be at least 8 characters long.\n" +
                "2. The password should have 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special symbol.\n" +
                "3. The password's maximum length should be 15",
            icon: "info",
            button: {
                text: "OK",
                className: "sweetalert-button"
            },
        });
    }

    const passMismatch = () => {
        swal({
            title: "Password Mimatch",
            text: "Password and Confirm Password should be same",
            icon: "info",
            button: {
                text: "OK",
                className: "sweetalert-button"
            },
        });
    }

    const getGeneratedPassword = () => {
        const pass = generatePassword();
        swal({
            title: "Generated Password",
            text: pass,
            icon: "info",
            button: {
                text: "Copy",
                className: "sweetalert-button"
            },
        }).then(() => {
            // Copy the password to clipboard after the button is clicked
            copyPassword(pass);
        });
    }

    // Function to copy the password to the clipboard
    const copyPassword = (pass) => {
        navigator.clipboard.writeText(pass).then(() => {
            swal("Copied!", "Password has been copied to the clipboard.", "success");
        }).catch(err => {
            console.error('Failed to copy the password: ', err);
        });
    }


    const getFirstFourChars = (l, u, n, s) => {
        // Step 1: Select one random character from each input string (lower, upper, number, special)
        const selectedChars = [
            l[Math.floor(Math.random() * l.length)],  // Random lowercase letter
            u[Math.floor(Math.random() * u.length)],  // Random uppercase letter
            n[Math.floor(Math.random() * n.length)],  // Random number
            s[Math.floor(Math.random() * s.length)]   // Random special character
        ];

        // Step 2: Shuffle the array to randomize the order of the characters
        const shuffledChars = selectedChars.sort(() => 0.5 - Math.random());

        // Step 3: Join the array into a string and return it
        return shuffledChars.join('');
    };

    const checkBothPasswords = () => {
        let isSame = false;
        if (password && confirmPassword) {
            if (password.trim() != confirmPassword.trim()) {
                isSame = true;
            }
        }
        return isSame;
    }

    const generatePassword = () => {
        let passLength = getPasswordLength(8, 15);
        let pass = "";
        const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'; // Lowercase letters
        const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Uppercase letters
        const numberChars = '0123456789'; // Digits
        const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'; // Special symbols
        const allChars = lowerCaseChars + upperCaseChars + numberChars + specialChars;
        pass = pass + getFirstFourChars(lowerCaseChars, upperCaseChars, numberChars, specialChars);
        for (let i = 0; i < passLength - 4; i++) {
            pass = pass + allChars[Math.floor(Math.random() * allChars.length)];
        }
        return pass;

    }

    const getPasswordLength = (min, max) => {
        // Ensure min and max are integers
        min = Math.ceil(min);
        max = Math.floor(max);

        // Generate a random number between min (inclusive) and max (inclusive)
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }




    return (

        <div className="expense-tracker">
            <div className="login-page signup-page">
                <div className="sign-up-inputs">
                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Username</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            placeholder="Enter username"
                            onChange={handleUsername}
                            value={userName}
                        />
                        {errUsername ? <p className="validation-warning">Please enter the username</p> : null}
                        {errUsernameLen ? <p className="validation-warning">{warningMessages[0]}</p> : null}
                    </Form.Group>

                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Email</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            placeholder="Enter Email"
                            onChange={handleEmail}
                            value={email}
                        />
                        {errEmail ? <p className="validation-warning">Please enter the Email</p> : null}
                        {invalidEmail ? <p className="validation-warning">{warningMessages[1]}</p> : null}
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
                                <img src={hide} alt="hide" className="password-icon" onClick={handleIconClicking} /> : <img src={view} className="password-icon" onClick={handleIconClicking} />}
                        </div>
                        {errPassword ? <p className="validation-warning">Please enter the password</p> : null}
                    </Form.Group>
                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">Confirm Password</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type={!isIconClickedConfirmPassWord ? "password" : "text"}
                                placeholder="Enter Confirm Password"
                                onChange={handleConfirmPassword}
                                value={confirmPassword}
                            />
                            {!isIconClickedConfirmPassWord ?
                                <img src={hideConfirmPass} alt="hide" className="password-icon" onClick={handleIconClickingConfirmPass} /> : <img src={viewConfirmPass} className="password-icon" onClick={handleIconClickingConfirmPass} />}
                        </div>
                        {errConfirmPassword ? <p className="validation-warning">Please enter the confirm password</p> : null}
                    </Form.Group>
                    <div className="btn-grps">
                        <Button variant="success" type="submit" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant="danger" type="button" onClick={showPassValidations}>
                            Show Password Validations
                        </Button>
                        <Button variant="info" type="button" onClick={getGeneratedPassword}>
                            Generate Password
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    )

}
export default SignUpPage;