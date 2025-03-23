import React, { useState } from 'react';
import { MessageOutlined, CloseOutlined } from '@ant-design/icons';

const ChatBox = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        setShowBubble(false);
    };

    const handleSendMessage = async () => {
        if (message.trim()) {
            const newMessage = { text: message, sender: 'customer', timestamp: new Date().toLocaleTimeString() };
            setMessages([...messages, newMessage]);
            setMessage('');

            try {
                const response = await fetch('http://localhost:5243/chat-box', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'accept': 'application/json'
                    },
                    body: JSON.stringify({ prompt: message })
                });

                const data = await response.json();
                const botMessage = {
                    text: data.description, 
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };
    return (
        <>
            <div className="fixed bottom-20 right-6 z-50">
                {/* Chat button */}
                <button
                    onClick={toggleChat}
                    className="w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-700 flex items-center justify-center shadow-lg transition-all duration-300"
                    aria-label="Open chat"
                    onMouseEnter={() => setShowBubble(true)}
                >
                    <MessageOutlined className="text-white text-xl" />
                </button>

                {/* Chat bubble */}
                {showBubble && !isChatOpen && (
                    <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-md px-3 py-2 text-pink-600 font-medium text-sm whitespace-nowrap animate-bounce">
                        Chat now!
                        {/* Bubble pointer */}
                        <div className="absolute w-3 h-3 bg-white transform rotate-45 bottom-[-6px] right-6"></div>
                    </div>
                )}
            </div>

            {isChatOpen && (
                <div className="fixed bottom-36 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-40 overflow-hidden flex flex-col border border-gray-200">
                    {/* Header */}
                    <div className="flex justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
                        <h3 className="font-medium text-gray-800">Chat with us</h3>
                        <button
                            onClick={toggleChat}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Close chat"
                        >
                            <CloseOutlined />
                        </button>
                    </div>

                    {/* Chat messages area */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'} mb-2`}>
                                <div className={`px-4 py-2 rounded-lg ${msg.sender === 'customer' ? 'bg-pink-600 text-white' : 'bg-gray-300 text-gray-800'}`}>
                                    <p>{msg.text}</p>
                                    <small className="text-xs text-white-500">{msg.timestamp}</small>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input area */}
                    <div className="flex p-3 border-t border-gray-200 bg-white">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                        />
                        <button onClick={handleSendMessage} className="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded-r">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBox;