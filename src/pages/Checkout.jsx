import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Input, Button, Form, Checkbox, Select, message, DatePicker, TimePicker } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

const Checkout = () => {
    const [form] = Form.useForm();
    const [shippingMethod, setShippingMethod] = useState('store-pickup');
    const [isAddressDisabled, setIsAddressDisabled] = useState(true);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [promotions, setPromotions] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingStores, setLoadingStores] = useState(true);
    const [selectedDeposit, setSelectedDeposit] = useState(null);
    const [recipientInfo, setRecipientInfo] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = location.state?.cartItems;
    const totalAmount = location.state?.totalAmount;
    const productInfo = location.state?.product;

    useEffect(() => {
        fetchPromotions();
        fetchStores();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/promotions');
            setPromotions(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching promotions:', error);
            setLoading(false);
        }
    };

    const fetchStores = async () => {
        try {
            const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Store/GetAllStore');
            if (response.data && response.data.data) {
                setStores(response.data.data);
            }
            setLoadingStores(false);
        } catch (error) {
            console.error('Error fetching stores:', error);
            setLoadingStores(false);
        }
    };

    // Redirect if no items to checkout
    if (!cartItems && !productInfo) {
        navigate('/');
        return null;
    }

    const handleStoreChange = (value) => {
        setSelectedStore(value);
    };

    const handleShippingChange = (method) => {
        setShippingMethod(method);
        setIsAddressDisabled(method === 'store-pickup');
    };

    const handleVoucherChange = (voucherId) => {
        setSelectedVoucher(voucherId);
    };

    const calculateDiscount = () => {
        if (!selectedVoucher) return 0;
        const promotion = promotions.find(p => p.promotionId === selectedVoucher);
        if (!promotion) return 0;
        
        const subtotal = cartItems ? totalAmount : productInfo.totalPrice;
        return Math.round((subtotal * promotion.promotionDiscount) / 100);
    };

    const handleRecipientInfoChange = (field, value) => {
        setRecipientInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDepositChange = (value) => {
        setSelectedDeposit(value);
    };

    const handleProceedToPayment = async () => {
        try {
            // Validate form first
            await form.validateFields();

            if (!selectedStore) {
                message.error('Please select a store');
                return;
            }

            if (shippingMethod === 'store-pickup') {
                if (!recipientInfo.name || !recipientInfo.phone || !recipientInfo.date || !recipientInfo.time || !selectedDeposit) {
                    message.error('Please fill in all required information');
                    return;
                }
            }

            const token = sessionStorage.getItem('accessToken');
            if (!token) {
                message.error('Please login to proceed');
                navigate('/login');
                return;
            }

            const decodedToken = jwtDecode(token);
            const customerId = decodedToken.Id;

            if (!customerId) {
                message.error('User information not found. Please login again');
                navigate('/login');
                return;
            }

            // Get form values
            const formValues = await form.getFieldsValue();
            const cardMessage = formValues.cardMessage;
            const hideGiverName = formValues.hideGiverName;
            const importantNote = formValues.importantNote;

            // Format note
            const fullNote = `Card Message: ${cardMessage || ''}\nHide Giver's Name: ${hideGiverName ? 'Yes' : 'No'}\nImportant Note: ${importantNote || ''}`;

            // Format date time
            const formattedDateTime = recipientInfo.date && recipientInfo.time
                ? `${dayjs(recipientInfo.date).format('YYYY-MM-DD')}T${dayjs(recipientInfo.time).format('HH:mm:ss')}`
                : null;

            const orderData = {
                promotionId: selectedVoucher || null,
                note: fullNote,
                storeId: selectedStore,
                recipientName: recipientInfo.name,
                recipientTime: formattedDateTime,
                phone: recipientInfo.phone,
                status: "Pending",
                transfer: selectedDeposit === "100", // 100% -> true, 50% -> false
                delivery: shippingMethod !== 'store-pickup',
                orderDetails: cartItems ? 
                    cartItems.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity
                    })) :
                    [{
                        productId: productInfo.productId,
                        quantity: productInfo.selectedQuantity
                    }]
            };

            console.log('Order Data:', orderData);

            // Create order
            const orderResponse = await axios.post(
                `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Order/CreateOrder?CustomerId=${customerId}`,
                orderData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (orderResponse.status === 200) {
                message.success('Order created successfully!');
                
                // Get the orderId from response
                const orderId = orderResponse.data.orderId;

                // Call VNPay API
                const vnpayResponse = await axios.post(
                    'https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/VnPay/proceed-vnpay-payment',
                    orderId,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                if (vnpayResponse.data && vnpayResponse.data.paymentUrl) {
                    // Save orderId to sessionStorage for later use
                    sessionStorage.setItem('lastOrderId', orderId);
                    // Redirect to VNPay payment URL
                    window.location.href = vnpayResponse.data.paymentUrl;
                } else {
                    message.error('Failed to get payment URL');
                }
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error);
            message.error(
                error.response?.data?.errors ? 
                Object.values(error.response.data.errors).flat().join(', ') : 
                'Failed to process. Please try again.'
            );
        }
    };

    const OptionCard = ({ id, title, description, price, icon, selected, onClick, discount }) => (
        <div
            className={`border rounded-lg p-4 cursor-pointer mb-2 hover:border-pink-500 transition-all
                ${selected ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
            onClick={() => onClick(id)}
        >
            <div className="flex items-center">
                <div className="w-12 h-12 mr-4">
                    <img src={icon} alt={title} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">{title}</h4>
                        {price && <span className="text-gray-900 font-medium">{price}</span>}
                        {discount && <span className="text-pink-600 font-medium">-{discount}</span>}
                    </div>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
        </div>
    );

    OptionCard.propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        price: PropTypes.string,
        icon: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        onClick: PropTypes.func.isRequired,
        discount: PropTypes.string
    };

    const disabledTime = () => ({
        disabledHours: () => [...Array(24).keys()].filter(hour => hour < 8 || hour > 19),
    });

    return (
        <div className="w-full">
            <Header />
            <Form form={form} className="w-full">
                <div className="flex ml-20 mt-10">
                    <Button
                        type="primary"
                        icon={<ArrowLeftOutlined />}
                        className="bg-pink-300 text-white text-lg px-6 py-5 rounded-md shadow-md"
                        onClick={() => navigate(-1)}
                    >
                        BACK
                    </Button>
                </div>
                <div className="container mx-auto py-10 px-20">
                    <h1 className="text-center text-6xl font-bold text-pink-600 p-3 rounded">Checkout</h1>
                    <p className="text-xl text-gray-500 mb-10 text-center">Complete Your Purchase</p>

                    <div className="mb-6 border border-gray-300 rounded">
                        <h2 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Order Information</h2>
                        <div className="space-y-4 py-5 px-10">
                            {cartItems ? (
                                // Display multiple items from cart
                                cartItems.map((item) => (
                                    <div key={item.cartId} className="flex items-center border-b border-gray-200 pb-4">
                                        <div className="w-24 h-24 flex-shrink-0">
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="flex flex-1 items-center justify-between ml-6">
                                            <div className="flex flex-col">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.productName}</h3>
                                                <p className="text-sm text-gray-500">Size: {item.size}</p>
                                                <p className="text-sm text-gray-500">Category: {item.categoryName}</p>
                                            </div>
                                            <p className="text-pink-600 font-medium">{item.productPrice.toLocaleString()} VND</p>
                                            <p className="text-gray-600">x{item.quantity}</p>
                                            <p className="text-lg font-semibold text-pink-600">{item.totalPrice.toLocaleString()} VND</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                // Display single item from direct checkout
                                <div className="flex items-center border-b border-gray-200 pb-4">
                                    <div className="w-24 h-24 flex-shrink-0">
                                        <img
                                            src={productInfo.productImages[0]?.productImage1}
                                            alt={productInfo.productName}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="flex flex-1 items-center justify-between ml-6">
                                        <div className="flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-900">{productInfo.productName}</h3>
                                            <p className="text-sm text-gray-500">Size: {productInfo.size}</p>
                                            <p className="text-sm text-gray-500">Category: {productInfo.categoryName}</p>
                                        </div>
                                        <p className="text-pink-600 font-medium">{productInfo.finalPrice.toLocaleString()} VND</p>
                                        <p className="text-gray-600">x{productInfo.selectedQuantity}</p>
                                        <p className="text-lg font-semibold text-pink-600">{productInfo.totalPrice.toLocaleString()} VND</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-5 border border-gray-300 rounded">
                        <h2 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Special Note About Order</h2>
                        <div className="grid grid-cols-2 gap-10 p-4">
                            <div>
                                <h3 className="mb-2 text-left">Card/Banner Message:</h3>
                                <Form.Item name="cardMessage">
                                    <Input.TextArea />
                                </Form.Item>
                                <Form.Item name="hideGiverName" valuePropName="checked">
                                    <Checkbox 
                                        onChange={(e) => {
                                            form.setFieldsValue({
                                                hideGiverName: e.target.checked
                                            });
                                        }}
                                    >
                                        Hide the giver&apos;s name
                                    </Checkbox>
                                </Form.Item>
                            </div>
                            <div>
                                <h3 className="mb-2 text-left">Important Note:</h3>
                                <Form.Item name="importantNote">
                                    <Input.TextArea />
                                </Form.Item>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between mb-6">
                        <div className="w-1/2 pr-10">
                            <div className="mb-5 border border-gray-300 rounded">
                                <h3 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Select Store</h3>
                                <p className="text-base p-3 text-gray-500 text-left">Select a store to process your order</p>
                                <div className="p-2">
                                    <Select
                                        value={selectedStore}
                                        onChange={handleStoreChange}
                                        className="w-full"
                                        placeholder="Select Store"
                                        loading={loadingStores}
                                        optionLabelProp="label"
                                    >
                                        {stores.map(store => (
                                            <Select.Option 
                                                key={store.storeId} 
                                                value={store.storeId}
                                                label={store.storeName}
                                            >
                                                <div className="py-2">
                                                    <div className="font-medium">{store.storeName}</div>
                                                    <div className="text-gray-500 text-sm">
                                                        {store.city}, {store.district}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
                                                        {store.address}
                                                    </div>
                                                </div>
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div className="mb-5 border border-gray-300 rounded">
                                <h3 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Available Vouchers</h3>
                                <p className="text-base p-3 text-gray-500 text-left">Select a voucher to apply</p>
                                <div className="p-4">
                                    {loading ? (
                                        <div className="flex justify-center py-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                                        </div>
                                    ) : promotions.length > 0 ? (
                                        promotions.map((promotion) => (
                                            <OptionCard
                                                key={promotion.promotionId}
                                                id={promotion.promotionId}
                                                title={promotion.promotionName}
                                                description={`Valid until ${new Date(promotion.endDate).toLocaleDateString()}`}
                                                discount={`${promotion.promotionDiscount}%`}
                                                icon={promotion.image}
                                                selected={selectedVoucher === promotion.promotionId}
                                                onClick={handleVoucherChange}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">No promotions available</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-6 border border-gray-300 rounded">
                                <h2 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Order Summary</h2>
                                <div className="p-4">
                                    <p className="mb-2 text-left">Subtotal: {cartItems ? totalAmount.toLocaleString() : productInfo.totalPrice.toLocaleString()} VND</p>
                                    <p className="mb-2 text-left">Discount (Voucher): -{calculateDiscount().toLocaleString()} VND</p>
                                    <p className="mb-2 text-left">Shipping: {shippingMethod === 'store-pickup' ? '0' : '25,000'} VND</p>
                                    <p className="font-bold text-left">Total: {(
                                        (cartItems ? totalAmount : productInfo.totalPrice) - 
                                        calculateDiscount() +
                                        (shippingMethod === 'store-pickup' ? 0 : 25000)
                                    ).toLocaleString()} VND</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-1/2 pl-2">
                            <div className="mb-5 border border-gray-300 rounded">
                                <h3 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Shipping Method</h3>
                                <p className="text-base p-3 text-gray-500 text-left">Choose shipping method</p>
                                <div className="p-4">
                                    <OptionCard
                                        id="store-pickup"
                                        title="Store Pickup"
                                        description="Pick up your order at our store"
                                        price="Free"
                                        icon="https://static.thenounproject.com/png/4160044-200.png"
                                        selected={shippingMethod === 'store-pickup'}
                                        onClick={handleShippingChange}
                                    />
                                    <OptionCard
                                        id="ghtk"
                                        title="Giao Hàng Tiết Kiệm"
                                        description="Delivery by GiaoHangTietKiem"
                                        price="25,000 đ"
                                        icon="https://static.ybox.vn/2023/7/3/1689130943619-GHTK.jpeg"
                                        selected={shippingMethod === 'ghtk'}
                                        onClick={handleShippingChange}
                                    />
                                    <OptionCard
                                        id="shop-shipping"
                                        title="Shop Delivery"
                                        description="We will arrange delivery ourselves."
                                        price="30,000 đ"
                                        icon="https://cdn1.iconfinder.com/data/icons/logistics-transportation-vehicles/202/logistic-shipping-vehicles-002-512.png"
                                        selected={shippingMethod === 'shop-shipping'}
                                        onClick={handleShippingChange}
                                    />
                                </div>
                            </div>

                            {shippingMethod === 'store-pickup' ? (
                                <div className="mb-5 border border-gray-300 rounded">
                                    <h3 className="text-xl font-semibold mb-5 text-left text-black bg-pink-200 p-2 rounded">Add Information</h3>
                                    <Form form={form} className="p-5">
                                        <Form.Item 
                                            label="Recipient Name" 
                                            required
                                            rules={[{ required: true, message: 'Please input recipient name!' }]}
                                        >
                                            <Input 
                                                value={recipientInfo.name}
                                                onChange={(e) => handleRecipientInfoChange('name', e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            label="Recipient Phone" 
                                            required
                                            rules={[{ required: true, message: 'Please input recipient phone!' }]}
                                        >
                                            <Input 
                                                value={recipientInfo.phone}
                                                onChange={(e) => handleRecipientInfoChange('phone', e.target.value)}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            label="Date and Time" 
                                            required
                                            rules={[{ required: true, message: 'Please select date and time!' }]}
                                        >
                                            <div className="flex gap-2">
                                                <DatePicker
                                                    className="flex-1"
                                                    value={recipientInfo.date ? dayjs(recipientInfo.date) : null}
                                                    onChange={(date) => handleRecipientInfoChange('date', date)}
                                                    disabledDate={(current) => {
                                                        return current && current < dayjs().startOf('day');
                                                    }}
                                                />
                                                <TimePicker
                                                    className="flex-1"
                                                    format="HH:mm"
                                                    value={recipientInfo.time ? dayjs(recipientInfo.time, 'HH:mm') : null}
                                                    onChange={(time) => handleRecipientInfoChange('time', time)}
                                                    disabledTime={disabledTime}
                                                    minuteStep={30}
                                                    hideDisabledOptions
                                                />
                                            </div>
                                        </Form.Item>
                                        <Form.Item 
                                            label="Deposit" 
                                            required
                                            rules={[{ required: true, message: 'Please select deposit amount!' }]}
                                        >
                                            <Select
                                                value={selectedDeposit}
                                                onChange={handleDepositChange}
                                                placeholder="Select deposit amount"
                                                className="w-full"
                                            >
                                                <Select.Option value="50">50% deposit</Select.Option>
                                                <Select.Option value="100">100% payment</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Form>
                                </div>
                            ) : (
                                <div className="mb-5 border border-gray-300 rounded">
                                    <h3 className="text-xl font-semibold mb-5 text-left text-black bg-pink-200 p-2 rounded">Shipping Address</h3>
                                    <Form className="p-5">
                                        <Form.Item label="Recipient Name">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="Recipient Phone">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="City">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="District">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="Detailed Address">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="Time">
                                            <Input disabled={isAddressDisabled} />
                                        </Form.Item>
                                        <Form.Item label="Notes">
                                            <Input.TextArea disabled={isAddressDisabled} />
                                        </Form.Item>
                                    </Form>
                                </div>
                            )}
                        </div>
                    </div>

                   <div className="text-center mt-10">
                        <Button 
                            type="primary" 
                            className="bg-pink-400 text-white text-2xl px-10 py-8 rounded-md"
                            onClick={handleProceedToPayment}
                        >
                            Proceed to Payment
                        </Button>
                    </div>
                </div>
            </Form>
            <Footer />
        </div>
    );
};

export default Checkout;