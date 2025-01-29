import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { Tooltip } from "react-tooltip";  // Correct import for Tooltip
import 'react-tooltip/dist/react-tooltip.css';
import info from "./info.png";  // Info icon
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import swal from "sweetalert";

function RecurringExpensePage(props) {
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [expenseName, setExpenseName] = useState("");
    const [recurrenceExpenseList, setRecurrenceExpenseList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    }

    const getExpenseAmtFromServer = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api-recurrence/recurrenceAmount", {
                params: { userName: "arnavk" },
            });
            if (response.status === 200) {
                console.log(response.data);
               setRecurrenceExpenseList(response.data);
            }
        } catch (error) {
            console.error("Error fetching expense amount:", error);
        }
    };

    const handleExpenseAmount = (evt) => {
        setExpenseAmount(evt.target.value);
    };

    const getReccurenceExpenseDetails = () => {
        let str = "";

        for (let i = 0; i < recurrenceExpenseList.length; i++) {
            str += recurrenceExpenseList[i].expenseName + " - Rs -" + recurrenceExpenseList[i].expenseAmount;


            if (i !== recurrenceExpenseList.length - 1) {
                str += ", ";
            }
        }
        return str;
    };
    

    const handleExpenseName = (evt) => {
        setExpenseName(evt.target.value);
    };

    useEffect(() => {
        getExpenseAmtFromServer();
    }, []);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        const recurrenceData = {
            expenseName: expenseName.trim(),
            expenseAmount: Number(expenseAmount),
            userName: "arnavk",
            endDate:selectedDate
        };

        try {
            const response = await axios.post("http://localhost:9090/api-recurrence/submitRecurrenceData",recurrenceData);
            if(response.status == 200) {
                swal("Success","Recurrence Data Saved!","success");
            console.log(response.data);
            }
        }
        catch(error) {
            swal("Error","Failed to save recurrence data","error");
            console.log("Failed to save the recurrence data");
        }
    };

    const handleReset = () => {
        setExpenseAmount(0);
        setSelectedDate(null);
        setExpenseName("");
    };

    return (
        <div className="expense-tracker">
            <div className="login-page">
                <Form>
                    <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                        <Form.Label className="labels">Username</Form.Label>
                        <Form.Control
                            className="input-field"
                            type="text"
                            value={props.userName}
                            disabled={true}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">Recurrence Name</Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type="text"
                                placeholder="Enter Recurrence Name"
                                value={expenseName}
                                onChange={handleExpenseName}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                        <Form.Label className="labels">
                            Recurrence Amount{" "}
                            <img
                                src={info}
                                alt="info"
                                className="info-icon"
                                data-tooltip-id="tooltip1"

                            />
                            <Tooltip id="tooltip1">{getReccurenceExpenseDetails()}</Tooltip>
                        </Form.Label>
                        <div className="input-wrapper">
                            <Form.Control
                                className="input-field password-input"
                                type="text"
                                placeholder="Enter Recurrence Amount"
                                value={expenseAmount}
                                onChange={handleExpenseAmount}
                            />
                        </div>

                    </Form.Group>

                    <Form.Group className="mb-3 input-container">
                        <Form.Label className="labels">End Date</Form.Label>
                        <div className="input-wrapper">
                            <DatePicker
                                 selected={selectedDate}
                                 onChange={handleDateChange}
                                dateFormat="dd-MM-yyyy"
                                className="form-control"
                                placeholderText="Select end date"
                            />
                        </div>
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
    );
}

export default RecurringExpensePage;
