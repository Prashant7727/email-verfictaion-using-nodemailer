import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loginStatus, setLoginStatus] = useState(null); // Track login status: null (initial), true (success), false (failure)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/user/login', formData);
      setLoginStatus(true); // Login successful
      // Redirect or show success message
    } catch (error) {
      console.error('Login error:', error);
      setLoginStatus(false); // Login failed
      // Handle error, show error message
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </form>
              {loginStatus === true && (
                <div className="alert alert-success mt-3" role="alert">
                  Login successful!
                </div>
              )}
              {loginStatus === false && (
                <div className="alert alert-danger mt-3" role="alert">
                  Login failed. Please check your credentials.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
