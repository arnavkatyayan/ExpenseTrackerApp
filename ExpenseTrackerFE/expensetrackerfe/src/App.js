import './App.css';
import LoginPage from './LoginPage';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function App() {
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const handleLogout = () => {
    setIsLogoutClicked(!isLogoutClicked);
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
            <h1 className='heading-name'>Expense Tracker</h1>
            <p className="date-time">{currentDateTime}</p>
            {isLogoutClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleLogout}>Logout</Button> : null}
      </div>

      <LoginPage isLogoutClicked={isLogoutClicked} setIsLogoutClicked={setIsLogoutClicked} />
      <footer className='footer'>
        <p>2025.1.2</p>
      </footer>
    </div>
  );
}

export default App;


