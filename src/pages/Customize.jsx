import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Slider, Modal, Form, Input, message } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";
import jwtDecode from 'jwt-decode';
import axios from 'axios';

const FlowerCustomization = () => {
    const [currentStep, setCurrentStep] = useState('basket');
    const [selectedBasket, setSelectedBasket] = useState(null);
    const [selectedFlower, setSelectedFlower] = useState(null);
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [selectedAccessory, setSelectedAccessory] = useState(null);
    const [selectedAccessories, setSelectedAccessories] = useState({});
    const [mainImage, setMainImage] = useState('');

    const [selectedFlowers, setSelectedFlowers] = useState({});
    const [totalFlowers, setTotalFlowers] = useState(0);
    const [flowerQuantity, setFlowerQuantity] = useState(1);

    const [baskets, setBaskets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [flowers, setFlowers] = useState([]);
    const [loadingFlowers, setLoadingFlowers] = useState(true);
    const [errorFlowers, setErrorFlowers] = useState(null);

    const [accessories, setAccessories] = useState([]);
    const [loadingAccessories, setLoadingAccessories] = useState(true);
    const [errorAccessories, setErrorAccessories] = useState(null);

    const [styles, setStyles] = useState([]);
    const [loadingStyles, setLoadingStyles] = useState(true);
    const [errorStyles, setErrorStyles] = useState(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBaskets = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowerBaskets');
                if (!response.ok) {
                    throw new Error('Failed to fetch baskets');
                }
                const data = await response.json();
                const transformedBaskets = data.map(basket => ({
                    id: basket.flowerBasketId,
                    name: basket.flowerBasketName,
                    category: basket.categoryName,
                    price: basket.price,
                    minFlowers: basket.minQuantity,
                    maxFlowers: basket.maxQuantity,
                    images: [basket.image],
                    description: basket.decription,
                    quantity: basket.quantity
                }));
                setBaskets(transformedBaskets);
            } catch (error) {
                setError(error.message);
                console.error('Error fetching baskets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBaskets();
    }, []);

    useEffect(() => {
        const fetchFlowers = async () => {
            try {
                setLoadingFlowers(true);
                const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/flowers');
                if (!response.ok) {
                    throw new Error('Failed to fetch flowers');
                }
                const data = await response.json();
                const transformedFlowers = data.map(flower => ({
                    id: flower.flowerId,
                    flowerId: flower.flowerId,
                    name: flower.flowerName,
                    price: flower.price,
                    color: flower.color,
                    description: flower.description,
                    images: [flower.image],
                    quantity: flower.quantity,
                    category: flower.categoryName
                }));
                console.log('Fetched flowers:', transformedFlowers);
                setFlowers(transformedFlowers);
            } catch (error) {
                setErrorFlowers(error.message);
                console.error('Error fetching flowers:', error);
            } finally {
                setLoadingFlowers(false);
            }
        };

        fetchFlowers();
    }, []);

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                setLoadingAccessories(true);
                const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/accessory/GetAllAccessory');
                if (!response.ok) {
                    throw new Error('Failed to fetch accessories');
                }
                const data = await response.json();
                const transformedAccessories = data.data.map(accessory => ({
                    id: accessory.accessoryId,
                    name: accessory.name,
                    description: accessory.description,
                    price: accessory.price,
                    images: [accessory.image],
                    category: accessory.categoryName,
                    note: accessory.note
                }));
                setAccessories(transformedAccessories);
            } catch (error) {
                setErrorAccessories(error.message);
                console.error('Error fetching accessories:', error);
            } finally {
                setLoadingAccessories(false);
            }
        };

        fetchAccessories();
    }, []);

    useEffect(() => {
        const fetchStyles = async () => {
            try {
                setLoadingStyles(true);
                const response = await fetch('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/style/GetAllStyle');
                if (!response.ok) {
                    throw new Error('Failed to fetch styles');
                }
                const data = await response.json();
                const transformedStyles = data.data.map(style => ({
                    id: style.styleId,
                    name: style.name,
                    description: style.description,
                    images: [style.image],
                    category: style.categoryName,
                    note: style.note,
                    feature: style.feature
                }));
                setStyles(transformedStyles);
            } catch (error) {
                setErrorStyles(error.message);
                console.error('Error fetching styles:', error);
            } finally {
                setLoadingStyles(false);
            }
        };

        fetchStyles();
    }, []);

    //Basket Function
    const handleBasketSelect = (basket) => {
        setSelectedBasket(basket);
        setMainImage(basket.images[0]);
        setSelectedFlowers({});
        setTotalFlowers(0);
        setFlowerQuantity(1);
    };


    //Style Function
    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        setMainImage(style.images[0]);
    };


    //Flower Function
    const handleFlowerSelect = (flower) => {
        setSelectedFlower(flower);
        setMainImage(flower.images[0]);
        setFlowerQuantity(1);
    };

    const handleResetFlowers = () => {
        setSelectedFlowers({});
        setTotalFlowers(0);
        alert('All selected flowers have been reset.');
    };

    const handleSaveFlowerQuantity = () => {
        if (selectedFlower && selectedBasket) {
            const flowerId = selectedFlower.flowerId;
            const currentQuantity = selectedFlowers[flowerId]?.quantity || 0;
            const newTotal = totalFlowers - currentQuantity + flowerQuantity;

            // Save complete flower information
            setSelectedFlowers(prev => ({
                ...prev,
                [flowerId]: {
                    id: selectedFlower.flowerId,
                    flowerId: selectedFlower.flowerId,
                    name: selectedFlower.name,
                    price: selectedFlower.price,
                    quantity: flowerQuantity,
                    color: selectedFlower.color,
                    category: selectedFlower.category
                }
            }));
            setTotalFlowers(newTotal);
            message.success(`Saved ${flowerQuantity} ${selectedFlower.name} flowers`);
            console.log('Updated selected flowers:', selectedFlowers);
        }
    };

    const handleQuantityChange = (value) => {
        setFlowerQuantity(value);
    };


    // Accessory Function
    const handleAccessorySelect = (accessory) => {
        setSelectedAccessory(accessory);
        setMainImage(accessory.images[0]);
    };

    const handleSaveAccessory = () => {
        if (selectedAccessory) {
            setSelectedAccessories(prev => ({
                ...prev,
                [selectedAccessory.id]: { ...selectedAccessory }
            }));
            alert(`Added ${selectedAccessory.name} to your arrangement`);
        }
    };

    const handleResetAccessories = () => {
        setSelectedAccessories({});
        alert('All selected accessories have been reset.');
    };


    //Next & Back
    const handleNext = () => {
        setCurrentStep('style');
    };

    const handleNextToFlowers = () => {
        setCurrentStep('flowers');
    };

    const handleNextToAccessories = () => {
        setCurrentStep('accessories');
    };

    const handleBackToBaskets = () => {
        setCurrentStep('basket');
    };

    const handleBackToStyle = () => {
        setCurrentStep('style');
    };

    const handleBackToFlowers = () => {
        setCurrentStep('flowers');
    };

    const handleCheckout = () => {
        if (!selectedBasket || !selectedStyle) {
            message.error('Please select both basket and style before checkout.');
            return;
        }

        if (totalFlowers < selectedBasket.minFlowers || totalFlowers > selectedBasket.maxFlowers) {
            message.error(`Total number of flowers must be from ${selectedBasket.minFlowers} to ${selectedBasket.maxFlowers}. Current quantity: ${totalFlowers}`);
            return;
        }

        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleModalSubmit = async () => {
        try {
            const values = await form.validateFields();
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

            // Check if flowers are selected
            if (Object.keys(selectedFlowers).length === 0) {
                message.error('Please select at least one flower');
                return;
            }

            // Prepare flower custom requests with proper flowerId
            const createFlowerCustomRequests = Object.values(selectedFlowers).map(flower => ({
                flowerId: flower.flowerId,
                quantity: flower.quantity
            }));

            // Get the first accessory ID if any accessories are selected
            const accessoryIds = Object.keys(selectedAccessories);
            const accessoryId = accessoryIds.length > 0 ? accessoryIds[0] : null;

            const customProductData = {
                productName: values.productName.trim(),
                flowerBasketId: selectedBasket.id,
                styleId: selectedStyle.id,
                accessoryId: accessoryId,
                quantity: 1,
                createFlowerCustomRequests: createFlowerCustomRequests,
                description: values.description.trim()
            };

            console.log('Selected Flowers:', selectedFlowers);
            console.log('Create Flower Requests:', createFlowerCustomRequests);
            console.log('Sending data:', customProductData);

            const response = await axios.post(
                `https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/productcustoms/create-productcustom?CustomerId=${customerId}`,
                customProductData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200 || response.status === 201) {
                message.success('Custom product created successfully!');
                setIsModalVisible(false);
                const customId = response.data.customeId;
                navigate('/checkout-custom', { 
                    state: { 
                        customId: customId,
                        statusCode: response.data.statusCode,
                        code: response.data.code,
                        message: response.data.message
                    } 
                });
            } else {
                throw new Error('Failed to create custom product');
            }
        } catch (error) {
            console.error('Error:', error);
            console.error('Error response:', error.response?.data);
            message.error(
                error.response?.data?.message || 
                error.response?.data?.title ||
                'Failed to create custom product. Please try again.'
            );
        }
    };

    //Price Calculation
    const calculateTotalPrice = () => {
        const basketPrice = selectedBasket ? selectedBasket.price : 0;
        let flowersPrice = 0;
        let accessoriesPrice = 0;

        for (const flowerId in selectedFlowers) {
            const flower = selectedFlowers[flowerId];
            flowersPrice += flower.price * flower.quantity;
        }

        for (const accessoryId in selectedAccessories) {
            const accessory = selectedAccessories[accessoryId];
            accessoriesPrice += accessory.price;
        }

        return (basketPrice + flowersPrice + accessoriesPrice).toFixed(2);
    };

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
            <h1 className="text-center text-6xl font-bold text-pink-600 p-3 rounded">Customize</h1>
            <p className="text-xl text-gray-500 mb-10 text-center">Customize Your Own Flower Basket With Your Selection</p>

            <div className="flex gap-8 mx-8 my-10 min-h-screen">
                <div className="w-1/4 p-6 bg-white rounded-xl shadow-lg">
                    <h2 className="text-2xl text-pink-500 font-bold mb-3">
                        {currentStep === 'basket' ? 'Choose Basket'
                            : currentStep === 'style' ? 'Choose Style'
                                : currentStep === 'flowers' ? 'Choose Flowers'
                                    : 'Choose Accessories'}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {currentStep === 'basket'
                            ? baskets.map((basket) => (
                                <div
                                    key={basket.id}
                                    className={`cursor-pointer transition-all rounded-lg shadow hover:shadow-lg overflow-hidden
                ${selectedBasket?.id === basket.id ? 'ring-2 ring-pink-500' : 'border border-gray-200'}`}
                                    onClick={() => handleBasketSelect(basket)}
                                >
                                    <div className="p-2">
                                        <img
                                            src={basket.images[0]}
                                            alt={basket.name}
                                            className="w-full aspect-square object-cover rounded"
                                        />
                                    </div>
                                </div>
                            ))
                            : currentStep === 'style'
                                ? styles.map((style) => (
                                    <div
                                        key={style.id}
                                        className={`cursor-pointer transition-all rounded-lg shadow-sm hover:shadow-md overflow-hidden
                    ${selectedStyle?.id === style.id ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}
                                        onClick={() => handleStyleSelect(style)}
                                    >
                                        <div className="p-2">
                                            <img
                                                src={style.images[0]}
                                                alt={style.name}
                                                className="w-full aspect-square object-cover rounded"
                                            />
                                        </div>
                                    </div>
                                ))
                                : currentStep === 'flowers'
                                    ? flowers.map((flower) => (
                                        <div
                                            key={flower.id}
                                            className={`cursor-pointer transition-all rounded-lg shadow-sm hover:shadow-md overflow-hidden
                        ${selectedFlower?.id === flower.id ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}
                                            onClick={() => handleFlowerSelect(flower)}
                                        >
                                            <div className="p-2">
                                                <img
                                                    src={flower.images[0]}
                                                    alt={flower.name}
                                                    className="w-full aspect-square object-cover rounded"
                                                />
                                            </div>
                                        </div>
                                    ))
                                    : accessories.map((accessory) => (
                                        <div
                                            key={accessory.id}
                                            className={`cursor-pointer transition-all rounded-lg shadow-sm hover:shadow-md overflow-hidden
                        ${selectedAccessory?.id === accessory.id ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}
                                            onClick={() => handleAccessorySelect(accessory)}
                                        >
                                            <div className="p-2">
                                                <img
                                                    src={accessory.images[0]}
                                                    alt={accessory.name}
                                                    className="w-full aspect-square object-cover rounded"
                                                />
                                            </div>
                                        </div>
                                    ))}
                    </div>
                </div>
                <div className="w-2/4 p-6 bg-white rounded-xl shadow-lg">
                    <div className="mb-6">
                        <img
                            src={mainImage || '/api/placeholder/600/400'}
                            alt="Selected item"
                            className="w-full h-[500px] object-cover rounded-lg shadow-md"
                        />
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h3 className="text-2xl text-pink-500 font-bold mb-4">Price Calculation</h3>
                        <div className="space-y-2">
                            {selectedBasket && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Basket: {selectedBasket.name}</span>
                                    <span className="font-medium">${selectedBasket.price}</span>
                                </div>
                            )}
                            {selectedBasket && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Basket Capacity:</span>
                                    <span className="font-medium"> {selectedBasket.minFlowers} - {selectedBasket.maxFlowers} Flowers</span>
                                </div>

                            )}
                            
                            {selectedStyle && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Style: {selectedStyle.name}</span>
                                    <span className="font-medium">Free</span>
                                </div>
                            )}
                            {Object.keys(selectedFlowers).map(flowerId => {
                                const flower = selectedFlowers[flowerId];
                                return (
                                    <div key={flowerId} className="flex justify-between text-gray-700">
                                        <span>Flower: {flower.name} x {flower.quantity}</span>
                                        <span className="font-medium">${(flower.price * flower.quantity).toFixed(2)}</span>
                                    </div>
                                );
                            })}
                            {Object.keys(selectedAccessories).map(accessoryId => {
                                const accessory = selectedAccessories[accessoryId];
                                return (
                                    <div key={accessoryId} className="flex justify-between text-gray-700">
                                        <span>Accessory: {accessory.name}</span>
                                        <span className="font-medium">${accessory.price.toFixed(2)}</span>
                                    </div>
                                );
                            })}
                            <div className="border-t pt-3 font-semibold flex justify-between text-lg">
                                <span>Total:</span>
                                <span className="text-pink-600">
                                    ${calculateTotalPrice()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedBasket && currentStep === 'basket' && selectedBasket.images.length > 1 && (
                        <div className="flex gap-4 mb-4 justify-center">
                            {selectedBasket.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Gallery ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-lg cursor-pointer shadow hover:shadow-md
                                             transition-all duration-200 hover:scale-105"
                                    onClick={() => setMainImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Details */}
                <div className="w-1/4 p-6 bg-white rounded-xl shadow-lg space-y-6">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h2 className="text-2xl text-pink-500 font-bold mb-3">
                            {currentStep === 'basket' ? 'Basket Details' : currentStep === 'style' ? 'Style Details' : currentStep === 'flowers' ? 'Flower Details' : 'Accessory Details'}
                        </h2>

                        {currentStep === 'basket' && selectedBasket && (
                            <div className="space-y-2">
                                <p className="font-semibold text-xl">{selectedBasket.name}</p>
                                <p className="text-gray-600">Category: {selectedBasket.category}</p>
                                <p className="text-gray-600">Price: ${selectedBasket.price}</p>
                                <p className="text-gray-600">
                                    Basket Capacity: {selectedBasket.minFlowers} - {selectedBasket.maxFlowers} Flowers
                                </p>
                                <p className="text-gray-600">Available Quantity: {selectedBasket.quantity}</p>
                                {selectedBasket.description && (
                                    <p className="text-gray-600">Description: {selectedBasket.description}</p>
                                )}
                            </div>
                        )}

                        {currentStep === 'flowers' && selectedFlower && selectedBasket && (
                            <div className="space-y-2">
                                <p className="font-semibold text-xl">{selectedFlower.name}</p>
                                <p className="text-gray-600">Price: ${selectedFlower.price}</p>
                                <p className="text-gray-600">Color: {selectedFlower.color}</p>
                                <p className="text-gray-600">Category: {selectedFlower.category}</p>
                                <p className="text-gray-600">Available Quantity: {selectedFlower.quantity}</p>
                                <p className="text-gray-600">Description: {selectedFlower.description}</p>
                                <div className="mt-4">
                                    <p className="text-gray-700 font-bold mb-2">Select Quantity:</p>
                                    <Slider
                                        min={1}
                                        max={Math.min(
                                            selectedFlower.quantity,
                                            selectedBasket.maxFlowers - totalFlowers + (selectedFlowers[selectedFlower.id]?.quantity || 0)
                                        )}
                                        defaultValue={1}
                                        onChange={handleQuantityChange}
                                        value={flowerQuantity}
                                    />
                                    <p className="text-gray-600 mt-2">Quantity: {flowerQuantity}</p>
                                    <div className="flex justify-between gap-4 mt-3">
                                        <button
                                            className="w-1/2 bg-green-500 hover:bg-green-600 text-white text-lg font-medium py-2 px-2 rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                   transition-colors duration-200 shadow-md"
                                            onClick={handleSaveFlowerQuantity}
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="w-1/2 bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-2 px-2 rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                   transition-colors duration-200 shadow-md"
                                            onClick={handleResetFlowers}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'style' && selectedStyle && (
                            <div className="space-y-2">
                                <p className="font-semibold text-xl">{selectedStyle.name}</p>
                                <p className="text-gray-600">Price: Free{selectedStyle.price}</p>
                                <p className="text-gray-600">Description: {selectedStyle.description}</p>
                            </div>
                        )}

                        {currentStep === 'accessories' && selectedAccessory && (
                            <div className="space-y-2">
                                <p className="font-semibold text-xl">{selectedAccessory.name}</p>
                                <p className="text-gray-600">Price: ${selectedAccessory.price}</p>
                                <p className="text-gray-600">Description: {selectedAccessory.description}</p>
                                <div className="flex justify-between gap-4 mt-3">
                                    <button
                                        className="w-1/2 bg-green-500 hover:bg-green-600 text-white text-lg font-medium py-2 px-2 rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                   transition-colors duration-200 shadow-md"
                                        onClick={handleSaveAccessory}
                                    >
                                        Add
                                    </button>
                                    <button
                                        className="w-1/2 bg-red-500 hover:bg-red-600 text-white text-lg font-medium py-2 px-2 rounded-lg
                   disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                   transition-colors duration-200 shadow-md"
                                        onClick={handleResetAccessories}
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Item */}
                    {currentStep === 'flowers' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-2xl text-pink-500 font-bold mb-2">Selected Flowers:</h3>
                            {Object.keys(selectedFlowers).length > 0 ? (
                                <ul>
                                    {Object.entries(selectedFlowers).map(([flowerId, flower]) => (
                                        <li key={flowerId} className="flex justify-between items-center py-1 border-b border-gray-200">
                                            <span>{flower.name}</span>
                                            <span>x {flower.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No flowers selected yet.</p>
                            )}
                            <p className="font-medium mt-2">Total Flowers: {totalFlowers}</p>
                        </div>
                    )}

                    {currentStep === 'accessories' && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                            <h3 className="text-2xl text-pink-500 font-bold mb-2">Selected Accessories:</h3>
                            {Object.keys(selectedAccessories).length > 0 ? (
                                <ul>
                                    {Object.entries(selectedAccessories).map(([accessoryId, accessory]) => (
                                        <li key={accessoryId} className="flex justify-between items-center py-1 border-b border-gray-200">
                                            <span>{accessory.name}</span>
                                            <span>${accessory.price}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No accessories selected yet.</p>
                            )}
                        </div>
                    )}

                    {/* Step Button */}
                    {currentStep === 'basket' && (
                        <button
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg
                 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                 transition-colors duration-200"
                            onClick={handleNext}
                            disabled={!selectedBasket}
                        >
                            Next Step: Choose Style
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {currentStep === 'style' && (
                        <>
                            <button
                                className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg
                 flex items-center justify-center gap-2 transition-colors duration-200 mb-4"
                                onClick={handleBackToBaskets}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Choose Basket Step
                            </button>
                            <button
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg
               disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
               transition-colors duration-200"
                                onClick={handleNextToFlowers}
                                disabled={!selectedStyle}
                            >
                                Next Step: Choose Flowers
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {currentStep === 'flowers' && (
                        <>
                            <button
                                className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg
                 flex items-center justify-center gap-2 transition-colors duration-200 mb-4"
                                onClick={handleBackToStyle}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Choose Style Step
                            </button>
                            <button
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg
               disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
               transition-colors duration-200"
                                onClick={handleNextToAccessories}
                                disabled={totalFlowers < selectedBasket.minFlowers || totalFlowers > selectedBasket.maxFlowers}
                            >
                                Next Step: Choose Accessories
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {currentStep === 'accessories' && (
                        <>
                            <button
                                className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg
                flex items-center justify-center gap-2 transition-colors duration-200 mb-4"
                                onClick={handleBackToFlowers}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Choose Flowers Step
                            </button>
                            <button
                                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-lg
                disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2
                transition-colors duration-200 shadow-md"
                                onClick={handleCheckout}
                            >
                                Proceed to Checkout
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
            
            <Modal
                title="Custom Product Information"
                open={isModalVisible}
                onOk={handleModalSubmit}
                onCancel={handleModalCancel}
                okText="Create Custom Product"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        name="productName"
                        label="Custom Product Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a name for your custom product',
                            },
                        ]}
                    >
                        <Input placeholder="Enter a name for your custom product" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter a description',
                            },
                        ]}
                    >
                        <Input.TextArea 
                            placeholder="Enter a description for your custom product"
                            rows={4}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default FlowerCustomization;