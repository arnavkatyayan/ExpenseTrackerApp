import logo from './logo.svg';
import './App.css';
import LoginPage from './LoginPage';
import { useState } from 'react';
import { Button } from 'react-bootstrap';

function App() {
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);

  const handleLogout = () => {
    setIsLogoutClicked(!isLogoutClicked);
  }

  return (
    <div>
      <div className='heading'>
        <h1 className='heading-name'>Expense Tracker</h1>
        {isLogoutClicked ? <Button variant="danger" type="button" className='logout-btn' onClick={handleLogout}>Logout</Button> : null}
      </div>

      <LoginPage isLogoutClicked={isLogoutClicked} setIsLogoutClicked={setIsLogoutClicked} />
      <footer className='footer'>
        <p>Version 1.0.0</p>
      </footer>
    </div>
  );
}

export default App;


