import React from 'react';
import { Input, Select, Button, Avatar } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import LatestDealBG from "../assets/latestdeal.jpg";

const { Option } = Select;

const UserProfile = () => {
    return (
        <div className="bg-pink-50 w-full min-h-screen">
            <Header />
            <section
                className="text-center py-12"
                style={{
                    backgroundImage: `url(${LatestDealBG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="text-5xl font-bold mb-4 mt-10">Welcome, USERNAME!</h1>
                <p className="text-gray-600 mb-6">Your profile displays your personal information and lets you manage your preferences with ease</p>
            </section>

            <div className="mx-auto p-10 bg-white pb-14">
                <div className="flex items-center justify-between ml-20 mr-20">
                    <div className="flex items-center space-x-4">
                        <Avatar size={100} src="https://via.placeholder.com/150" />
                        <div className="p-10">
                            <h2 className="text-2xl text-left font-bold">USERNAME</h2>
                            <p className="text-gray-500 text-left">useremail@gmail.com</p>
                        </div>
                    </div>
                    <Button type="primary" className="bg-pink-400 hover:bg-pink-600 border-none text-lg px-12 py-6">Edit</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 ml-20 mr-20">
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Full Name</label>
                        <Input placeholder="Your Full Name" className="p-3" />
                    </div>
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Nick Name</label>
                        <Input placeholder="Your Nick Name" className="p-3" />
                    </div>
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Gender</label>
                        <Select
                            placeholder="Your Gender"
                            className="w-full text-pink-600 border-pink-300 h-12 text-lg bg-white"
                            style={{ textAlign: 'left' }}
                        >
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Country</label>
                        <Select
                            placeholder="Your Country"
                            className="w-full text-pink-600 border-pink-300 h-12 text-lg bg-white"
                            style={{ textAlign: 'left' }}
                        >
                            <Option value="vietnam">Vietnam</Option>
                            <Option value="usa">USA</Option>
                            <Option value="uk">UK</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Language</label>
                        <Select
                            placeholder="Your Language"
                            className="w-full text-pink-600 border-pink-300 h-12 text-lg bg-white"
                            style={{ textAlign: 'left' }}
                        >
                            <Option value="english">English</Option>
                            <Option value="vietnamese">Vietnamese</Option>
                            <Option value="japanese">Japanese</Option>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-left text-lg font-medium mb-3">Time Zone</label>
                        <Select
                            placeholder="Your Time Zone"
                            className="w-full text-pink-600 border-pink-300 h-12 text-lg bg-white"
                            style={{ textAlign: 'left' }}
                        >
                            <Option value="gmt+7">GMT+7</Option>
                            <Option value="gmt+8">GMT+8</Option>
                            <Option value="gmt-5">GMT-5</Option>
                        </Select>
                    </div>
                </div>

                <div className="mt-10 ml-20 mr-20">
                    <h3 className="text-xl font-semibold text-left mb-8">My Email Address</h3>
                    <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center justify-center bg-pink-100 text-white rounded-full p-4">
                            <MailOutlined className="text-2xl text-pink-500" />
                        </div>
                        <div>
                            <p className="font-medium text-left text-lg">useremail@gmail.com</p>
                            <p className="text-gray-400 text-left text-lg">1 month ago</p>
                        </div>
                    </div>
                    <div className="flex justify-start mt-8">
                        <Button
                            type="dashed"
                            className="bg-pink-100 text-pink-500 hover:bg-pink-600 border-none text-base px-8 py-5">
                            + Add Email Address
                        </Button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserProfile;