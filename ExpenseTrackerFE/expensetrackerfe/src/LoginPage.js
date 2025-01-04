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
    const [minutes, setMinutes] = useState(30);
    const [minutesChanged, setMinutesChanged] = useState(-1);
    const [blockEndTime, setBlockEndTime] = useState("");
    const [isBlockEndTimeEnabled, setIsBlockTimeEnabled] = useState(false);

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

    useEffect(() => {
        if (isBlockEndTimeEnabled) {
            const timer = setInterval(() => {
                setMinutes((prevMinutes) => {
                    if (prevMinutes > 0) {
                        return prevMinutes - 1;
                    }
                    else {
                        clearInterval(timer);
                        setIsBlockTimeEnabled(false);
                        return;
                    }
                });
            }, 60000);
            return () => clearInterval(timer);
        }

    }, [isBlockEndTimeEnabled])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userName.trim().length === 0) {
            setErrUsername(true);
            return;
        }
        if (password.trim().length === 0) {
            setErrPassword(true);
            return;
        }

        const loginData = {
            username: userName,
            password: password
        };

        try {
            const response = await axios.post("http://localhost:9090/api-login/login", loginData);
            if (response.data === "Login successful" && isBlockEndTimeEnabled) {
                swal("Error", `Your account is blocked for ${minutes} minutes`, "error");
            }
            swal("Success!", "Login Successful", "success");
            setIsLoggedIn(true);
            props.setIsLogoutClicked(true);
            console.log("Login successful:", response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const attemptsLeft = await getLoginAttempts(); // Await the Promise
                if (attemptsLeft.loginAttempts > 0) {
                    if (minutes == 0 || minutes == undefined) {
                        setMinutes(30);
                    }
                    swal("Error", `Credentials are incorrect. ${attemptsLeft.loginAttempts} login attempt left.`, "error");
                }
                else if (attemptsLeft.loginAttempts === 0) {
                    swal("Error", `Your account is blocked for ${minutes} minutes`, "error");
                    setIsBlockTimeEnabled(true);
                }
            } else if (!error.response) {
                swal("Error", "Network Error! Please try again later.", "error");
            } else {
                swal("Error", "Something went wrong!", "error");
            }
            console.error("Error logging in:", error);
        }
    };

    const getLoginAttempts = async () => {
        try {
            const resp = await axios.get(`http://localhost:9090/api-login/getLoginAttempts/${userName}`);
            return resp.data;
        } catch (error) {
            console.error("Error fetching login attempts:", error);
            return 0;
        }
    };


    if(isLoggedIn && props.isLogoutClicked === true) {
        
        return isCurrMonthDataAdded ? <ExpenseTrackerPage userName={userName} logout={props.isLogoutClicked} setLogout={props.setIsLogoutClicked}/>:<HandlingMonth logout={props.isLogoutClicked} setLogout={props.setIsLogoutClicked} setIsCurrMonthDataAdded={setIsCurrMonthDataAdded}/>
    }
    if(isNewUserClicked) {
        return <SignUpPage setIsNewUserClicked={setIsNewUserClicked}/>
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
