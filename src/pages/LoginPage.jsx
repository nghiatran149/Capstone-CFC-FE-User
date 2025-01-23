import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Input, Button } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthPic from "../assets/authpic.jpg";
import AuthBG from "../assets/authbg.jpg";

const LoginPage = () => {
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
                    Sign In to Customize Your Dream Bouquets
                </h1>
                <p className="text-white text-left mb-6 mx-20 max-w-2xl">
                    Unlock a world of possibilities—personalize your floral designs, manage orders, and enjoy seamless delivery with just a few clicks.
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
                <section>
                    <h1 className="text-6xl font-serif font-bold mt-10 mb-10 mx-20 max-w-2xl">
                        Sign In
                    </h1>
                    <Link to={"/register"} className="text-lg font-serif ">
                        Don&apos;t have an account? Sign Up
                    </Link>
                        <form>
                            <div className="mb-4 mt-10">
                                <label htmlFor="username" className="block text-xl text-left font-medium mb-5">Email</label>
                                <Input id="username" placeholder="Enter your username or email" />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="password" className="block text-xl text-left font-medium mb-5">Password</label>
                                <Input.Password id="password" placeholder="Enter your password" />
                            </div>
                            <div className="mb-4">
                                <button className="bg-pink-600 text-white px-10 p-2 mt-5 hover:bg-pink-800">Sign In</button>
                            </div>
                            <div className="text-right text-gray-600 text-sm mt-5">
                                <Link to={"/forgot"} className="hover:text-gray-800">Forgot your password?</Link>
                            </div>
                        </form>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;
