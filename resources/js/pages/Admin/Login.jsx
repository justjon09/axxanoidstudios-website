import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import AuthContext from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login({ email, password, remember });
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-700 bg-gray-700 text-white"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-700 bg-gray-700 text-white"
                        required
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="remember" className="text-sm">Remember Me</label>
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Login <ArrowRight className="ml-2 inline-block" />
                </button>
            </form>
        </div>
    );
};

export default Login;