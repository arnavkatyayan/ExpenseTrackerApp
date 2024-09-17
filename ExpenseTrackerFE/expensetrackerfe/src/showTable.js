import React from "react";
import ReactTableComponent from "./ReactTableComponent";
import { Button } from "react-bootstrap";

function showTable(props) {

    const handleBack = () => {
        props.setShowTable(false);
    }

    return(
        <div className="expense-tracker">
        <div className="login-page show-table">
        <div className="table-wrapper">
            <ReactTableComponent data={props.data} columns={props.columns} defaultPageSize={3} /> 
              

                <div className="btn-grps show-table-btns">
                    <Button variant="success" type="submit" onClick={handleBack}>
                        Back
                    </Button>
                    <Button variant="primary" type="button" >
                        Send To Mail
                    </Button>
                    <Button variant="primary" type="button" >
                        Save To PC
                    </Button>
                    <Button variant="info" type="button">
                        Show My Salary
                    </Button>

                </div>
        </div>

            
        </div>
    </div>
       
    )
}

export default showTable;