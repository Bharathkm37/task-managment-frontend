import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, signInWithGoogle } from '../utils/auth';
import { Button, Modal, Form, Navbar, Nav, FormControl, InputGroup, Dropdown, Card } from 'react-bootstrap';


function SignupPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
          navigate('/tasks');
        } else {
          navigate('/signup');
        }
      }, [navigate]);

    const handleSignup = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const { error } = await signUp(email, password, `${firstName} ${lastName}`);
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

    const handleGoogleSignup = async () => {
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
        } else {
            navigate('/');
        }
    };

  

 

    return (
        <div>
         <Navbar bg="primary" expand="lg" className="mb-3 d-flex justify-content-between px-3">
                <Navbar.Brand className='text-white'>Sign Up Page</Navbar.Brand>
                <Nav className="ml-auto">
                    <Button variant="outline-danger text-white" onClick={() => {navigate('/login');}}>Login</Button>
                </Nav>
             
            </Navbar>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form className="card card-body">
                        <h3 className="text-center mb-4">Signup</h3>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100" onClick={handleSignup}>Signup</button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        <p className="text-center mt-3">
                            Already have an account? <a href="/login">Login</a>
                        </p>
                        <button className="btn btn-secondary w-100 mt-2" onClick={handleGoogleSignup}>
                            Signup with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
}

export default SignupPage;
