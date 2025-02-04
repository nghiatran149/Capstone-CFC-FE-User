import React from 'react';
import { Button, InputNumber } from 'antd';
import { DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";

const CartItem = ({ name, price, image }) => (
    <div className="flex items-center bg-pink-100 p-6 rounded-2xl shadow-md mb-4">
        <img src={image} alt={name} className="w-24 h-24 object-cover rounded-xl mr-6" />
        <div className="flex-1 text-left">
            <h3 className="font-bold text-2xl">{name}</h3>
            <p className="text-base text-gray-500">Lorem ipsum dolor sit amet, consectetur</p>
        </div>
        <InputNumber min={1} defaultValue={1} className="w-16 h-12 text-lg text-center mx-5" />
        <span className="text-2xl font-semibold mr-4 text-pink-700 mx-5">${price}</span>
        <Button
            type="text"
            icon={<DeleteOutlined className="text-xl" style={{ fontSize: '24px' }} />}
            className="text-gray-600 hover:text-red-500 mx-5"
        />
    </div>
);

const ShoppingCart = () => {
    const navigate = useNavigate();
    const cartItems = [
        { id: 1, name: 'BOUQUET NO-1', price: 25, image: 'https://i.pinimg.com/736x/52/16/98/5216984883394666537faad7316373cf.jpg' },
        { id: 2, name: 'BOUQUET NO-2', price: 25, image: 'https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-lang-hoa-dep-chuc-mung-sinh-nhat-1-08-09-31-09.jpg' },
        { id: 3, name: 'BOUQUET NO-3', price: 25, image: 'https://nhahoa.com.vn/wp-content/uploads/2021/06/HG025.jpg' },
    ];

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

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
            <div className="max-w-4xl mx-auto p-4">

                <h1 className="text-5xl font-bold text-pink-500 mb-8 text-center">SHOPPING CART</h1>
                <p className="text-center text-gray-600 mb-6">You have {cartItems.length} item in your cart</p>

                {cartItems.map((item) => (
                    <CartItem key={item.id} {...item} />
                ))}

                <div className="text-center mt-10 mb-8">
                    <Link to="/checkout">
                        <Button type="primary" className="bg-pink-400 text-white text-2xl px-10 py-8 rounded-md">
                            ${total} Checkout
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ShoppingCart;
