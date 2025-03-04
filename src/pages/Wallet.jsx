import React, { useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";

const WalletPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);

    const orders = [
        {
            orderId: "#ORD001",
            details: ["Bouquet No.1", "Bouquet No.2", "Bouquet No.3"],
            price: 75,
            payment: "Deposit 50%",
            date: "2025-02-04",
            status: "Completed"
        },
        {
            orderId: "#ORD002",
            details: ["Bouquet No.4", "Bouquet No.5"],
            price: 50,
            payment: "Deposit 100%",
            date: "2025-02-03",
            status: "Processing"
        },
        {
            orderId: "#ORD003",
            details: ["Bouquet No.6", "Bouquet No.7"],
            price: 100,
            payment: "Deposit 50%",
            date: "2025-02-13",
            status: "Failed"
        },
        {
            orderId: "#ORD003",
            details: ["Bouquet No.8", "Bouquet No.9", "Bouquet No.10"],
            price: 100,
            payment: "Deposit 100%",
            date: "2025-02-21",
            status: "Completed"
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            Success: "text-green-600 bg-green-100",
            Pending: "text-yellow-600 bg-yellow-100",
            Failed: "text-red-600 bg-red-100",
            Completed: "text-green-600 bg-green-100",
            Processing: "text-blue-600 bg-blue-100"
        };
        return colors[status] || "text-gray-600 bg-gray-100";
    };

    const openChatModal = (order) => {
        setSelectedOrder(order);
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setSelectedOrder(null);
    };

    const ChatModal = () => {
        const [message, setMessage] = useState('');
        const [messages, setMessages] = useState([
            {
                text: "Hi, I have a question about my order.",
                sender: 'customer',
                timestamp: '10:00 AM'
            },
            {
                text: "Hello! How can I help you today?",
                sender: 'staff',
                timestamp: '10:01 AM'
            }
        ]);

        const handleSendMessage = () => {
            if (message.trim()) {
                const newMessage = {
                    text: message,
                    sender: 'customer',
                    timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                };
                setMessages([...messages, newMessage]);
                setMessage('');
                
                setTimeout(() => {
                    const staffResponse = {
                        text: "Thank you for your message. I'll help you with that shortly.",
                        sender: 'staff',
                        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    };
                    setMessages(prevMessages => [...prevMessages, staffResponse]);
                }, 1000);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex">

                    {/* Order Details Sidebar */}
                    <div className="w-1/3 bg-pink-50 rounded-l-2xl p-6 border-r border-pink-200">
                        <h2 className="text-2xl font-bold text-pink-600 mb-4">Order Details</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="font-semibold text-gray-700">Order ID:</p>
                                <p className="text-gray-600">{selectedOrder.orderId}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Items:</p>
                                <p className="text-gray-600">{selectedOrder.details.join(", ")}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Price:</p>
                                <p className="text-gray-600">${selectedOrder.price}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Payment:</p>
                                <p className="text-gray-600">{selectedOrder.payment}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Date:</p>
                                <p className="text-gray-600">{selectedOrder.date}</p>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-700">Status:</p>
                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(selectedOrder.status)}`}>
                                    {selectedOrder.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="w-2/3 flex flex-col">

                        <div className="bg-pink-400 text-white p-4 flex justify-between items-center rounded-tr-2xl">
                            <h2 className="text-xl font-bold">Chat Support - {selectedOrder.orderId}</h2>
                            <button 
                                onClick={closeChatModal} 
                                className="text-white hover:text-pink-200"
                            >
                                ✕
                            </button>
                        </div>
                        

                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, index) => (
                                <div 
                                    key={index} 
                                    className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`
                                        max-w-[70%] p-3 rounded-xl shadow-sm
                                        ${msg.sender === 'customer' 
                                            ? 'bg-pink-100 text-pink-800' 
                                            : 'bg-blue-100 text-blue-800'}
                                    `}>
                                        <p className="mb-1">{msg.text}</p>
                                        <p className="text-xs text-gray-500 text-right">{msg.timestamp}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        

                        <div className="p-4 border-t flex gap-2">
                            <input 
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="bg-pink-400 text-white px-6 py-3 rounded-lg hover:bg-pink-500 transition-colors"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            <Header />

            <div className="p-14 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-10-">
                    <div className="bg-pink-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-pink-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold">4</p>
                    </div>

                    <div className="bg-green-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Completed Orders</h3>
                        <p className="text-3xl font-bold">2</p>
                    </div>

                    <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Processing Orders</h3>
                        <p className="text-3xl font-bold">1</p>
                    </div>

                    <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Failed Orders</h3>
                        <p className="text-3xl font-bold">1</p>
                    </div>

                    {/* <div className="flex flex-col gap-4">
                        <button className="bg-pink-400 text-white text-xl py-4 mx-10 rounded-3xl hover:bg-pink-600 transition-colors">
                            + Add Balance
                        </button>
                        <button className="bg-pink-400 text-white text-xl py-4 mx-10 rounded-3xl hover:bg-pink-600 transition-colors">
                            Withdraw
                        </button>
                    </div> */}
                </div>
                
                <div className="grid mt-10">
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
                        <h2 className="text-3xl text-left text-pink-400 font-bold mb-2">Orders</h2>
                        <p className="text-base text-left text-gray-400 mb-8">Review and track your orders here</p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-pink-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Details</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Chat</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.orderId}</td>
                                            <td className="px-6 py-4 text-left text-base">{order.details.join(", ")}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">${order.price}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.payment}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.date}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <span className={`px-2 py-1 text-base rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <button 
                                                    onClick={() => openChatModal(order)}
                                                    className="text-pink-500 hover:text-pink-700 hover:bg-pink-100 p-2 rounded-full transition-colors"
                                                >
                                                    <MessageOutlined className='text-2xl' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            {isChatModalOpen && <ChatModal />}
        </div>
    );
};

export default WalletPage;