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
        { id: 1, name: 'BOUQUET NO-1', price: 25, image: 'https://i.pinimg.com/736x/52/16/98/5216984883394666537faad7316373cf.jpg' },
        { id: 2, name: 'BOUQUET NO-2', price: 25, image: 'https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-lang-hoa-dep-chuc-mung-sinh-nhat-1-08-09-31-09.jpg' },
        { id: 3, name: 'BOUQUET NO-3', price: 25, image: 'https://nhahoa.com.vn/wp-content/uploads/2021/06/HG025.jpg' },
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
            <div className="bg-white mx-20 my-10">
                <h1 className="text-6xl font-bold text-pink-500 mb-5 text-center">Checkout</h1>
                <p className="text-xl text-gray-500 mb-10 text-center">Complete Your Purchase</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                    <div>
                        <h2 className="text-3xl font-semibold text-pink-500 mb-10">Order Details</h2>
                        {cartItems.map(item => (
                            <CartItem key={item.id} {...item} />
                        ))}
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold text-pink-500 mb-10">Shipping Information</h2>
                        <div className="text-xl break-words mx-20">
                            <p className="text-justify text-xl mb-3"><strong>Name:</strong> CUSTOMERNAME</p>
                            <p className="text-justify text-xl mb-3"><strong>Phone Number:</strong> 0909090909</p>
                            <p className="text-justify text-xl mb-3"><strong>Delivery Address:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus eget ligula non urna viverra dapibus. Nunc ac eros non libero efficitur scelerisque.</p>
                            <p className="text-justify text-xl mb-3"><strong>Time:</strong> 08:00 AM</p>
                            <p className="text-justify text-xl mb-3"><strong>Date:</strong> 08/17/2025</p>
                            <p className="text-justify text-xl mb-3"><strong>Note:</strong> Lorem ipsum dolor sit amet</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-10">
                    <div>
                        <h2 className="text-3xl font-semibold text-pink-500 mb-10">Price Details</h2>
                        <div className=" w-2/3 mx-auto">
                            <div className="flex justify-between text-xl mb-3">
                                <span>Total Product Price</span>
                                <span>${totalProductPrice}</span>
                            </div>
                            <div className="flex justify-between text-xl mb-3">
                                <span>Shipping Price</span>
                                <span>${shippingPrice}</span>
                            </div>
                            <div className="flex justify-between text-xl mb-3 text-pink-500 font-semibold">
                                <span>Total Price</span>
                                <span>${totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-xl mb-3 font-semibold">
                                <span>Remaining Balance</span>
                                <span>${remainingBalance}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-semibold text-pink-500 mb-10">Your Wallet Balance</h2>
                        <Card className="bg-purple-400 text-white text-center shadow-md h-2/3 w-1/2 mx-auto">
                            <h3 className="text-xl text-gray-200 mb-5">Wallet Balance</h3>
                            <p className="text-3xl font-bold">${walletBalance}</p>
                        </Card>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <Button type="primary" className="bg-pink-400 text-white text-2xl px-10 py-8 rounded-md">
                        Pay with Wallet
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;
