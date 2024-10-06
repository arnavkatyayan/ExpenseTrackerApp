import React from "react";
import { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
function ForgetPasswordPage(props) {

    const [email, setEmail] = useState("");
    const [errEmail, setErrEmail] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);
    const handleEmail = (evt) => {
        setEmail(evt.target.value);
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

    const isEmailPresent = async (mail) => {
        try {
            const response = await axios.post(`http://localhost:9090/api-forget-password/isMailPresent/${mail}`);
            if (response.status === 200) {
                console.log("Mail present");
                return true;
            }
            else {
                console.log("Mail not present");
                return false;
            }
        }
        catch {
            console.log("Error finding mail");
        }
    }

    const handleReset = () => {
        setEmail("");
        setErrEmail(false);
        setInvalidEmail(false);
        
    }

    const sendEmail = async () => {
        if(email.trim().length === 0) {
            setErrEmail(true);
            return;
        }
        if(email && !isEmailValid(email.trim())) {
            setInvalidEmail(true);
            return;
        }
        const isPresent = await isEmailPresent(email.trim());
        if (!isPresent) {
            swal("Error!", "Email not found.", "warning");
        }
        else {
            axios.post(`http://localhost:9090/api-forget-password/forgetPassword/${email.trim()}`).then(
                response => {
                    swal("Success!", "Mail Sent!.", "success");
                    props.setForgetPassClicked(false);
                }
            ).catch(error => {
                swal("Error!", "Error sending mail.", "warning");

                console.log("error in sending mail");
            })
        }

    }

    return (
        <div className="expense-tracker">
            <div className="login-page">
                <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                    <Form.Label className="labels">Email</Form.Label>
                    <Form.Control
                        className="input-field"
                        type="text"
                        placeholder="Enter Email"
                        onChange={handleEmail}
                        value={email}
                    />
                {errEmail ? <p className="validation-warning">Please enter the E-mail</p>:null}
                {invalidEmail?<p className="validation-warning">Please enter valid E-mail</p>:null}
                </Form.Group>
                <div className="btn-grps forget-pass">
                        <Button variant="success" type="submit" onClick={sendEmail}>
                            Submit
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                       
                    </div>
                    
            </div>
        </div>
    )

}

export default ForgetPasswordPage;