import React, { useState, useEffect } from 'react';
import { MessageOutlined, EyeOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import { message, Modal, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        processing: 0,
        failed: 0
    });
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Get token from sessionStorage like in ShoppingCart
            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                message.error('Please login to view orders');
                navigate('/login');
                return;
            }

            // Decode token to get customer ID
            const decodedToken = jwtDecode(token);
            const customerId = decodedToken.Id;  // Using Id from token like in ShoppingCart

            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByCustomer?CusomterId=${customerId}`);
            const data = await response.json();

            if (data.statusCode === 200) {
                const formattedOrders = data.data.map(order => ({
                    orderId: order.orderId,
                    details: order.productCustomResponse ?
                        [order.productCustomResponse.productName] :
                        order.orderDetails.map(detail => detail.productName),
                    price: order.orderPrice,
                    payment: order.transfer ? "100% payment" : "50% deposit",
                    createAt: new Date(order.createAt).toLocaleString(),
                    date: new Date(order.deliveryDateTime).toLocaleString(),
                    status: order.status,
                    note: order.note,
                    phone: order.phone
                }));

                setOrders(formattedOrders);

                // Calculate statistics
                setStats({
                    total: formattedOrders.length,
                    completed: formattedOrders.filter(o => o.status === "đặt hàng thành công").length,
                    processing: formattedOrders.filter(o => o.status === "đang xử lý").length,
                    failed: formattedOrders.filter(o => o.status === "thất bại").length
                });
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            message.error('Failed to load orders');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            "đặt hàng thành công": "text-green-600 bg-green-100", // Xanh lá cây để thể hiện thành công
            "đang xử lý": "text-blue-600 bg-blue-100", // Màu xanh dương để thể hiện đang xử lý
            "thất bại": "text-red-600 bg-red-100" // Màu đỏ để thể hiện thất bại
        };
        return colors[status] || "text-gray-600 bg-gray-100"; // Màu xám mặc định nếu không khớp trạng thái
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

    const fetchOrderDetail = async (orderId) => {
        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/GetOrderByOrderId?OrderId=${orderId}`);
            const data = await response.json();
            
            if (data.statusCode === 200) {
                setSelectedOrderDetail(data.data);
                setDetailModalVisible(true);
            }
        } catch (error) {
            console.error("Error fetching order detail:", error);
            message.error('Failed to load order details');
        }
    };

    const OrderDetailModal = () => {
        if (!selectedOrderDetail) return null;

        const renderCustomProductDetails = () => (
            <div className="space-y-6">
                <div className="bg-pink-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-pink-600 mb-4">Custom Product Information</h3>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="font-semibold">Product Name:</p>
                            <p className="text-gray-700">{selectedOrderDetail.productCustomResponse.productName}</p>
                        </div>
                        <div>
                            <p className="font-semibold">Total Price:</p>
                            <p className="text-pink-600 font-bold">{selectedOrderDetail.productCustomResponse.totalPrice.toLocaleString()} VNĐ</p>
                        </div>
                    </div>
                </div>

                {/* Flower Basket Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-bold text-pink-600 mb-4">Flower Basket Details</h4>
                    <div className="flex gap-6">
                        <img 
                            src={selectedOrderDetail.productCustomResponse.flowerBasketResponse.image}
                            alt="Flower Basket"
                            className="w-48 h-48 object-cover rounded-lg shadow-lg"
                        />
                        <div className="flex-1 space-y-2">
                            <h5 className="text-xl font-semibold">{selectedOrderDetail.productCustomResponse.flowerBasketResponse.flowerBasketName}</h5>
                            <p><span className="font-semibold">Category:</span> {selectedOrderDetail.productCustomResponse.flowerBasketResponse.categoryName}</p>
                            <p><span className="font-semibold">Price:</span> {selectedOrderDetail.productCustomResponse.flowerBasketResponse.price.toLocaleString()} VNĐ</p>
                            <p><span className="font-semibold">Description:</span> {selectedOrderDetail.productCustomResponse.flowerBasketResponse.decription}</p>
                            <div className="flex gap-4">
                                <p><span className="font-semibold">Min Quantity:</span> {selectedOrderDetail.productCustomResponse.flowerBasketResponse.minQuantity}</p>
                                <p><span className="font-semibold">Max Quantity:</span> {selectedOrderDetail.productCustomResponse.flowerBasketResponse.maxQuantity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Style Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-bold text-pink-600 mb-4">Style Details</h4>
                    <div className="flex gap-6">
                        <img 
                            src={selectedOrderDetail.productCustomResponse.styleResponse.image}
                            alt="Style"
                            className="w-48 h-48 object-cover rounded-lg shadow-lg"
                        />
                        <div className="flex-1 space-y-2">
                            <h5 className="text-xl font-semibold">{selectedOrderDetail.productCustomResponse.styleResponse.name}</h5>
                            <p><span className="font-semibold">Category:</span> {selectedOrderDetail.productCustomResponse.styleResponse.categoryName}</p>
                            <p><span className="font-semibold">Note:</span> {selectedOrderDetail.productCustomResponse.styleResponse.note}</p>
                            <p><span className="font-semibold">Description:</span> {selectedOrderDetail.productCustomResponse.styleResponse.description}</p>
                        </div>
                    </div>
                </div>

                {/* Accessory Section */}
                {selectedOrderDetail.productCustomResponse.accessoryResponse && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h4 className="text-lg font-bold text-pink-600 mb-4">Accessory Details</h4>
                        <div className="flex gap-6">
                            <img 
                                src={selectedOrderDetail.productCustomResponse.accessoryResponse.image}
                                alt="Accessory"
                                className="w-48 h-48 object-cover rounded-lg shadow-lg"
                            />
                            <div className="flex-1 space-y-2">
                                <h5 className="text-xl font-semibold">{selectedOrderDetail.productCustomResponse.accessoryResponse.name}</h5>
                                <p><span className="font-semibold">Price:</span> {selectedOrderDetail.productCustomResponse.accessoryResponse.price.toLocaleString()} VNĐ</p>
                                <p><span className="font-semibold">Note:</span> {selectedOrderDetail.productCustomResponse.accessoryResponse.note}</p>
                                <p><span className="font-semibold">Description:</span> {selectedOrderDetail.productCustomResponse.accessoryResponse.description}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flowers List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h4 className="text-lg font-bold text-pink-600 mb-4">Selected Flowers</h4>
                    <div className="grid grid-cols-1 gap-4">
                        {selectedOrderDetail.productCustomResponse.flowerCustomResponses.map((flower, index) => (
                            <div key={index} className="flex items-center gap-6 p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <img 
                                    src={flower.flowerResponse.image}
                                    alt={flower.flowerResponse.flowerName}
                                    className="w-32 h-32 object-cover rounded-lg shadow"
                                />
                                <div className="flex-1 space-y-2">
                                    <h6 className="text-lg font-semibold">{flower.flowerResponse.flowerName}</h6>
                                    <div className="grid grid-cols-2 gap-4">
                                        <p><span className="font-semibold">Color:</span> {flower.flowerResponse.color}</p>
                                        <p><span className="font-semibold">Category:</span> {flower.flowerResponse.categoryName}</p>
                                        <p><span className="font-semibold">Quantity:</span> {flower.quantity}</p>
                                        <p><span className="font-semibold">Price:</span> {flower.totalPrice.toLocaleString()} VNĐ</p>
                                    </div>
                                    <p><span className="font-semibold">Description:</span> {flower.flowerResponse.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        const renderNormalOrderDetails = () => (
            <div className="space-y-4">
                {selectedOrderDetail.orderDetails.map((detail, index) => (
                    <div key={index} className="flex items-center gap-4 border-b pb-4">
                        <img 
                            src={detail.productImage}
                            alt={detail.productName}
                            className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div>
                            <p className="font-semibold text-lg">{detail.productName}</p>
                            <p>Price: {detail.price.toLocaleString()} VNĐ</p>
                            <p>Quantity: {detail.quantity}</p>
                            <p>Discount: {detail.discount}%</p>
                            <p>Total: {detail.productTotalPrice.toLocaleString()} VNĐ</p>
                        </div>
                    </div>
                ))}
            </div>
        );

        return (
            <Modal
                title={
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-pink-600">Order Details</h2>
                            <p className="text-gray-500 text-sm">Order ID: {selectedOrderDetail.orderId}</p>
                        </div>
                        <Tag color={selectedOrderDetail.status === "đặt hàng thành công" ? "green" : 
                               selectedOrderDetail.status === "đang xử lý" ? "blue" : "red"}>
                            {selectedOrderDetail.status}
                        </Tag>
                    </div>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                width={1000}
                footer={null}
                className="max-h-[90vh] overflow-auto"
            >
                <div className="space-y-6">
                    {/* Order Information */}
                    <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-700">Order Information</h3>
                            <p><span className="font-semibold">Created:</span> {new Date(selectedOrderDetail.createAt).toLocaleString()}</p>
                            <p><span className="font-semibold">Delivery Date:</span> {new Date(selectedOrderDetail.deliveryDateTime).toLocaleString()}</p>
                            <p><span className="font-semibold">Total Price:</span> <span className="text-pink-600 font-bold">{selectedOrderDetail.orderPrice.toLocaleString()} VNĐ</span></p>
                            <p><span className="font-semibold">Payment Method:</span> {selectedOrderDetail.transfer ? '100% Transfer' : '50% Deposit'}</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-700">Contact Information</h3>
                            <p><span className="font-semibold">Store:</span> {selectedOrderDetail.storeName}</p>
                            <p><span className="font-semibold">Store Address:</span> {selectedOrderDetail.storeAddress}</p>
                        </div>
                    </div>

                    {/* Promotion Information */}
                    {selectedOrderDetail.promotionId && (
                        <div className="bg-purple-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg text-purple-600 mb-2">Promotion Applied</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <p><span className="font-semibold">Promotion Name:</span> {selectedOrderDetail.promotionName}</p>
                                <p><span className="font-semibold">Discount:</span> {selectedOrderDetail.promotionDiscount}%</p>
                            </div>
                        </div>
                    )}

                    {/* Note Section */}
                    {selectedOrderDetail.note && (
                        <div className="bg-yellow-50 p-6 rounded-lg">
                            <h3 className="font-bold text-lg text-yellow-700 mb-2">Order Notes</h3>
                            <p className="whitespace-pre-line">{selectedOrderDetail.note}</p>
                        </div>
                    )}

                    <Divider />

                    {/* Products Section */}
                    {selectedOrderDetail.productCustomId ? 
                        renderCustomProductDetails() : 
                        renderNormalOrderDetails()
                    }
                </div>
            </Modal>
        );
    };

    return (
        <div className="w-full">
            <Header />

            <div className="p-14 min-h-screen">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-10">
                    <div className="bg-pink-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-pink-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-green-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Completed Orders</h3>
                        <p className="text-3xl font-bold">{stats.completed}</p>
                    </div>

                    <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Processing Orders</h3>
                        <p className="text-3xl font-bold">{stats.processing}</p>
                    </div>

                    <div className="bg-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-red-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-xl font-medium mb-2">Failed Orders</h3>
                        <p className="text-3xl font-bold">{stats.failed}</p>
                    </div>
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
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Create Time</th>
                                        <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">RecipientTime</th>
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
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.createAt}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.date}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <span className={`px-2 py-1 text-base rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <button
                                                    onClick={() => fetchOrderDetail(order.orderId)}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg shadow-md transition-all duration-300 gap-2"
                                                >
                                                    <EyeOutlined />
                                                    <span>View Details</span>
                                                </button>

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
            {detailModalVisible && <OrderDetailModal />}
        </div>
    );
};

export default WalletPage;