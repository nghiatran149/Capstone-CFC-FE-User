import React, { useState, useEffect, useRef } from 'react';
import { MessageOutlined, EyeOutlined, CreditCardOutlined, DeleteOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import { message, Modal, Divider, Tag } from 'antd';
import { } from 'antd';
import axios from 'axios';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, XCircle, MessageSquareText, MessageCircle } from "lucide-react";

const WalletPage = () => {
    const [activeTab, setActiveTab] = useState('orders');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All');
    const navigate = useNavigate();
    const [designs, setDesigns] = useState([]);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

    useEffect(() => {
        fetchDesigns();
    }, []);

    const fetchDesigns = async () => {
        try {
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                message.error('Please login to view designs');
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const customerId = decodedToken.Id;

            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/DesignCustom/GetDesignCustomByCustomer?customer=${customerId}`);
            const data = await response.json();

            if (data.statusCode === 200) {
                setDesigns(data.data); // Lưu trữ dữ liệu thiết kế
            } else {
                message.error('Failed to load designs');
            }
        } catch (error) {
            console.error("Error fetching designs:", error);
            message.error('Failed to load designs');
        }
    };

    const fetchDesignDetail = async (designId) => {
        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/DesignCustom/GetDesignCustomById?id=${designId}`);
            const data = await response.json();

            console.log("Design Detail Data:", data); // Log dữ liệu nhận được

            if (data.statusCode === 200) {
                setSelectedDesign(data.data);
                setIsDetailModalVisible(true);
            } else {
                message.error('Failed to load design details');
            }
        } catch (error) {
            console.error("Error fetching design details:", error);
            message.error('Failed to load design details');
        }
    };

    const handleViewDetail = (designId) => {
        fetchDesignDetail(designId);
    };

    const closeDetailModal = () => {
        console.log("Closing detail modal"); // Log khi đóng modal
        setIsDetailModalVisible(false);
        setSelectedDesign(null);
    };

    const getStatusColor = (status) => {
        const colors = {
            "Design Successfully": "text-green-600 bg-green-100",
            "Send Request": "text-pink-600 bg-pink-100",
            "Send Response": "text-yellow-600 bg-yellow-100",
            "Design Failure": "text-red-600 bg-red-100",
        };
        return colors[status] || "text-gray-600 bg-gray-100";
    };
    const openChatModal = (order) => {
        setSelectedOrder(order);
        setIsChatModalOpen(true);
    };

    const viewDetail = (order) => {
        setSelectedOrder(order);
        setIsChatModalOpen(true);
    };

    const closeChatModal = () => {
        setIsChatModalOpen(false);
        setSelectedOrder(null);
    };

    const ChatModal = () => {
        const [messages, setMessages] = useState([]);
        const [newMessage, setNewMessage] = useState('');
        const [connection, setConnection] = useState(null);
        const [connectionState, setConnectionState] = useState('disconnected');
        const [chatRoomId, setChatRoomId] = useState(null);
        const messagesEndRef = useRef(null);

        // Add state for image handling
        const [selectedImage, setSelectedImage] = useState(null);
        const [isUploading, setIsUploading] = useState(false);
        const [showImageModal, setShowImageModal] = useState(false);
        const [modalImage, setModalImage] = useState('');
        const fileInputRef = useRef(null);

        // Existing IDs
        const orderId = selectedOrder.orderId;
        const customerId = selectedOrder.customerId;
        const employeeId = selectedOrder.staffId;

        // SignalR connection setup (unchanged)
        useEffect(() => {
            let newConnection = null;

            const createConnection = () => {
                newConnection = new HubConnectionBuilder()
                    .withUrl('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/chatHub', {
                        skipNegotiation: true, // ⚡ Chỉ dùng WebSockets
                        transport: HttpTransportType.WebSockets,
                    })
                    .withAutomaticReconnect()
                    .build();

                // Add event handlers
                newConnection.onclose(() => {
                    console.log('SignalR connection closed.');
                    setConnectionState('disconnected');
                });

                newConnection.onreconnecting(() => {
                    console.log('SignalR reconnecting...');
                    setConnectionState('reconnecting');
                });

                newConnection.onreconnected(() => {
                    console.log('SignalR reconnected. Rejoining chat room...');
                    setConnectionState('connected');
                    if (chatRoomId) {
                        newConnection.invoke("JoinChatRoom", chatRoomId).catch(console.error);
                    }
                });

                setConnection(newConnection);
            };

            createConnection();

            return () => {
                if (newConnection) {
                    newConnection.stop().catch(console.error);
                }
            };
        }, []);


        // Start connection and listen for messages (unchanged)
        useEffect(() => {
            if (!connection) return;

            const startConnection = async () => {
                if (connectionState !== 'disconnected') {
                    console.log(`Connection is already in state: ${connectionState}`);
                    return;
                }

                try {
                    setConnectionState('connecting');
                    await connection.start();
                    console.log('SignalR Connected!');
                    setConnectionState('connected');

                    // If we already have a chatRoomId, join it
                    if (chatRoomId) {
                        await connection.invoke("JoinChatRoom", chatRoomId);
                    }
                } catch (error) {
                    console.error('SignalR Connection Error:', error);
                    setConnectionState('disconnected');
                    // Try again after a delay
                    setTimeout(startConnection, 5000);
                }
            };

            // Only setup message listener once
            connection.off('ReceiveMessage'); // Remove any existing listeners
            connection.on('ReceiveMessage', (message) => {
                console.log("Received message:", message);
                setMessages(prevMessages => [...prevMessages, message]);
            });

            // Start connection if disconnected
            if (connectionState === 'disconnected') {
                startConnection();
            }
        }, [connection, connectionState, chatRoomId]);

        // Join chat room when we have both a connected connection and a room ID
        useEffect(() => {
            const joinChatRoom = async () => {
                if (connection && connectionState === 'connected' && chatRoomId) {
                    try {
                        console.log(`Joining chat room: ${chatRoomId}`);
                        await connection.invoke("JoinChatRoom", chatRoomId);
                    } catch (error) {
                        console.error('Error joining chat room:', error);
                    }
                }
            };

            joinChatRoom();

            // Clean up when component unmounts or chatRoomId changes
            return () => {
                if (connection && connectionState === 'connected' && chatRoomId) {
                    connection.invoke("LeaveChatRoom", chatRoomId).catch(console.error);
                }
            };
        }, [connection, connectionState, chatRoomId]);


        // Fetch messages from API (unchanged)
        useEffect(() => {
            if (isChatModalOpen && orderId) {
                const fetchMessages = async () => {
                    try {
                        const response = await axios.get(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/messages/messages/${designs.orderId}/${customerId}/${employeeId}`);
                        setMessages(response.data.data);

                        // Get chatRoomId from first message if available
                        if (response.data.data && response.data.data.length > 0) {
                            const roomId = response.data.data[0].chatRoomId;
                            setChatRoomId(roomId);


                        }
                    } catch (error) {
                        console.error('Error fetching messages:', error);
                    }
                };

                fetchMessages();
            }
        }, [isChatModalOpen, orderId, customerId, employeeId]);
        // Auto-scroll to newest message (unchanged)
        useEffect(() => {
            if (messagesEndRef.current) {
                messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, [messages]);

        // New: Handle image selection
        const handleImageSelect = (e) => {
            // When a file is selected through the input, set it to state
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                setSelectedImage(file);
            }
        };

        // New: Remove selected image
        const handleRemoveImage = () => {
            // Clear the selected image from state
            setSelectedImage(null);
            // Also reset the file input element
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        };

        // New: Upload image to Cloudinary
        const uploadImage = async (file) => {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'delivery_app'); // Replace with your upload preset

            try {
                // Send file to Cloudinary API
                const response = await axios.post(
                    `https://api.cloudinary.com/v1_1/dvkqdbaue/image/upload`,
                    formData
                );
                setIsUploading(false);
                // Return the image URL from Cloudinary
                return response.data.secure_url;
            } catch (error) {
                console.error('Error uploading image:', error);
                setIsUploading(false);
                return null;
            }
        };

        // Modified: Send message to include image handling
        const sendMessage = async () => {
            // Only send if we have a chat room and either a message or image
            if (!chatRoomId || (!newMessage.trim() && !selectedImage)) return;

            try {
                let messageContent = newMessage;
                let messageType = 'text';
                let imageUrl = null;

                // If image selected, upload it first
                if (selectedImage) {
                    setIsUploading(true);
                    imageUrl = await uploadImage(selectedImage);
                    if (!imageUrl) {
                        alert('Failed to upload image');
                        setIsUploading(false);
                        return;
                    }
                    // Store image URL in messageType field
                    messageType = imageUrl;
                }

                const messageData = {
                    chatRoomId: chatRoomId,
                    senderId: customerId,
                    receiveId: employeeId,
                    messageType: messageType, // 'text' or image URL
                    content: messageContent // Text message
                };

                // Send message via API
                await axios.post('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/messages/create-message', messageData);

                // Reset input and image selection
                setNewMessage('');
                setSelectedImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsUploading(false);
            }
        };

        // New: Show full-size image in modal
        const openImageModal = (imageUrl) => {
            setModalImage(imageUrl);
            setShowImageModal(true);
        };


    };

    const deleteDesign = async (designId) => {
        try {
            const response = await axios.delete(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/DesignCustom/DeleteDesignCustom?id=${designId}`);
            if (response.data.statusCode === 200) {
                message.success('Design deleted successfully!');
                fetchDesigns(); // Refresh the designs list after deletion
            } else {
                message.error('Failed to delete design');
            }
        } catch (error) {
            console.error('Error deleting design:', error);
            message.error('Failed to delete design');
        }
    };

    const renderActionButtons = (design) => {
        return (
            <div className="flex space-x-3">
                {/* Nút Xem Chi Tiết - Gradient Xanh Dương */}
                <button
                    onClick={() => handleViewDetail(design.designCustomId)}
                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white rounded-lg shadow-lg transition-all duration-300 gap-2"
                >
                    <Eye className="w-5 h-5 text-white" />
                    <span>View</span>
                </button>

                {/* Nút Hủy Đơn - Gradient Đỏ-Cam */}
                <button
                    onClick={() => deleteDesign(design.designCustomId)}
                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white rounded-lg shadow-lg transition-all duration-300 gap-2"
                >
                    <XCircle className="w-5 h-5 text-white" />
                    <span>Cancel</span>
                </button>
                {(design.status === "Received" || design.status === "Request refund") && (
                    <button
                        onClick={() => handleFeedback(design.orderId)}
                        className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white rounded-lg shadow-lg transition-all duration-300 gap-2"
                    >
                        <MessageSquareText className="w-5 h-5 text-white" />
                        <span>Feedback</span>
                    </button>
                )}
                {/* Nút Chat - Hồng Neon */}
                {(design.status != "Order Successfully") && (

                    <button
                        onClick={() => {
                            setSelectedOrder(design);
                            setIsChatModalOpen(true);
                        }}
                        className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full transition-all duration-300 shadow-lg"
                    >
                        <MessageCircle className="w-6 h-6 text-white" />
                    </button>
                )}

            </div>

        );
    };

    return (
        <div className="w-full bg-pink-50">
            <Header />

            <div className="p-14 min-h-screen">


                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-3 px-6 font-medium text-lg transition-all border-b-2 mr-4 ${activeTab === 'orders'
                                ? 'border-pink-500 text-pink-500'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Orders
                        </button>

                    </div>
                </div>

                {/* Active Orders Tab Content */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-lg shadow-lg p-6 mb-10">
                        <div className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-3xl text-left text-pink-400 font-bold mb-2">Desgin Custom</h2>
                                <p className="text-base text-left text-gray-400">Review and track your desgin custom here</p>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setSelectedStatus('All')}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedStatus === 'All'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>

                                <button
                                    onClick={() => setSelectedStatus('Send Request')}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedStatus === 'Send Request'
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    Send Request
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('Send Response')}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedStatus === 'Send Response'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    Send Response
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('Design Successfully')}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedStatus === 'Design Successfully'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    Design Successfully
                                </button>
                                <button
                                    onClick={() => setSelectedStatus('Design Failure')}
                                    className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${selectedStatus === 'Design Failure'
                                        ? 'bg-red-500 text-white'
                                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                                        }`}
                                >
                                    <span className="w-2 h-2 rounded-full bg-current"></span>
                                    Design Failure
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto mt-6">
                            <table className="min-w-full">
                                <thead className="bg-pink-50">
                                    <tr>
                                        {/* <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Order ID</th> */}
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request Image</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request Description</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request Price</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request Occasion</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request MainColor</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request FlowerType</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Request Card</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {designs.map((design) => (
                                        <tr key={design.designCustomId}>
                                            {/* <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.orderId}</td> */}
                                            <td className="px-6 py-4 text-left">
                                                <div className="w-20 h-20 rounded-lg overflow-hidden">
                                                    {design.requestImage ? (
                                                        // Ảnh cho custom product
                                                        <img
                                                            src={design.requestImage}
                                                            alt="Custom Product"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://via.placeholder.com/150';
                                                            }}
                                                        />
                                                    )
                                                        : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                                                No Image
                                                            </div>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestDescription}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestPrice}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestOccasion}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestMainColor}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestFlowerType}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{design.requestCard}</td>

                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <span className={`px-2 py-1 text-base rounded-full ${getStatusColor(design.status)}`}>
                                                    {design.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                {renderActionButtons(design)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Refund Orders Tab Content */}



            </div>

            <Footer />
            {isChatModalOpen && <ChatModal />}

            <Modal
                title="Design Details"
                visible={isDetailModalVisible}
                onCancel={closeDetailModal}
                footer={null}
                className="rounded-lg"
            >
                {selectedDesign && (
                    <div className="flex flex-col md:flex-row space-x-4 p-4 bg-gray-50 rounded-lg shadow-lg">
                        {/* Bên trái */}
                        <div className="w-full md:w-1/2 space-y-4 p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-pink-600">Request</h3>
                            <div>
                                <p className="font-semibold">Design ID:</p>
                                <p className="text-gray-600">{selectedDesign.designCustomId}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Image:</p>
                                <img src={selectedDesign.requestImage} alt="Design" className="w-full h-auto rounded-lg shadow" />
                            </div>
                            <div>
                                <p className="font-semibold">Description:</p>
                                <p className="text-gray-600">{selectedDesign.requestDescription}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Price:</p>
                                <p className="text-gray-600">{selectedDesign.requestPrice}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Occasion:</p>
                                <p className="text-gray-600">{selectedDesign.requestOccasion}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Main Color:</p>
                                <p className="text-gray-600">{selectedDesign.requestMainColor}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Flower Type:</p>
                                <p className="text-gray-600">{selectedDesign.requestFlowerType}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Card:</p>
                                <p className="text-gray-600">{selectedDesign.requestCard}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p className="text-gray-600">{selectedDesign.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Created At:</p>
                                <p className="text-gray-600">{new Date(selectedDesign.createAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Recipient Name:</p>
                                <p className="text-gray-600">{selectedDesign.recipientName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Phone:</p>
                                <p className="text-gray-600">{selectedDesign.phone}</p>
                            </div>
                        </div>

                        {/* Bên phải */}
                        <div className="w-full md:w-1/2 space-y-4 p-4 bg-white rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-pink-600">Response</h3>
                            <div>
                                <p className="font-semibold">Response Price:</p>
                                <p className="text-gray-600">{selectedDesign.responsePrice}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Response Image:</p>
                                <img src={selectedDesign.responseImage} alt="Design" className="w-full h-auto rounded-lg shadow" />
                            </div>
                            <div>
                                <p className="font-semibold">Response Description:</p>
                                <p className="text-gray-600">{selectedDesign.responseDescription}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default WalletPage;