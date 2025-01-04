import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ShowTable from './showTable';
import swal from 'sweetalert';
import axios from 'axios';
import { Row, Col} from 'react-bootstrap';
import Select from 'react-select';

function ExpenseTrackerPage(props) {
    const [currMonthSalary, setCurrMonthSalary] = useState(0);
    const [difference, setDifference] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [errExpenseName, setErrExpenseName] = useState(false);
    const [errExpenseAmount, setErrExpenseAmount] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [monthName, setMonthName] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [editableIndex, setEditableIndex] = useState(-1);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
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

    const handleSelectChange = (option) => {
        setSelectedOption(option);
    };

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


    const getDifference = async () => {

        const fetchedExpense = await handleSalary();
        const fetchedSalary = await getCurrentMonthSalary();

        const calculatedDifference = fetchedSalary - fetchedExpense;

        setCurrMonthSalary(fetchedSalary);
        setDifference(calculatedDifference);
    };


    // Fetches total expense for the selected month
    const handleSalary = async () => {
        if (selectedOption) {
            const response = await axios.get(`http://localhost:9090/api-expenseTracker/getFinalSalary/${selectedOption.value}`);
            return response.data; // Return the fetched data
        }else{
            const response = await axios.get(`http://localhost:9090/api-expenseTracker/getFinalSalary/January`);
            return response.data; // Return the fetched data
        }
    };

    // Fetches the current month's salary
    const getCurrentMonthSalary = async () => {
        if (selectedOption) {
            const response = await axios.get(`http://localhost:9090/api-handling-month/getCurrMonthSal/${selectedOption.value}`);
            return response.data; // Return the fetched data
        }else{
            const response = await axios.get(`http://localhost:9090/api-handling-month/getCurrMonthSal/January`);
            return response.data; // Return the fetched data
        }
    };

    useEffect(() => {
        getMonthName();
        fetchExpenseList();
        getCurrentDate();
        getDifference();
    // handleTable();
    }, []); // Empty dependency array ensures this runs only once on page load
    
    const getMonthName = () => {
        const date = new Date();
        const currentMonth = months[date.getMonth()];
        setMonthName(currentMonth);
    }

    useEffect(() => {
        getDifference();
    }, [selectedOption]);

    useEffect(() => {
            const defaultOption = monthOptions.find(option => option.value === props.currentMonth);
            setSelectedOption(defaultOption);
        }, [props.currentMonth]);

    const columns = useMemo(
        () => [
            { Header: 'Expense Name', accessor: 'name' },
            { Header: 'Expense Amount', accessor: 'amount' },
            { Header: 'Date', accessor: 'date' },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ row }) => (
                    <div className='btn-grps-Expense'>
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
        if(response.data === false) {
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
                <div className="login-page-table">
                    <Form onSubmit={handleExpense}>
                        <Row className="row-inline">
                            <Col md="8"><Form.Label className="expense">Add an Expense </Form.Label> </Col>
                            <Col md="4"><div className="SalAndBal">Salary: {currMonthSalary} | Balance: {difference}</div></Col>        
                        </Row>
                        <Row className="add-expense" >
                            <Col md={3}>
                                <Form.Group className="input-container" controlId="formBasicExpenseName">
                                    <Form.Label className="labels">Expense Name</Form.Label>
                                    <Form.Control
                                        className="input-field"
                                        type="text"
                                        onChange={handleExpenseType}
                                        value={expenseName}
                                        placeholder="Enter Expense Type"
                                    />
                                    {errExpenseName && (
                                        <div className="validation-warning">Please Enter the Expense Name</div>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group className="input-container" controlId="formBasicExpenseAmount">
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
                                    {errExpenseAmount && (
                                        <p className="validation-warning">Amount must be greater than 0</p>
                                    )}
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                            <div className="btn-grps-Expense">
                                <Button variant="success" type="submit" style={{ marginLeft: '-35px' }}>
                                        {!isEditable ? "Add" : "Update "}
                                </Button>
                                <Button variant="primary" type="button" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                            </Col>
                            <Col md={3} >
                                <Form.Label className="labels">Expenses (monthly)</Form.Label>
                                <Select
                                    value={selectedOption}
                                    onChange={handleSelectChange}
                                    options={monthOptions}
                                    className="input-field-month"
                                    placeholder="Select month"
                                />
                            </Col>
                        </Row>

                        <ShowTable 
                            data={expenseList}
                            columns={columns}
                            showTable={showTable}
                            months={months}
                            setShowTable={setShowTable}
                            currentMonth={monthName} />
                    </Form>
                </div>
        </div>
    );
}

export default ExpenseTrackerPage;
