import React, { useState, useEffect } from "react";
import ReactTableComponent from "./ReactTableComponent";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import Select from 'react-select';
import swal from "sweetalert";
function ShowTable(props) {
    const [totalExpense, setTotalExpense] = useState(0);
    const [currMonthSalary, setCurrMonthSalary] = useState(0);
    const [difference, setDifference] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [saveToPc, setSaveToPc] = useState(false);
    const [sendToMail, setSendToMail] = useState(false);
    const [isShowSalaryClicked, setIsShowSalaryClicked] = useState(false);
    const [currentState,setCurrentState] = useState("");
    const [savings,setSavings] = useState(0);//this variable is for past months savings.
    const monthOptions = [
        { value: 'January', label: 'January' },
        { value: 'February', label: 'February' },
        { value: 'March', label: 'March' },
        { value: 'April', label: 'April' },
        { value: 'May', label: 'May' },
        { value: 'June', label: 'June' },
        { value: 'July', label: 'July' },
        { value: 'August', label: 'August' },
        { value: 'September', label: 'September' },
        { value: 'October', label: 'October' },
        { value: 'November', label: 'November' },
        { value: 'December', label: 'December' }
    ];

    useEffect(() => {
        const defaultOption = monthOptions.find(option => option.value === props.currentMonth);
        setSelectedOption(defaultOption);
    }, [props.currentMonth]);

    const handleSelectChange = (option) => {
        setSelectedOption(option);
    };

    const handleSaveToPC = () => {
        setSaveToPc(!saveToPc);
    };

    const handleSendToMail = () => {
        setSendToMail(!sendToMail);
    };

    const handleBack = () => {
        props.setShowTable(false);
    };

    // Fetches total expense for the selected month
    const handleSalary = async () => {
        if (selectedOption) {
            const response = await axios.get(`http://localhost:9090/api-expenseTracker/getFinalSalary/${selectedOption.value}`);
            return response.data; // Return the fetched data
        }
        return 0;
    };

    // Fetches the current month's salary
    const getCurrentMonthSalary = async () => {
        if (selectedOption) {
            const response = await axios.get(`http://localhost:9090/api-handling-month/getCurrMonthSal/${selectedOption.value}`);
            return response.data; // Return the fetched data
        }
        return 0;
    };

    // Updates the state and calculates the difference
    const getDifference = async () => {
        getMonthDetail();

        // Update the salary information after currentState is updated
        setIsShowSalaryClicked(true);

        // Fetch both expense and salary data
        const fetchedExpense = await handleSalary();
        const fetchedSalary = await getCurrentMonthSalary();

        // Calculate difference directly
        const calculatedDifference = fetchedSalary - fetchedExpense;

        // Set the state for totalExpense, currMonthSalary, and difference
        setTotalExpense(fetchedExpense);
        setCurrMonthSalary(fetchedSalary);
        setDifference(calculatedDifference);
    };

    const handleReset = () => {
        setTotalExpense(0);
        setCurrMonthSalary(0);
        setDifference(0);
        setIsShowSalaryClicked(false);
        setSaveToPc(false);
        setSendToMail(false);
    };

    const handleSaveOptions = () => {
        if (saveToPc === false && sendToMail === false) {
            swal("Error", "Please select either of the checkboxes! ", "warning");
            return;
        }

        const tableData = {
            saveToPC: saveToPc,
            sendToMail: sendToMail
        }
        axios.post("http://localhost:9090/api-expenseTracker/handleExpenseTransfer", tableData).then(response => {
            if (saveToPc && !sendToMail) {
                swal("Success!", "Excel File got saved in PC!", "success");

            }
            else if (sendToMail && !saveToPc) {
                swal("Success!", "Mail sent!", "success");

            }
            else {
                swal("Success!", "Table Data Saved!", "success");
            }

        }).catch(error => {
            swal("Error", "Error Sending data", "warning");
        })
        setSaveToPc(false);
        setSendToMail(false);
    }

    const getMonthDetail = () => {
        let ans = "";
        let index = -1;
        const date = new Date();

        for (let i = 0; i < monthOptions.length; i++) {
            if (selectedOption.value === monthOptions[i].value) {
                index = i + 1;
                break;
            }
        }

        if (selectedOption.value === props.currentMonth) {
            ans = "Current";
        } else if (index < date.getMonth() + 1) { // +1 because getMonth() is zero-based
            ans = "Savings";
        } else {
            ans = "Future";
        }

        setCurrentState(ans);
    };

    return (
        <div className="expense-tracker">
            <div className="login-page show-table">
                {/* Table Component */}
                <div className="table-wrapper">
                    <ReactTableComponent
                        data={props.data}
                        columns={props.columns}
                        defaultPageSize={3}
                    />
                </div>

                {/* Checkbox Form */}
                <div className="form-selection">
                    <Form>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Save To PC"
                                className="input-field"
                                onChange={handleSaveToPC}
                                checked={saveToPc}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                            <Form.Check
                                type="checkbox"
                                label="Send To Email"
                                className="input-field"
                                onChange={handleSendToMail}
                                checked={sendToMail}
                            />
                        </Form.Group>
                    </Form>

                    {/* Month Dropdown */}
                    <Select
                        value={selectedOption}
                        onChange={handleSelectChange}
                        options={monthOptions}
                        className="input-field"
                        placeholder="Select the month"
                    />
                </div>

                {/* Buttons Section */}
                <div className="btn-grps show-table-btns">
                    <Button variant="success" type="submit" onClick={handleBack}>
                        Back
                    </Button>
                    <Button variant="primary" type="button" onClick={handleSaveOptions}>
                        Save Options
                    </Button>
                    <Button variant="primary" type="button" onClick={handleReset}>
                        Reset
                    </Button>
                    <Button variant="info" type="button" onClick={getDifference}>
                        Show My Salary
                    </Button>
                </div>

                {isShowSalaryClicked ? (
                    currentState === "Current" ? (
                        <h5>The current salary left for {props.currentMonth} month is: {difference}</h5>
                    ) : currentState === "Savings" ? (
                        <h5>The salary saved for {selectedOption.value} is {savings}.</h5>
                    ) : currentState === "Future" ? (
                        <h5>Information about future salary is not available.</h5>
                    ) : null
                ) : null}
            </div>
        </div>
    );
}

export default ShowTable;
