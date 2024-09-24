import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ShowTable from './showTable';
import swal from 'sweetalert';
import axios from 'axios';

function ExpenseTrackerPage() {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [errExpenseName, setErrExpenseName] = useState(false);
    const [errExpenseAmount, setErrExpenseAmount] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [monthName, setMonthName] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentDateInTS, setCurrentDateInTS] = useState(0);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleExpenseAmount = (evt) => {
        setExpenseAmount(evt.target.value);
    }

    const handleExpenseType = (evt) => {
        setExpenseName(evt.target.value);
    }

    const getCurrentDateInTS = () => {
        const date = new Date();
        return date.getTime();
    }

    const getMonthName = () => {
        const date = new Date();
        const currentMonth = months[date.getMonth()];
        setMonthName(currentMonth);
    }

    useEffect(() => {
        getMonthName();
        fetchExpenseList();
        getCurrentDate();
      //  handleTable();
    }, []);

    const columns = useMemo(
        () => [
            { Header: 'Expense Name', accessor: 'name' },
            { Header: 'Expense Amount', accessor: 'amount' },
            { Header: 'Date', accessor: 'date' },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <div className='btn-grps'>
                        <Button variant="warning" onClick={() => handleEdit(row.index)}>Edit</Button>
                        <Button variant="danger" onClick={() => handleDelete(row.index)}>Delete</Button>
                    </div>
                )
            }
        ],
        []
    );

    const handleEdit = (index) => {
        // Implement your edit functionality
    }

    const handleDelete = (index) => {
        // Implement your delete functionality
    }

    const getDateFromTS = (date) => {
        // console.log(typeof date);
        const conversion = new Date(date);
        return conversion.toLocaleDateString();
    }

    const fetchExpenseList = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api-expenseTracker/getExpenses");
            const expenseData = response.data.map(item => ({
                name: item.expenseName,
                amount: parseFloat(item.expenseAmount),  // Correct parsing here
                date:  getDateFromTS(item.expenseDate)
            }));
            console.log("Fetched Expense Data: ", expenseData);
            setExpenseList(expenseData);  // Update state once after looping
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const handleExpense = (event) => {
        event.preventDefault();
        console.log(expenseList);
        // Reset error states
        setErrExpenseName(false);
        setErrExpenseAmount(false);

        // Basic validation for name and amount
        let hasError = false;
        if (isNaN(expenseAmount) || Number(expenseAmount) <= 0) {
            setErrExpenseAmount(true);
            hasError = true;
        }
        if (expenseName.trim().length === 0) {
            setErrExpenseName(true);
            hasError = true;
        }

        // If validation passes, add the expense to the list
        if (!hasError) {
            const expenseTrackerData = {
                expenseName: expenseName,
                expenseAmount: Number(expenseAmount),
                monthName: monthName,
                expenseId: expenseList.length ? expenseList.length + 1 : 1,
                expenseDate: getCurrentDateInTS()
            };
            axios.post("http://localhost:9090/api-expenseTracker/saveExpense", expenseTrackerData)
                .then(response => {
                    swal("Success!", "Expense Data Saved!", "success");
                    // Optionally fetch updated expense list
                    fetchExpenseList();  // Fetch updated expenses after saving
                })
                .catch(error => {
                    swal("Error!", "Failed to save the expense.", "warning");
                });

            // Reset input fields
            setExpenseName("");
            setExpenseAmount("");
        }
    }

    const handleTable = async () => {
        // if (expenseList.length > 0) {
        //     setShowTable(true);
        // } else {
        //     swal("Error!", "No data to display.", "warning");
        // }
        const response = await axios("http://localhost:9090/api-expenseTracker/isTableEmpty")
        if(response.data == false) {
            setShowTable(true);
        }
        else {
            swal("Error!", "Add data to display!.", "warning");
        }
    }

    const handleReset = () => {
        setExpenseName("");
        setExpenseAmount("");
        setErrExpenseAmount(false);
        setErrExpenseName(false);
        setShowTable(false);
    }

    const getCurrentDate = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const fullDate = day+"-"+month+"-"+year;
        setCurrentDate(fullDate);
    }

    return (
        <div className="expense-tracker">
            {!showTable ? (
                <div className="login-page">
                    <Form onSubmit={handleExpense}>

                    <Form.Group className="mb-3 input-container" controlId="formBasicExpenseName">
                            <Form.Label className="labels">Date</Form.Label>
                            <Form.Control
                                className="input-field disabled-input"
                                type="text"
                                disabled
                                value={currentDate}
                                
                            />
                        </Form.Group>
                        <Form.Group className="mb-3 input-container" controlId="formBasicExpenseName">
                            <Form.Label className="labels">Expense Name</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="text"
                                onChange={handleExpenseType}
                                value={expenseName}
                                placeholder="Enter Expense Type"
                            />
                            {errExpenseName && <div className='validation-warning'>Please Enter the Expense Name</div>}
                        </Form.Group>

                        <Form.Group className="mb-3 input-container" controlId="formBasicExpenseAmount">
                            <Form.Label className="labels">Expense Amount</Form.Label>
                            <div className="input-wrapper">
                                <Form.Control
                                    className="input-field password-input"
                                    type="number"
                                    placeholder="Enter Amount"
                                    value={expenseAmount}
                                    onChange={handleExpenseAmount}
                                />
                            </div>
                            {errExpenseAmount && <p className="validation-warning">Amount must be greater than 0</p>}
                        </Form.Group>

                        <div className="btn-grps">
                            <Button variant="success" type="button" onClick={handleTable}>
                                Show Table
                            </Button>
                            <Button variant="success" type="submit">
                                Add
                            </Button>
                            <Button variant="primary" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </Form>
                </div>
            ) : (
                <ShowTable data={expenseList} columns={columns} showTable={showTable} months={months} setShowTable={setShowTable} currentMonth={monthName} />
            )}
        </div>
    );
}

export default ExpenseTrackerPage;
