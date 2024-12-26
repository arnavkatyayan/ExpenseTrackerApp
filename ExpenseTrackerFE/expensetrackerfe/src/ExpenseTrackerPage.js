import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ShowTable from './showTable';
import swal from 'sweetalert';
import axios from 'axios';

function ExpenseTrackerPage(props) {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [errExpenseName, setErrExpenseName] = useState(false);
    const [errExpenseAmount, setErrExpenseAmount] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [monthName, setMonthName] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [currentDateInTS, setCurrentDateInTS] = useState(0);
    const [isEditable, setIsEditable] = useState(false);
    const [editableIndex, setEditableIndex] = useState(-1);
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
    // handleTable();
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
        [expenseList]
    );
    useEffect(()=> {
        if(isEditable) {
            setShowTable(false);

        }
        
    },[isEditable]);

    const handleEdit = (index) => {
        // Ensure the index is valid
        if (index >= 0 && index < expenseList.length) {
            setIsEditable(true);
            const selectedExpense = expenseList[index];
            
            // Set expense details to the state
            setExpenseName(selectedExpense.name); // Using the accessor name from columns
            setExpenseAmount(selectedExpense.amount); // Using the accessor amount from columns
            setEditableIndex(selectedExpense.expenseId); // Setting the ID for updates
        }
    };
    
    const handleDelete = async (index) => {
        try {
            if (expenseList.length > 0 && index >= 0 && index < expenseList.length) {
                const expenseId = expenseList[index].expenseId;
                console.log("Deleting expense with ID:", expenseId);

                // Perform the delete request
                await axios.delete(`http://localhost:9090/api-expenseTracker/deleteExpense/${expenseId}`);

                // Success alert
                swal("Success", "Entry Deleted!", "success");

                // Re-fetch the expense list after deletion
                await fetchExpenseList();
            } else {
                console.error("Invalid index or empty expense list");
            }
        } catch (error) {
            swal("Error", "Error deleting the entry", "error");
            console.error("Error deleting expense:", error);
        }
    };

    const getDateFromTS = (date) => {
        const conversion = new Date(date);
        return conversion.toLocaleDateString();
    }

    const fetchExpenseList = async () => {
        try {
            const response = await axios.get("http://localhost:9090/api-expenseTracker/getExpenses");
            const expenseData = response.data.map(item => ({
                name: item.expenseName,
                amount: parseFloat(item.expenseAmount),
                date: getDateFromTS(item.expenseDate),
                expenseId: item.expenseId,
            }));
            console.log("Fetched Expense Data: ", expenseData);
            setExpenseList(expenseData);
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
        if (!hasError && !isEditable) {
            const expenseTrackerData = {
                expenseName: expenseName,
                expenseAmount: Number(expenseAmount),
                monthName: monthName,
                expenseId: editableIndex,
                expenseDate: getCurrentDateInTS()
            };
            axios.post("http://localhost:9090/api-expenseTracker/saveExpense", expenseTrackerData)
                .then(response => {
                    swal("Success!", "Expense Data Saved!", "success");
                    fetchExpenseList();  // Fetch updated expenses after saving
                    
                })
                .catch(error => {
                    swal("Error!", "Failed to save the expense.", "warning");
                });

            // Reset input fields

        }
        if (!hasError && isEditable) {
            const expenseTrackerData = {
                expenseName: expenseName,
                expenseAmount: Number(expenseAmount),
                monthName: monthName,
                expenseDate: getCurrentDateInTS()
            };
            axios.put(`http://localhost:9090/api-expenseTracker/updateExpense/${editableIndex}`, expenseTrackerData)

                .then(response => {
                    swal("Success!", "Expense Data Updated!", "success");
                    fetchExpenseList();  // Fetch updated expenses after saving
                    setIsEditable(false);
                })
                .catch(error => {
                    swal("Error!", "Failed to update the expense.", "warning");
                });

        }
        setExpenseName("");
        setExpenseAmount("");
    }

    const handleTable = async () => {
      
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
                <div className="login-page-table">
                    <Form onSubmit={handleExpense}>
                        <Form.Group className="mb-3 input-container" controlId="formBasicDate">
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
                            <Button variant="success" type="button" onClick={() => {
                                handleTable();
                            }}>
                                Show Table
                            </Button>
                            <Button variant="success" type="submit">
                                {!isEditable ? "Save" : "Update"}
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
