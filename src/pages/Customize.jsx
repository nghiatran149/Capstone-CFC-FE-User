import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Slider } from 'antd';
import Header from "../components/Header";
import Footer from "../components/Footer";

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
                    name: flower.flowerName,
                    price: flower.price,
                    color: flower.color,
                    description: flower.description,
                    images: [flower.image],
                    quantity: flower.quantity,
                    category: flower.categoryName
                }));
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

    const styles = [
        { id: 1, name: 'Classic Style', description: 'Symmetric and traditional design with flowers arranged in a round shape', images: ['https://hips.hearstapps.com/hmg-prod/images/closeup-jpg-1614830517.jpg?crop=0.670xw:1.00xh;0.0801xw,0&resize=1200:*'] },
        { id: 2, name: 'Modern Style', description: 'Contemporary design with clean lines and geometric patterns', images: ['https://asset.bloomnation.com/c_fill,d_vendor:global:catalog:product:image.png,f_auto,fl_preserve_transparency,h_2000,q_auto,w_2000/v1705560133/vendor/6363/catalog/product/2/0/20180510062901_file_5af48f6da781d.jpg'] },
        { id: 3, name: 'Rustic Style', description: 'Natural and wild arrangement with a loose, garden-picked look', images: ['https://i.etsystatic.com/19655563/r/il/38b87a/3445823231/il_fullxfull.3445823231_tm5h.jpg'] },
        { id: 4, name: 'Romantic Style', description: 'Soft and elegant arrangement with curved lines and full blooms', images: ['https://fraicheliving.com/wp-content/uploads/2019/02/nV0buMkg-scaled.jpeg'] }
    ];

    const accessories = [
        { id: 1, name: 'Ribbon', description: 'Elegant satin ribbon for decoration', price: 5.99, images: ['https://as2.ftcdn.net/jpg/01/92/51/47/1000_F_192514739_aGk120cYyRntM1xuU8JywWjh4w10qQSG.jpg'] },
        { id: 2, name: 'Greeting Card', description: 'Personalized message card', price: 3.99, images: ['https://cdn11.bigcommerce.com/s-7f9rxjod7c/images/stencil/1280x1280/products/357334/882343/CARD22JLY271__80685.1658751885.jpg?c=2&imbypass=on'] },
        { id: 3, name: 'Gift Box', description: 'Premium gift box for special occasions', price: 8.99, images: ['https://afterrainflorist.com/wp-content/uploads/2020/06/AFTERRAINFLORIST_PJ_Florist_KL_Florist_Charming_Mix_Flowers_with_Chocolate_Square_Flower_Box_2-1024x1024.jpg'] },
    ];


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
            const flowerId = selectedFlower.id;
            const currentQuantity = selectedFlowers[flowerId]?.quantity || 0;
            const newTotal = totalFlowers - currentQuantity + flowerQuantity;

            setSelectedFlowers(prev => ({
                ...prev,
                [flowerId]: { ...selectedFlower, quantity: flowerQuantity }
            }));
            setTotalFlowers(newTotal);
            alert(`Saved ${flowerQuantity} ${selectedFlower.name} flowers`);
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
            alert('Please select both basket and style before checkout.');
            return;
        }

        if (totalFlowers < selectedBasket.minFlowers || totalFlowers > selectedBasket.maxFlowers) {
            alert(`Total number of flowers must be from ${selectedBasket.minFlowers} to ${selectedBasket.maxFlowers}. Current quantity: ${totalFlowers}`);
            return;
        }

        alert('Thank you for your order! Proceeding to payment...');
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
        </div>
    );
};

export default FlowerCustomization;