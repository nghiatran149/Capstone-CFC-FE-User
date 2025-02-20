import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { Menu, Input, Button, Form, Checkbox, Select } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";

const Checkout = () => {
    const [shippingMethod, setShippingMethod] = useState('store-pickup');
    const [isAddressDisabled, setIsAddressDisabled] = useState(true);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    const navigate = useNavigate();

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

    const storeMenu = (
        <Menu>
            <Menu.Item key="1">Store 1</Menu.Item>
            <Menu.Item key="2">Store 2</Menu.Item>
            <Menu.Item key="3">Store 3</Menu.Item>
        </Menu>
    );

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

    return (
        <div className="w-full">
            <Header />
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

                        <div className="flex items-center border-b border-gray-200 pb-4">
                            <div className="w-24 h-24 flex-shrink-0">
                                <img
                                    src="https://storage.googleapis.com/cdn_dlhf_vn/public/products/APF0/APF06AK217/DSC_2243wm_800x800.jpg"
                                    alt="product"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                            <div className="flex flex-1 items-center justify-between ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">BOUQUET NO-1</h3>
                                <p className="text-pink-600 font-medium">100,000 VND</p>
                                <p className="text-gray-600">x2</p>
                                <p className="text-lg font-semibold text-pink-600">200,000 VND</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <div className="w-24 h-24 flex-shrink-0">
                                <img
                                    src="https://storage.googleapis.com/cdn_dlhf_vn/public/products/APF0/APF06AK217/DSC_2243wm_800x800.jpg"
                                    alt="product"
                                    className="w-full h-full object-cover rounded"
                                />
                            </div>
                            <div className="flex flex-1 items-center justify-between ml-6">
                                <h3 className="text-lg font-semibold text-gray-900">BOUQUET NO-2</h3>
                                <p className="text-pink-600 font-medium">150,000 VND</p>
                                <p className="text-gray-600">x1</p>
                                <p className="text-lg font-semibold text-pink-600">150,000 VND</p>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mb-5 border border-gray-300 rounded">
                    <h2 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Special Note About Order</h2>
                    <div className="grid grid-cols-2 gap-10 p-4">
                        <div>
                            <h3 className="mb-2 text-left">Card/Banner Message:</h3>
                            <Form.Item>
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item>
                                <div className="flex items-center">
                                    <Checkbox className="mr-2 text-pink-500" />
                                    <span>Hide the giver's name</span>
                                </div>
                            </Form.Item>
                        </div>

                        <div>
                            <h3 className="mb-2 text-left">Important Note:</h3>
                            <Form.Item>
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
                                >
                                    <Select.Option value="Store 1">Store 1</Select.Option>
                                    <Select.Option value="Store 2">Store 2</Select.Option>
                                    <Select.Option value="Store 3">Store 3</Select.Option>
                                </Select>
                            </div>
                        </div>

                        <div className="mb-5 border border-gray-300 rounded">
                            <h3 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Available Vouchers</h3>
                            <p className="text-base p-3 text-gray-500 text-left">Select a voucher to apply</p>
                            <div className="p-4">
                                <OptionCard
                                    id="new-customer"
                                    title="New Customer Discount"
                                    description="15% off for first-time customers"
                                    discount="15%"
                                    icon="https://res.cloudinary.com/teepublic/image/private/s--SsGBkQkb--/c_crop,x_10,y_10/c_fit,w_830/c_crop,g_north_west,h_1038,w_1038,x_-104,y_-297/l_upload:v1565806151:production:blanks:vdbwo35fw6qtflw9kezw/fl_layer_apply,g_north_west,x_-215,y_-408/b_rgb:000000/c_limit,f_jpg,h_630,q_90,w_630/v1574270323/production/designs/6813989_0.jpg"
                                    selected={selectedVoucher === 'new-customer'}
                                    onClick={handleVoucherChange}
                                />
                                <OptionCard
                                    id="valentine"
                                    title="Valentine's Special"
                                    description="10% off on orders above 500,000 VND"
                                    discount="10%"
                                    icon="https://lh5.googleusercontent.com/6gWO2T8L4xqoWgMcXRh_H-oLJ5vLyXHFcQUKJv36cZgQVjDVpFRN3Ezyr5zqPhljR4jiFkLgOK9JOU-0PbreGnYzwGtKrNMlhrdZqmJvhuqgg_vne9x9CqD7S5aeIDSoNRn4RzQrhJPIcE637ud6j1i_-j8uPazgTMl0Ayt8adlV1iZcUJnNTWpJ3g"
                                    selected={selectedVoucher === 'valentine'}
                                    onClick={handleVoucherChange}
                                />
                                <OptionCard
                                    id="free-shipping"
                                    title="Free Shipping"
                                    description="Free shipping on orders above 300,000 VND"
                                    discount="30,000 đ"
                                    icon="https://lamha.com.vn/image/cache/catalog/blog/khuyen-mai/free_shipping_PNG2-640x360.png"
                                    selected={selectedVoucher === 'free-shipping'}
                                    onClick={handleVoucherChange}
                                />
                            </div>
                        </div>

                        <div className="mb-6 border border-gray-300 rounded">
                            <h2 className="text-xl font-semibold text-left text-black bg-pink-200 p-2 rounded">Order Summary</h2>
                            <div className="p-4">
                                <p className="mb-2 text-left">Subtotal: 400,000 VND</p>
                                <p className="mb-2 text-left">Discount (Voucher): -20,000 VND</p>
                                <p className="mb-2 text-left">Shipping: 50,000 VND</p>
                                <p className="font-bold text-left">Total: 430,000 VND</p>
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

                        {shippingMethod !== 'store-pickup' && (
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
                    <Button type="primary" className="bg-pink-400 text-white text-2xl px-10 py-8 rounded-md">
                        Proceed to Payment
                    </Button>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Checkout;