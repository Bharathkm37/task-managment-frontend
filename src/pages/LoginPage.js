import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle } from '../utils/auth';
import { Button, Navbar, Nav} from 'react-bootstrap';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase/firebase.js';


function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/tasks');
    } else {
      navigate('/login');
    }
  }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        const { error, user } = await signIn(email, password);
        if (error) {
            setError(error.message);
        } else {
            console.log(user);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/tasks');
        }
    };

    const handleGoogleLogin =  async (e) => {
        const provider = new GoogleAuthProvider();
        const data = await signInWithPopup(auth, provider)

       const {user, error } = await signInWithGoogle(data.user.email, data.user.displayName);

       console.log(user)

       if (error) {
        setError(error.message);
       } else {
        console.log(user);
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/tasks');
       }

    };


    return (
        <div>
        <Navbar bg="primary" expand="lg" className="mb-3 d-flex justify-content-between px-3">
                <Navbar.Brand className='text-white'>Login In Page</Navbar.Brand>
                <Nav className="ml-auto">
                    <Button variant="outline-danger text-white" onClick={() => {navigate('/signup');}}>Signup</Button>
                </Nav>
             
            </Navbar>
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form className="card card-body">
                        <h3 className="text-center mb-4">Login</h3>
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
                        <button type="submit" className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        <p className="text-center mt-3">
                            Don't have an account? <a href="/signup">Signup</a>
                        </p>
                        <button type='button' className="btn btn-secondary w-100 mt-2" onClick={handleGoogleLogin}>
                            Login with Google
                        </button>
                    </form>
                </div>
            </div>
        </div>
        </div>
    )
}

export default LoginPage;
