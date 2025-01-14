import React from "react";
import { useEffect, useState } from "react";
import './App.css';
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import hide from './hide.png';
import view from './view.png';
import swal from "sweetalert";
function ChangePasswordPage(props) {

    const [isIconClickedCurrent, setIsIconClickedCurrent] = useState(false);
    const [isIconClickedNew, setIsIconClickedNew] = useState(false);
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [userName, setUserName] = useState("");

    const handleUsername = (evt)=> {
        setUserName(evt.target.value);
    }
    const handleIconClickingNew = () => {
            setIsIconClickedNew(!isIconClickedNew);
    }

    const handleReset = () => {
        setCurrentPass("");
        setNewPass("");
        setIsIconClickedCurrent(false);
        setIsIconClickedNew(false);
    }

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

    const checkSecondValidation = (pass) => {
        const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?'; // Special symbols
        const low = pass.split('').filter((char) => char >= 'a' && char <= 'z');
        const high = pass.split('').filter((char) => char >= 'a' && char <= 'z');
        const digit = pass.split('').filter((char) => char >= 'a' && char <= 'z');
        const special = pass.split('').filter((char) => specialChars.split('').includes(char));
        if (low && high && digit && special) {
            return true;
        }
        else {
            return false;
        }
    }

    const checkPassValidations = (pass) => {

        if (pass.length < 8 || pass.length > 15) {
            return false;
        }
        else if (!checkSecondValidation(pass)) {
            return false;
        }
        return true;
    }

    const handleIconClickingCurrent = () => {
        setIsIconClickedCurrent(!isIconClickedCurrent);
    }

    const checkCredentials = async () => {
        const verificationData = {
            userName: userName.trim(),
            currentPassword: currentPass.trim()
        };
        try {
        const resp = await axios.post("http://localhost:9090/api-signup/signup/verifycreds", verificationData);

            return resp.data;
        } catch (error) {
            console.error('Error verifying credentials:', error);
            return null; // Handle errors appropriately
        }
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const check = await checkCredentials();
        if (check) {
            const passChangeData = {
                userName:userName.trim(),
                currentPassword:currentPass.trim(),
                newPassword:newPass.trim()

            };

            if(!checkPassValidations(newPass.trim())) {
                swal("Error","Password is not having all the validations.","error");
                return;
            }
            try{
                const response = await axios.post("http://localhost:9090/api-signup/signup/changePassword", passChangeData);
                if(response.status == 200) {
                    swal("Success","Password Changed","success");
                }
                return response.data;
            }
            catch(error) {
                console.log("Error changing password");
            }
        } else {
            swal("Error","Username or Password is incorrect","error");
        }
    };
    

    const handleCurrentPassword = (evt) => {
        setCurrentPass(evt.target.value);
    }

    const handleNewPassword = (evt) => {
        setNewPass(evt.target.value);
    }
    return (
        <div className="expense-tracker">
            <div className="login-page">
                <Form>
                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Username</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            placeholder="Enter Username"
                            value={userName}
                            onChange={handleUsername}
                           
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">Current Password</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type={!isIconClickedCurrent ? "password" : "text"}
                                placeholder="Enter Current Password"
                                value={currentPass}
                                onChange={handleCurrentPassword}
                            />
                            {!isIconClickedCurrent ? 
                                <img src={hide} alt="hide" className="password-icon" onClick={handleIconClickingCurrent} /> 
                                : 
                                <img src={view} alt="view" className="password-icon" onClick={handleIconClickingCurrent} />
                            }
                        </div>
                        {/* {errPassword ? <p className="validation-warning">Please enter the password</p> : null} */}
                    </Form.Group>

                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">New Password</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type={!isIconClickedNew ? "password" : "text"}
                                placeholder="Enter New Password"
                                value={newPass}
                                onChange={handleNewPassword}
                            />
                            {!isIconClickedNew ? 
                                <img src={hide} alt="hide" className="password-icon" onClick={handleIconClickingNew} /> 
                                : 
                                <img src={view} alt="view" className="password-icon" onClick={handleIconClickingNew} />
                            }
                        </div>
                        {/* {errPassword ? <p className="validation-warning">Please enter the password</p> : null} */}
                    </Form.Group>

                    <div className="btn-grps">
                        <Button variant="success" type="submit" onClick={handleSubmit}>
                            Change
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant="danger" type="button" onClick={showPassValidations}>
                            Password Validations
                        </Button>
                    </div>

    
                </Form>
            </div>
        </div>
    );
}
export default ChangePasswordPage;
