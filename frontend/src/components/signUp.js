import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SignUp.css'; // Import your CSS file

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '', // New OTP field
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [storedEmail, setStoredEmail] = useState(''); // Store the email after successful signup
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(60); // 1 minute timer
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true
    try {
      const response = await axios.post('http://localhost:5000/user/signup', formData);
      setStoredEmail(formData.email); // Store the email after successful signup
      setIsOtpSent(true); // Set isOtpSent to true after successful signup
      setVerificationMessage(response.data.message); // Set verification message
      setErrorMessage(''); // Clear any previous error message
      setFormData({ name: '', email: '', password: '', otp: '' }); // Clear form data after successful signup
    } catch (error) {
      console.error('Signup error:', error.message); // Log the error message
      setErrorMessage(error.response.data.message); // Set error message from the server response
    } finally {
      setIsLoading(false); // Set loading state to false after signup request is complete
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/verify-otp', { email: storedEmail, otp: formData.otp });
      setVerificationMessage(response.data.message); // Set verification message
      setErrorMessage(''); // Clear any previous error message
      setIsOtpSent(false); // Set isOtpSent back to false after OTP verification
      setIsEmailVerified(true); // Set isEmailVerified to true after successful OTP verification
      // You can perform additional actions after OTP verification if needed
    } catch (error) {
      console.error('OTP verification error:', error.message); // Log the error message
      setErrorMessage(error.response.data.message); // Set error message from the server response
    }
  };

  return (
    <div className={`container mt-5 ${isLoading ? 'blur' : ''}`}>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Signup</h2>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {isEmailVerified && <div className="alert alert-success">Email verified successfully</div>}
              {verificationMessage && !isEmailVerified && <div className="alert alert-info">{verificationMessage}</div>}
              {!isOtpSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
                  </div>
                  <button type="submit" className="btn btn-primary form-control">Signup</button>
                </form>
              ) : (
                <form className="mt-4" onSubmit={handleVerifyOTP}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name="email" value={storedEmail} readOnly />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">Enter OTP</label>
                    <input type="text" className="form-control" id="otp" name="otp" placeholder="Enter OTP" value={formData.otp} onChange={handleChange} />
                  </div>
                  <div className="mb-3">Time remaining: {timer} seconds</div>
                  <button type="submit" className="btn btn-primary form-control" disabled={timer <= 0}>Verify OTP</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="loading-screen">
          <div className="wandering-circle"></div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
