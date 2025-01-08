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
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState("");
    const [errExpenseName, setErrExpenseName] = useState(false);
    const [errExpenseAmount, setErrExpenseAmount] = useState(false);
    const [copyExpenseList, setCopyExpenseList] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [monthName, setMonthName] = useState("");
    const [isEditable, setIsEditable] = useState(false);
    const [editableIndex, setEditableIndex] = useState(-1);
    const [sortableField, setSortableField] = useState("ASC");
    const [search, setSearch] = useState("");
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const currentDate = new Date();
    const currentMonth = (`0${currentDate.getMonth() + 1}`).slice(-2); // Months are zero-based
    const currentYear = currentDate.getFullYear().toString();
    const [expenseList, setExpenseList] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth); // January
    const [selectedYear, setSelectedYear] = useState(currentYear); //2025

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

    const handleSearch = (evt) => {
        const searchItem = evt.target.value.trim();  // Trim whitespace from user input
        setSearch(searchItem);  // Update the search state with the trimmed value

        if (searchItem === "") {
            setExpenseList(copyExpenseList);  // Reset to the full list when search is empty
        } else {
            const searchList = copyExpenseList.filter((item) =>
                item.amount.toString().includes(searchItem) ||
                item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
                item.date.includes(searchItem)
            );
            setExpenseList(searchList);  // Update with filtered results
        }
    };

    const getDifference = async () => {

        const originalMonthName = months[parseInt(selectedMonth) - 1];

        const fetchedExpense = await handleSalary(originalMonthName);
        const fetchedSalary = await getCurrentMonthSalary(originalMonthName);

        const calculatedDifference = fetchedSalary - fetchedExpense;

        setCurrMonthSalary(fetchedSalary);
        setDifference(calculatedDifference);
    };


    // Fetches total expense for the selected month
    const handleSalary = async (originalMonthName) => {
            const response = await axios.get(`http://localhost:9090/api-expenseTracker/getFinalSalary/${originalMonthName}`);
            return response.data;
    };

    // Fetches the current month's salary
    const getCurrentMonthSalary = async (originalMonthName) => {
            const response = await axios.get(`http://localhost:9090/api-handling-month/getCurrMonthSal/${originalMonthName}`);
            return response.data;
    };

    useEffect(() => {
        fetchExpenseList();
        getCurrentDate();
        getDifference();
    // handleTable();
    }, []);
    

    useEffect(() => {
        fetchExpenseList();
        getDifference();
    }, [selectedMonth]);

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
                console.log(expenseList[index]);
                const expenseId = expenseList[index].expenseId;
                setDifference((prevState) => prevState + expenseList[index].amount);
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

    // Helper function to convert timestamp to date string in 'dd/mm/yyyy' format
    const getDateFromTS = (timestamp) => {
        const date = new Date(timestamp);
        const day = (`0${date.getDate()}`).slice(-2);
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Months are zero-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    useEffect(() => {
        fetchExpenseList();
    }, [selectedMonth, selectedYear]); 

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
            setCopyExpenseList(expenseData);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    // Function to filter data based on selected month and year
    const filterDataByMonthYear = (data, month, year) => {
        return data.filter(item => {
            const [day, monthStr, yearStr] = item.date.split('/');
            return monthStr === month && yearStr === year;
        });
    };

    // Memoize the filtered data to avoid unnecessary recalculations
    const filteredData = useMemo(() => {
        const filtered = filterDataByMonthYear(expenseList, selectedMonth, selectedYear);
        return filtered;
    }, [expenseList, selectedMonth, selectedYear]);

    const getMonthName = () => {
            const date = new Date();
            let month = date.getMonth();
            setMonthName(months[month]);
            return months[month];
    }

    const handleExpense = (event) => {
        event.preventDefault();
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
                monthName: getMonthName(),
                expenseId: editableIndex,
                expenseDate: getCurrentDateInTS()
            };
            axios.post("http://localhost:9090/api-expenseTracker/saveExpense", expenseTrackerData)
                .then(response => {
                    swal("Success!", "Expense Data Saved!", "success");
                    setDifference((prev)=>prev-expenseAmount);
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
                monthName: getMonthName(),
                expenseDate: getCurrentDateInTS()
            };
            axios.put(`http://localhost:9090/api-expenseTracker/updateExpense/${editableIndex}`, expenseTrackerData)

                .then(response => {
                    swal("Success!", "Expense Data Updated!", "success");
                    setDifference((prev)=>prev-expenseAmount);
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

    const handleSorting = (field) => {
        if (!field) return;

        const sortedList = [...expenseList]; 
        if (sortableField === "ASC") {
            sortedList.sort((a, b) => {
                if (field === "Expense Amount") {
                    return a.amount - b.amount;
                } else if (field === "Date") {
                    return new Date(a.date) - new Date(b.date);
                }
            });
            setSortableField("DESC");
        } else {
            sortedList.sort((a, b) => {
                if (field === "Expense Amount") {
                    return b.amount - a.amount;

                } else if (field === "Date") {
                    return new Date(b.date) - new Date(a.date);

                }
            });
            setSortableField("ASC");
        }

        setExpenseList(sortedList);
    };
    

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
        //setCurrentDate(fullDate);
    }

    return (
        <div className="expense-tracker">
                <div className="login-page-table">
                    <Form onSubmit={handleExpense}>
                        <Row className="row-inline">
                            <Col md="8"><Form.Label className="expense">Add an Expense </Form.Label> </Col>
                           <Col md="5"><Form.Control className='search-box' type="search" placeholder='Search Expense' onChange={handleSearch} value={search}/></Col>
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
                            <Col md={2} >
                                <Form.Label className="labels">month</Form.Label>
                                <select style={{height:'30px'}} value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                                    <option value="01">January</option>
                                    <option value="02">February</option>
                                    <option value="03">March</option>
                                    <option value="04">April</option>
                                    <option value="05">May</option>
                                    <option value="06">June</option>
                                    <option value="07">July</option>
                                    <option value="08">August</option>
                                    <option value="09">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </Col>
                            <Col md={1} >
                                <Form.Label className="labels">year</Form.Label>
                                <select style={{height:'30px'}} value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    {/* Add more years as needed */}
                                </select>
                            </Col>

                        </Row>

                        <ShowTable 
                            data={filteredData}
                            columns={columns}
                            showTable={showTable}
                            months={months}
                            setShowTable={setShowTable}
                            handleSorting={handleSorting}
                            currentMonth={monthName} />
                    </Form>
                </div>
        </div>
    );
}

export default ExpenseTrackerPage;


