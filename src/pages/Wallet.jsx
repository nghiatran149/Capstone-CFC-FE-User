import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const WalletPage = () => {
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
            Processing: "text-blue-600 bg-blue-100"
        };
        return colors[status] || "text-gray-600 bg-gray-100";
    };

    return (
        <div className="w-full">
            <Header />
            <div className="p-14 min-h-screen">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-10-">
                    <div className="bg-blue-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-medium mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold">2</p>
                    </div>

                    <div className="bg-green-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-medium mb-2">Total Transactions</h3>
                        <p className="text-3xl font-bold">3</p>
                    </div>

                    <div className="bg-purple-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-purple-400 rounded-full transform translate-x-8 -translate-y-8"></div>
                        <h3 className="text-lg font-medium mb-2">Wallet Balance</h3>
                        <p className="text-3xl font-bold">$125</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button className="bg-pink-400 text-white text-xl py-4 mx-10 rounded-3xl hover:bg-pink-600 transition-colors">
                            + Add Balance
                        </button>
                        <button className="bg-pink-400 text-white text-xl py-4 mx-10 rounded-3xl hover:bg-pink-600 transition-colors">
                            Withdraw
                        </button>
                    </div>
                </div>

                <div className="grid mt-10">

                    <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                        <h2 className="text-3xl text-left text-pink-400 font-bold mb-5">Orders</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-pink-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.orderId}>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">{order.orderId}</td>
                                            <td className="px-6 py-4 text-left text-sm">{order.details.join(", ")}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">${order.price}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">{order.date}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
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
                        <h2 className="text-3xl text-left text-pink-400 font-bold mb-5">Transactions</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-pink-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {transactions.map((transaction) => (
                                        <tr key={transaction.transactionId}>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">{transaction.transactionId}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">{transaction.type}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">
                                                <span className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                                                    ${Math.abs(transaction.amount)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap text-sm">{transaction.date}</td>
                                            <td className="px-6 py-4 text-left whitespace-nowrap">
                                                <span className={`px-2 py-1 text-left text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status}
                                                </span>
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
        </div>
    );
};

export default WalletPage;