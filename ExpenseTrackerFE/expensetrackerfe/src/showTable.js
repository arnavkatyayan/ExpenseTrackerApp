import React, { useState, useEffect } from "react";
import ReactTableComponent from "./ReactTableComponent";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import swal from "sweetalert";
import { Row, Col} from 'react-bootstrap';
function ShowTable(props) {
    const [selectedOption, setSelectedOption] = useState(null);
    const [saveToPc, setSaveToPc] = useState(false);
    const [sendToMail, setSendToMail] = useState(false);
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

    const handleSaveToPC = () => {
        setSaveToPc(!saveToPc);
    };

    const handleSendToMail = () => {
        setSendToMail(!sendToMail);
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

    return (
        <div className="expense-tracker-showtable">
            <div className="login-page-data show-table">
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
                        <Row className="download-report-row">
                            <Col md="3">
                                <Form.Label className="report-label">Download Report as</Form.Label>
                            </Col>
                            <Col md="3">
                                <Form.Group controlId="formBasicCheckbox1">
                                    <Form.Check
                                        type="checkbox"
                                        label="Save To PC"
                                        className="input-field"
                                        onChange={handleSaveToPC}
                                        checked={saveToPc}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="3">
                                <Form.Group controlId="formBasicCheckbox2">
                                    <Form.Check
                                        type="checkbox"
                                        label="Send To Email"
                                        className="input-field"
                                        onChange={handleSendToMail}
                                        checked={sendToMail}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md="3">
                                <div className="btn-grps-downRpt show-table-btns">
                                    <Button variant="primary" type="button" onClick={handleSaveOptions}>
                                    Download Report
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default ShowTable;
