import './App.css';
import LoginPage from './LoginPage';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import ChangePasswordPage from './ChangePasswordPage';
import Logo from './LogoFinal.jpg';

function App() {
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isChangePassClicked, setIsChangePassClicked] = useState(false);
  const [isRecurringExpenseClicked, setIsRecurringExpenseClicked] = useState(false);
  
  const handleLogout = () => {
    setIsLogoutClicked(!isLogoutClicked);
  }

  const handleChangePass = () => {
    setIsChangePassClicked(!isChangePassClicked);
  }

  const handleRecurringExpense = () => {
    setIsRecurringExpenseClicked(!isRecurringExpenseClicked);
  }

  useEffect(() => {
    const updateDateTime = () => {
        const now = new Date();
        const formattedDateTime = now.toLocaleString(); // Formats date and time based on locale
        setCurrentDateTime(formattedDateTime);
    };

    updateDateTime(); // Initial update
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
}, []);


  return (
    <div>
      <div className='heading'>
            <h1 className='heading-name'><img src={Logo} className='logo'/> ExpensiFy</h1>
            {isLogoutClicked ? 
            <p className="date-time">{currentDateTime}</p>: <p className="date-time login-date">{currentDateTime}</p> }
            {/* {isChangePassClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleChangePass}>Change Password</Button>:null} */}
            {isLogoutClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleChangePass}>{!isChangePassClicked ? "Change Password" : "Go Back"}</Button>:null}
            {isLogoutClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleRecurringExpense}>Recurring Expense</Button> : null}
            {isLogoutClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleLogout}>Logout</Button> : null}
      </div>

      <LoginPage isLogoutClicked={isLogoutClicked} setIsLogoutClicked={setIsLogoutClicked} isChangePassClicked={isChangePassClicked} setIsChangePassClicked={setIsChangePassClicked} isRecurringExpenseClicked={isRecurringExpenseClicked} setIsRecurringExpenseClicked={setIsRecurringExpenseClicked}/>
      {/* <ChangePasswordPage/> */}
      <footer className='footer'>
        <p>2025.1.4</p>
      </footer>
    </div>
  );
}

export default App;


