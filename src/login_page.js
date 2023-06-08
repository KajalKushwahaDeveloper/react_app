import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/login.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter email');
    } else if (!password) {
      setError('Please enter password');
    } else {
      // Perform your login logic here
      setError('');
      console.log('Login successful!');
      navigate('/home'); // Redirect to the home page
    }
  };

  return (
    <>
      <div className="login_div">
        <div className="center_div">
          <div>
            <img src="images/logo.png" alt="Logo" />
          </div>
          <div className="content">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                id="content_input"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
              {error && <p className="error">{error}</p>}
              <input
                type="password"
                id="content_input"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
              />
              {error && <p className="error">{error}</p>}
              <button className="login_button" type="submit">
                Login
              </button>
            </form>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
