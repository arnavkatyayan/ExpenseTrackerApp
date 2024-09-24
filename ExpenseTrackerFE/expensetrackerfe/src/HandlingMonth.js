import React, { useState, useEffect } from "react";
import './App.css';
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import swal from 'sweetalert';

function HandlingMonth() {
    
    const [monthName, setMonthName] = useState("");
    const [amount, setAmount] = useState(0);
    const [errAmount, setErrAmount] = useState(false);
    const [startDate, setStartDate] = useState(0);
    const [endDate, setEndDate] = useState(0);

    const handleAmount = (evt) => {
        setAmount(evt.target.value);
    }

    const handleReset = () => {
        setAmount(0);
        setErrAmount(false);
    }

    const getMonthName = () => {
        const date = new Date();
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const currMonth = months[date.getMonth()];
        setMonthName(currMonth);
    }

    const getStartDate = () => {
        const now = new Date(); // Get the current date and time
        const timestampMs = now.getTime(); // Timestamp in milliseconds
        setStartDate(timestampMs);
    }


    const getEndDate = (year, month) => {
        const lastDay = new Date(year, month + 1, 0); // month is 0-indexed
        const timestampMs = lastDay.getTime();
        setEndDate(timestampMs);
    }

    const getParameters = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth();
        getEndDate(year, month);
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (amount === 0) {
            setErrAmount(true);
            return;
        }
        console.log(startDate);
        const handlingMonthData = {
            monthName: monthName,
            startDate: startDate,
            endDate: endDate,
            amount: amount
        }
        axios.post("http://localhost:9090/api-handling-month/handling-month", handlingMonthData).then(
            response => {
                swal("Success", "Amount Saved!", "success");
                console.log("Login successful:", response.data);
            }).catch(error=>{
                console.log("Error getting",error);
            });
        
    }

    useEffect(() => {
        getMonthName();
        getStartDate();
        getParameters();
    }, [])


    return (
        <div className="expense-tracker">
            <div className="login-page">
                <Form>
                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Current Month</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            disabled
                            value={monthName}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">Amount</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type="text"
                                placeholder="Enter Amount"
                                value={amount}
                                onChange={handleAmount}
                            />
                        </div>
                        {errAmount ? <p className="validation-warning">Amount can't be 0</p> : null}

                    </Form.Group>

                    <div className="btn-grps">
                        <Button variant="success" type="submit" onClick={handleSubmit}>
                            Submit
                        </Button>
                        <Button variant="primary" type="button" onClick={handleReset}>
                            Reset
                        </Button>

                    </div>


                </Form>
            </div>
        </div>
    )
}
export default HandlingMonth;