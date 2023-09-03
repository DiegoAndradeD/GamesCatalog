import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import PasswordChecklist from "react-password-checklist"
import DOMPurify from 'dompurify';

/**
 * SignupForm is a component for user registration.
 *
 * @returns {JSX.Element} - The rendered user registration form component.
 */
const SignupForm = () => {
  const navigate = useNavigate(); 
  const navigateToLogin = () => {
    navigate('/login');
  };

  //States to signup form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState("")
  const [message, setMessage] = useState('');


  /**
   * Checks if the password is strong
   * Sanitizes the data
   * Calls the API Signup method
   * @param {*} event 
   * @returns 
   */
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //Checks if the password meets the specified criteria
    if (!isPasswordStrong(password)) {
      setMessage('The password does not meet the minimum criteria.');
      return; 
    }

    //Sanitize the data before they be putted in the form
    const cleanedFullName = DOMPurify.sanitize(fullName);
    const cleanedEmail = DOMPurify.sanitize(email);

    const formData = new FormData();
    formData.append('fullName', cleanedFullName);
    formData.append('email', cleanedEmail);
    formData.append('password', password);
    console.log(formData);

    try {
      await axios.post('/api/signup', formData);
      navigateToLogin();
      setMessage('User Registered Successfully');
    } catch (error) {
      setMessage('Error registering user');
    }
  };

  //Function implementing the password checkout
  const isPasswordStrong = (password) => {
    return password.length >= 5 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password) && password === passwordAgain;
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">User Registration</h2>
              <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
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
                  <label htmlFor="password" className="form-label">
                    Password Again:
                  </label>
                  <input
                    type="password"
                    id="passwordAgain"
                    className="form-control"
                    value={passwordAgain}
                    onChange={(e) => setPasswordAgain(e.target.value)}
                    required
                  />

                  <PasswordChecklist
                    rules={["minLength", "specialChar", "number", "capital", "match"]}
                    minLength={5}
                    value={password}
                    valueAgain={passwordAgain}
                    onChange={(isValid) => {if (isValid) {
                      setMessage("Strong Password");
                    } else {
                      setMessage("Weak Password");
                    }}}
                  />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                </div>
              </form>
              {message && <p className="alert alert-info">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
