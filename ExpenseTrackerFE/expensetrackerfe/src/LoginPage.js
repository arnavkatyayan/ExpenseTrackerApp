import React, { useEffect, useState } from "react";
import './App.css';
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import hide from './hide.png';
import view from './view.png';
import SignUpPage from "./SignUpPage";
import HandlingMonth from "./HandlingMonth";
import swal from "sweetalert";
import ExpenseTrackerPage from "./ExpenseTrackerPage";
import ForgetPasswordPage from "./ForgetPasswordPage";
function LoginPage(props) {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [forgetPassClicked, setForgetPassClicked] = useState(false);
    const [isNewUserClicked, setIsNewUserClicked] = useState(false);
    const [isIconClicked, setIsIconClicked] = useState(false);
    const [errUsername, setErrUsername] = useState(false);
    const [errPassword, setErrPassword] = useState(false);
    const [isCurrMonthDataAdded,setIsCurrMonthDataAdded] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleForgetPassword = () => {
        setForgetPassClicked(true);
    }

    useEffect(()=> {
        checkCurrentMonthAdded();
    },[])

    const checkCurrentMonthAdded = async ()=> {
        const month = getCurrentMonth();
        const response = await axios.get(`http://localhost:9090/api-login/isMonthAdded/${month}`);
        if(response.data) {
            console.log(response.data);
            setIsCurrMonthDataAdded(true);
        } 
        
    }

    const getCurrentMonth = ()=> {
        const date = new Date();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currMonth = months[date.getMonth()];
        return currMonth;
    }

    const handleReset = () => {
        setUserName("");
        setPassword("");
        setErrUsername(false);
        setErrPassword(false);
        setIsIconClicked(false);
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
        
        if (userName.trim().length === 0) {
            setErrUsername(true);
        }
        if (password.trim().length === 0) {
            setErrPassword(true);
        }
        const loginData = {
            username: userName,
            password: password
        };

        axios.post("http://localhost:9090/api-login/login", loginData)
            .then(response => {
                // Handle success, e.g., navigate to another page or show success message
                swal("Success!","Login Successful","success");
                setIsLoggedIn(true);
                props.setIsLogoutClicked(true);
                console.log("Login successful:", response.data);
            })
            .catch(error => {
                // Handle error, e.g., show error message
                swal("Error","Username or password incorrect!","error");
                console.error("Error logging in:", error);
            });
    };

    if(isLoggedIn && props.isLogoutClicked === true) {
        
        return isCurrMonthDataAdded ? <ExpenseTrackerPage userName={userName} logout={props.isLogoutClicked} setLogout={props.setIsLogoutClicked}/>:<HandlingMonth logout={props.isLogoutClicked} setLogout={props.setIsLogoutClicked}/>
    }
    if(isNewUserClicked) {
        return <SignUpPage/>
    }
    if(forgetPassClicked) {
        return <ForgetPasswordPage setForgetPassClicked={setForgetPassClicked}/>
    }
    
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
                        {errUsername ? <p className="validation-warning">Please enter the username</p> : null}
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
                                <img src={hide} alt="hide" className="password-icon" onClick={handleIconClicking} /> 
                                : 
                                <img src={view} alt="view" className="password-icon" onClick={handleIconClicking} />
                            }
                        </div>
                        {errPassword ? <p className="validation-warning">Please enter the password</p> : null}
                    </Form.Group>

                    <div className="btn-grps">
                        <Button variant="success" type="submit">
                            Submit
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                        <Button variant="danger" type="button" onClick={handleForgetPassword}>
                            Forget Password
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
