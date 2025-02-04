import React from 'react';
import { Button, InputNumber, Card } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartItem = ({ name, price, image }) => (
    <div className="flex items-center bg-pink-100 p-4 rounded-xl shadow-sm mb-4">
        <img src={image} alt={name} className="w-16 h-16 object-cover rounded-lg mr-4" />
        <div className="flex-1 text-left">
            <h3 className="font-bold text-lg">{name}</h3>
        </div>
        <InputNumber min={1} defaultValue={1} className="w-14 text-center mx-2" />
        <span className="text-lg font-semibold mx-2">${price}</span>
        <Button type="text" icon={<DeleteOutlined className="text-xl" />} className="text-gray-600 hover:text-red-500" />
    </div>
);

const Checkout = () => {
    const navigate = useNavigate();
    const cartItems = [
        { id: 1, name: 'BOUQUET NO-3', price: 25, image: 'https://via.placeholder.com/80' },
        { id: 2, name: 'BOUQUET NO-3', price: 25, image: 'https://via.placeholder.com/80' },
        { id: 3, name: 'BOUQUET NO-3', price: 25, image: 'https://via.placeholder.com/80' },
    ];

    const totalProductPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    const shippingPrice = 25;
    const totalPrice = totalProductPrice + shippingPrice;
    const walletBalance = 125;
    const remainingBalance = walletBalance - totalPrice;

    return (
        <div className="w-full">
            <Header />
            <div className="flex ml-20 mt-10 mb-4">
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    className="bg-pink-300 text-white text-lg px-6 py-5 rounded-md shadow-md"
                    onClick={() => navigate(-1)}
                >
                    BACK
                </Button>
            </div>
            <div className="bg-white mx-20">
                <h1 className="text-5xl font-bold text-pink-500 mb-5 text-center">Checkout</h1>
                <p className="text-base text-gray-500 mb-10 text-center">Complete Your Purchase</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-pink-500 mb-4">Order Details</h2>
                        {cartItems.map(item => (
                            <CartItem key={item.id} {...item} />
                        ))}

                        <div className="mt-6">
                            <h3 className="text-lg font-bold">Price Details</h3>
                            <div className="flex justify-between mt-2">
                                <span>Total Product Price</span>
                                <span>${totalProductPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Price</span>
                                <span>${shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-red-500 font-bold">
                                <span>Total Price</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Remaining Balance</span>
                                <span>${remainingBalance}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-pink-500 mb-4">Shipping Information</h2>
                        <p><strong>Name:</strong> CUSTOMERNAME</p>
                        <p><strong>Phone Number:</strong> 0909090909</p>
                        <p><strong>Delivery Address:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
                        <p><strong>Time:</strong> 08:00 AM - 08/17/2025</p>
                        <p><strong>Note:</strong> Lorem ipsum dolor sit amet</p>

                        <Card className="mt-6 bg-purple-500 text-white text-center shadow-md">
                            <h3 className="text-lg">Wallet Balance</h3>
                            <p className="text-3xl font-bold">${walletBalance}</p>
                        </Card>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Button type="primary" className="bg-pink-400 text-white text-xl px-10 py-3 rounded-md">
                        Pay with Wallet
                    </Button>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Checkout;
