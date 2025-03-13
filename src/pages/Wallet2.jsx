import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { jwtDecode } from "jwt-decode";
import { message, Modal, Divider, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
    const [wallet, setWallet] = useState(null);
    const [checkwallet, setCheckWallet] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
    const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);
    const [withdrawResponseId, setWithdrawResponseId] = useState('');
    const [bankAccountName, setBankAccountName] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [reason, setReason] = useState('');
    const [otp, setOtp] = useState('');
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const navigate = useNavigate();
    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    message.error('Please login to view orders');
                    navigate('/login');
                    return;
                }

                // Decode token to get customer ID
                const decodedToken = jwtDecode(token);
                const customerId = decodedToken.Id;
                const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Wallet/GetWalletByCustomerId?CustomerId=${customerId}`);
                const data = await response.json();

                if (data.statusCode === 200) {
                    setWallet(data.data);
                } else {
                    console.error("Failed to fetch wallet:", data.message);
                    message.error(data.message || 'Failed to load wallet');
                }
            } catch (error) {
                console.error("Error fetching wallet data:", error);
                message.error('Failed to load wallet');
            }
        };
        fetchWallet();

        const fetchCheckWallet = async () => {
            try {
                const token = sessionStorage.getItem('accessToken');
                if (!token) {
                    message.error('Please login to view orders');
                    navigate('/login');
                    return;
                }

                // Decode token to get customer ID
                const decodedToken = jwtDecode(token);
                const customerId = decodedToken.Id;
                const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Wallet/CheckWallet?CustomerId=${customerId}`);
                const data = await response.json();

                console.log("Check Wallet Response:", data); // Thêm log để kiểm tra phản hồi

                if (data.statusCode === 200) {
                    setCheckWallet(data);


                }
            } catch (error) {
                console.error("Error fetching wallet data:", error);
                message.error('Failed to load wallet');
            }
        };
        fetchCheckWallet()
    }, [token, navigate]);

    useEffect(() => {
        const fetchWithdrawalHistory = async () => {
            try {
                const walletId = wallet?.walletId; // Lấy walletId từ state
                if (!walletId) return;

                const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/WithdrawMoney/GetWithDrawMoneyWithWalletId?WalletId=${walletId}`);
                const data = await response.json();

                if (data.statusCode === 200) {
                    setWithdrawalHistory(data.data); // Lưu dữ liệu vào state
                } else {
                    message.error(data.message || 'Failed to load withdrawal history');
                }
            } catch (error) {
                console.error("Error fetching withdrawal history:", error);
                message.error('Failed to load withdrawal history');
            }
        };

        if (wallet) {
            fetchWithdrawalHistory(); // Gọi hàm khi wallet có dữ liệu
        }
    }, [wallet]);

    const orders = [
        {
            orderId: "#ORD001",
            details: ["Bouquet No.1", "Bouquet No.2", "Bouquet No.3"],
            price: 75,
            date: "2025-02-04",
            status: "Completed"
        },
        {
            orderId: "#ORD002",
            details: ["Bouquet No.4", "Bouquet No.5"],
            price: 50,
            date: "2025-02-03",
            status: "Processing"
        },
    ];

    const transactions = [
        {
            transactionId: "#TRX001",
            type: "Add Balance",
            amount: 500,
            status: "Success",
            date: "2025-02-04"
        },
        {
            transactionId: "#TRX002",
            type: "Withdraw",
            amount: 200,
            status: "Pending",
            date: "2025-02-03"
        },
        {
            transactionId: "#TRX003",
            type: "Payment",
            amount: -150,
            status: "Failed",
            date: "2025-02-02"
        }
    ];

    const getStatusColor = (status) => {
        const colors = {
            Success: "text-green-600 bg-green-100",
            Pending: "text-yellow-600 bg-yellow-100",
            Failed: "text-red-600 bg-red-100",
            Completed: "text-green-600 bg-green-100",
            'request successful': "text-green-600 bg-green-100",

            Processing: "text-blue-600 bg-blue-100"
        };
        return colors[status] || "text-gray-600 bg-gray-100";
    };

    const handleCreateWallet = async () => {
        if (password !== confirmPassword) {
            message.error("Passwords do not match");
            return;
        }

        const customerId = jwtDecode(sessionStorage.getItem('accessToken')).Id;

        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Wallet/CreateWallet?CusomterId=${customerId}&PasswordWallet=${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                message.success("Wallet created successfully!");
                setIsModalVisible(false);
                // Optionally, refresh wallet data here
            } else {
                message.error(data.message || 'Failed to create wallet');
            }
        } catch (error) {
            console.error("Error creating wallet:", error);
            message.error('Failed to create wallet');
        }
    };

    const handleDeposit = async () => {
        const amount = parseInt(withdrawAmount, 10);
        if (isNaN(amount) || amount < 50000) {
            message.error("You must enter an amount greater than or equal to 50,000 VND");
            return;
        }

        const walletId = wallet.walletId; // Lấy walletId từ state

        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/VnPay/Deposit-vnpay-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletId: walletId,
                    price: amount,
                }),
            });

            const data = await response.json();

            if (data.paymentUrl) {
                // Redirect to payment URL
                window.location.href = data.paymentUrl;
            } else {
                message.error(data.message || 'Failed to initiate deposit');
            }
        } catch (error) {
            console.error("Error during deposit:", error);
            message.error('Failed to process deposit');
        }
    };

    const handleWithdraw = async () => {
        const amount = parseInt(withdrawAmount, 10);
        if (isNaN(amount) || amount < 50000) {
            message.error("You must enter an amount greater than or equal to 50,000 VND");
            return;
        }

        const walletId = wallet.walletId; // Lấy walletId từ state

        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/WithdrawMoney/CreateWithDrawMoney?WalletId=${walletId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    price: amount,
                    bankAccountName: bankAccountName,
                    bankName: bankName,
                    bankNumber: bankNumber,
                    reason: reason,
                    passwordWallet: password, // Mật khẩu ví
                }),
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                setWithdrawResponseId(data.data); // Lưu ID để xác nhận OTP
                message.success("Withdrawal request created. Please enter the OTP.");
                // Hiển thị dialog để nhập OTP
            } else {
                message.error(data.message || 'Failed to initiate withdrawal');
            }
        } catch (error) {
            console.error("Error during withdrawal:", error);
            message.error('Failed to process withdrawal');
        }
    };

    const handleConfirmOtp = async () => {
        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/WithdrawMoney/ConfirmOPT?WithdrawMoneyId=${withdrawResponseId}&otp=${otp}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                message.success("Withdrawal confirmed successfully!");
                // Cập nhật lại thông tin ví hoặc thực hiện các hành động khác nếu cần
            } else {
                message.error(data.message || 'Failed to confirm OTP');
            }
        } catch (error) {
            console.error("Error confirming OTP:", error);
            message.error('Failed to confirm OTP');
        }
    };

    const handleRemove = async (withdrawMoneyId) => {
        try {
            const response = await fetch(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/WithdrawMoney/DeleteWithdrawMoney?WithdrawMoneyId=${withdrawMoneyId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (data.statusCode === 200) {
                message.success("Request successful!"); // Hiển thị thông báo thành công
                // Cập nhật lại danh sách rút tiền
                setWithdrawalHistory(prevHistory => prevHistory.filter(item => item.withdrawMoneyId !== withdrawMoneyId));
            } else {
                message.error(data.message || 'Failed to remove withdrawal');
            }
        } catch (error) {
            console.error("Error removing withdrawal:", error);
            message.error('Failed to remove withdrawal');
        }
    };

    return (
        <div className="w-full">
            <Header />
            <div className="p-14 min-h-screen">
                {checkwallet && checkwallet.data ? (
                    <>
                        <div className="bg-pink-400 rounded-lg w-full px-20 py-20 text-white shadow-lg relative overflow-hidden text-center">
                            <h3 className="text-xl font-medium mb-2">Total Money</h3>
                            <p className="text-3xl font-bold mb-6">
                                {wallet ? `${wallet.totalPrice.toLocaleString()} VND` : 'Loading...'}
                            </p>
                            <div className="flex justify-center gap-6">
                                <button
                                    onClick={() => setIsDepositModalVisible(true)}
                                    className="bg-white text-pink-500 font-bold px-6 py-3 rounded-full shadow-md hover:bg-pink-300 hover:text-white transition">
                                    + Nạp Tiền
                                </button>
                                <button
                                    onClick={() => setIsWithdrawModalVisible(true)}
                                    className="bg-white text-pink-500 font-bold px-6 py-3 rounded-full shadow-md hover:bg-pink-300 hover:text-white transition">
                                    - Rút Tiền
                                </button>
                            </div>
                        </div>

                        <div className="grid mt-10">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                                <h2 className="text-3xl text-left text-pink-400 font-bold mb-5">Deposit history</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-pink-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Order ID</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Details</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Price</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {orders.map((order) => (
                                                <tr key={order.orderId}>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.orderId}</td>
                                                    <td className="px-6 py-4 text-left text-base">{order.details.join(", ")}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">${order.price}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{order.date}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-base rounded-full ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-3xl text-left text-pink-400 font-bold mb-5">Withdrawal history</h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead className="bg-pink-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Withdraw ID</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Bank Account Name</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Bank Name</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Bank Number</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Reason</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Status</th>
                                                <th className="px-6 py-3 text-left text-lg font-medium text-gray-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {withdrawalHistory.map((withdrawal) => (
                                                <tr key={withdrawal.withdrawMoneyId}>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.withdrawMoneyId}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.price} VND</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.bankAccountName}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.bankName}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.bankNumber}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap text-base">{withdrawal.reason}</td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-base rounded-full ${getStatusColor(withdrawal.status)}`}>
                                                            {withdrawal.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                                        <button
                                                            onClick={() => handleRemove(withdrawal.withdrawMoneyId)}
                                                            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold text-pink-500 mb-4">Wallet Not Set Up</h2>
                        <button
                            onClick={() => setIsModalVisible(true)}
                            className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-pink-600 transition">
                            Set up Wallet
                        </button>
                    </div>
                )}
            </div>
            <Footer />
            <Modal
                title="Set Up Wallet"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <div>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <button
                        onClick={handleCreateWallet}
                        className="bg-pink-500 text-white px-4 py-2 rounded"
                    >
                        Create Wallet
                    </button>
                </div>
            </Modal>

            {/* Modal for Withdraw */}
            <Modal
                title="Withdraw Money"
                visible={isWithdrawModalVisible}
                onCancel={() => setIsWithdrawModalVisible(false)}
                footer={null}
            >
                <div>
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Bank Account Name"
                        value={bankAccountName}
                        onChange={(e) => setBankAccountName(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Bank Name"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Bank Number"
                        value={bankNumber}
                        onChange={(e) => setBankNumber(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="text"
                        placeholder="Reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <input
                        type="password"
                        placeholder="Wallet Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <button
                        onClick={handleWithdraw}
                        className="bg-pink-500 text-white px-4 py-2 rounded"
                    >
                        Withdraw
                    </button>
                </div>
            </Modal>

            {/* Modal for OTP Confirmation */}
            <Modal
                title="Confirm OTP"
                visible={!!withdrawResponseId} // Hiển thị nếu có ID phản hồi
                onCancel={() => setWithdrawResponseId('')}
                footer={null}
            >
                <div>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <button
                        onClick={handleConfirmOtp}
                        className="bg-pink-500 text-white px-4 py-2 rounded"
                    >
                        Confirm OTP
                    </button>
                </div>
            </Modal>

            {/* Modal for Withdraw */}
            <Modal
                title="Deposit Money"
                visible={isDepositModalVisible}
                onCancel={() => setIsDepositModalVisible(false)}
                footer={null}
            >
                <div>
                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="border rounded p-2 w-full mb-4"
                    />
                    <button
                        onClick={handleDeposit}
                        className="bg-pink-500 text-white px-4 py-2 rounded"
                    >
                        Deposit
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default WalletPage;
