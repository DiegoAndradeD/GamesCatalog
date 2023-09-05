import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

/**
 * LoginForm is a component for user login.
 *
 * @returns {JSX.Element} - The rendered login form component.
 */
const LoginForm = () => {
  const navigate = useNavigate(); 

  //States of form, message, useInfo and redirect
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null); 
  const [redirectToHome, setRedirectToHome] = useState(false); 

   /**
     * Function to handle the form submition
     * Creates the formData and appends the data from the form fields to it
     * Calls the method to log in a user from the API
     * Calls the function to load the user info if succeeded
     * @param {*} event 
     */
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    
    try {
      await axios.post('/api/login', formData);
      setMessage('User Logged in Successfully');
      loadUserInfo(); 
    } catch (error) {
      setMessage('Error logging user');
    }
  };

  //Calls the API method to get the user's info
  const loadUserInfo = async () => {
    try {
      const response = await axios.get('/api/get-user-info', { withCredentials: true });
      setUserInfo(response.data);
      setRedirectToHome(true); 
    } catch (error) {
      console.error('Error loading user info', error);
    }
  };

  // Redirect to home page after successful login
  useEffect(() => {
    if (redirectToHome) {
      navigate('/');
      window.location.reload(); 
    }
  }, [redirectToHome, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">User Login</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
              {message && <p className="alert alert-info">{message}</p>}
              {userInfo && (
                <p className="alert alert-success">
                  Logged in as: {userInfo.email}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
