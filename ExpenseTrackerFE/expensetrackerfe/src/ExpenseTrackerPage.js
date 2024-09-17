import { React, useState, useMemo } from 'react';
import './App.css';
import { Button, Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import ShowTable from './showTable';
import swal from 'sweetalert';

function ExpenseTrackerPage(props) {
    const [expenseName, setExpenseName] = useState("");
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [errExpenseName, setErrExpenseName] = useState(false);
    const [errExpenseAmount, setErrExpenseAmount] = useState(false);
    const [expenseList, setExpenseList] = useState([]);
    const [showTable, setShowTable] = useState(false);

    const handleExpenseAmount = (evt) => {
        setExpenseAmount(evt.target.value);
    }

    const handleExpenseType = (evt) => {
        setExpenseName(evt.target.value);
    }

    const columns = useMemo(
        () => [
            { Header: 'Expense Name', accessor: 'name' },
            { Header: 'Expense Amount', accessor: 'amount' },
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
        
    }

    const handleDelete = (index) => {
        
    }

    const data = useMemo(() => expenseList, [expenseList]);

    const handleExpense = (event) => {
        event.preventDefault();

        // Reset error states
        setErrExpenseName(false);
        setErrExpenseAmount(false);

        // Basic validation for name and amount
        let hasError = false;
        if (expenseAmount === 0 || isNaN(expenseAmount)) {
            setErrExpenseAmount(true);
            hasError = true;
        }
        if (expenseName.trim().length === 0) {
            setErrExpenseName(true);
            hasError = true;
        }

        // If validation passes, add the expense to the list
        if (!hasError) {
            const newExpense = { name: expenseName, amount: parseFloat(expenseAmount) };
            setExpenseList([...expenseList, newExpense]);

            // Reset input fields
            setExpenseName("");
            setExpenseAmount(0);
        }
    }

    const handleTable = () => {
        if (expenseList.length > 0) {
            setShowTable(true);
        }
        else {
            swal("Error!", "Please enter the data first.", "warning");

        }
    }

    const handleReset = () => {
        setExpenseName("");
        setExpenseAmount(0);
        setErrExpenseAmount(false);
        setErrExpenseName(false);
        setShowTable(false);
    }

    return (
        <div className="expense-tracker">
            {!showTable ?
                <div className="login-page">
                    <Form>
                        <Form.Group className="mb-3 input-container" controlId="formBasicEmail">
                            <Form.Label className="labels">Expense Name</Form.Label>
                            <Form.Control
                                className="input-field"
                                type="text"
                                onChange={handleExpenseType}
                                value={expenseName}
                                placeholder="Enter Expense Type"
                            />
                            {errExpenseName ? <div className='validation-warning'>Please Enter the Expense Name</div> : null}
                        </Form.Group>

                        <Form.Group className="mb-3 input-container" controlId="formBasicPassword">
                            <Form.Label className="labels">Expense Amount</Form.Label>
                            <div className="input-wrapper">
                                <Form.Control
                                    className="input-field password-input"
                                    type="text"
                                    placeholder="Enter Amount"
                                    value={expenseAmount}
                                    onChange={handleExpenseAmount}
                                />
                            </div>
                            {errExpenseAmount ? <p className="validation-warning">Amount must be greater than 0</p> : null}
                        </Form.Group>

                        <div className="btn-grps">
                            <Button variant="success" type="button" onClick={handleTable}>
                                Show Table
                            </Button>
                            <Button variant="success" type="submit" onClick={handleExpense}>
                                Add
                            </Button>
                            <Button variant="primary" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </Form>
                </div>
                :
                <ShowTable data={data} columns={columns} showTable={showTable} setShowTable={setShowTable} />
            }
        </div>
    )
}

export default ExpenseTrackerPage;
