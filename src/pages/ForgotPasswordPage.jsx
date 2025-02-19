import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Button, message } from 'antd';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthPic from "../assets/authpic.jpg";
import AuthBG from "../assets/authbg.jpg";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Kiểm tra nếu email hợp lệ
        if (!email) {
            message.error("Please enter your email.");
            return;
        }
    
        try {
            // Gửi yêu cầu đến API forgot-password
            const response = await axios.post(
                `http://localhost:5243/api/auth/forgot-password-by-customer?email=${encodeURIComponent(email)}`
            );
    
            if (response.status === 200) {
                // Nếu yêu cầu thành công
                message.success("Password reset link sent to your email.");
            } else {
                // Nếu có lỗi khi gửi yêu cầu
                message.error("Failed to send password reset link.");
            }
    
            // Reset form
            setEmail('');
        } catch (error) {
            console.error('Error during password reset request:', error);
            message.error("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="bg-pink-50 w-full min-h-screen">
            <Header />
            <section
                className="text-center py-12"
                style={{
                    backgroundImage: `url(${AuthPic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="text-6xl text-white text-left font-bold mt-10 mb-10 mx-20 max-w-2xl">
                    Forgot Password
                </h1>
                <p className="text-white text-left mb-6 mx-20 max-w-2xl">
                    Enter your email to receive a link to reset your password.
                </p>
            </section>

            <div
                className="flex justify-center items-center"
                style={{
                    backgroundImage: `url(${AuthBG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    padding: '40px 0',
                }}
            >
                <section className=" p-8 max-w-md w-full">
                    <h1 className="text-6xl font-serif font-bold mt-10 mb-10 text-center">
                        Forgot Password
                    </h1>
                    <Link to={"/login"} className="text-lg font-serif block text-center mb-5">
                        Already have an account? Sign In
                    </Link>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-xl text-left font-medium mb-5">Email</label>
                            <Input
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <button
                                type="submit"
                                className="bg-pink-600 text-white px-10 p-2 mt-5 hover:bg-pink-800"
                            >
                               Confirm
                            </button>
                        </div>
                    </form>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default ForgotPasswordPage;
