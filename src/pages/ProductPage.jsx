import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, Row, Col, Select, Tabs, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const ProductPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedColor, setSelectedColor] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedPopularity, setSelectedPopularity] = useState('all');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
<<<<<<< HEAD
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
                setProducts(response.data.data || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);
=======
        const fetchData = async () => {
            try {
                const productsResponse = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
                
                if (productsResponse.data && productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
                    const mappedProducts = productsResponse.data.data.map(product => ({
                        id: product.productId,
                        name: product.productName,
                        price: product.price,
                        category: product.categoryName,
                        size: product.size,
                        image: product.productImages && product.productImages.length > 0 
                            ? product.productImages[0].productImage1 
                            : 'https://via.placeholder.com/300',
                        quantity: product.quantity,
                        discount: product.discount,
                        description: product.description,
                        popularity: product.featured ? 'bestseller' : null,
                    }));
                    
                    setProducts(mappedProducts);
                } else {
                    console.error("Unexpected product data format:", productsResponse.data);
                    setProducts([]);
                    message.error("Failed to parse product data");
                }
>>>>>>> 49c7d7b4238a6a8826dbcd7f5c99c5d0a672a75e

                // CATEGORY
                const categoriesResponse = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/categories');
                
                if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
                    // Type: "Product"
                    const productCategories = categoriesResponse.data.filter(
                        category => category.type === "Product"
                    );
                    
                    // "All"
                    setCategories(["All", ...productCategories.map(cat => cat.categoryName)]);
                } else {
                    console.error("Unexpected category data format:", categoriesResponse.data);
                    setCategories(["All"]);
                    message.error("Failed to parse category data");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                message.error("Failed to load data. Please try again later.");
                setProducts([]);
                setCategories(["All"]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter
    const filterProducts = (category) => {
        return products.filter(product => {
<<<<<<< HEAD
            const matchesCategory = category === "All" || product.categoryName === category;
            const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesColor = selectedColor === 'all' || product.color === selectedColor;
=======
            const matchesCategory = category === "All" || product.category === category;
            const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
            const matchesColor = selectedColor === 'all' || (product.color === selectedColor);
>>>>>>> 49c7d7b4238a6a8826dbcd7f5c99c5d0a672a75e
            const matchesPrice = selectedPrice === 'all' ||
                (selectedPrice === 'low' ? product.price < 100000 : product.price >= 100000);
            const matchesSize = selectedSize === 'all' || product.size === selectedSize;
            const matchesPopularity = selectedPopularity === 'all' || 
                (selectedPopularity === 'bestseller' && product.popularity === 'bestseller');

            return matchesCategory && matchesSearch && matchesColor && 
                   matchesPrice && matchesSize && matchesPopularity;
        });
    };

    const ProductCard = ({ product }) => (
<<<<<<< HEAD
        <Link to={`/productdetail/${product.productId}`}>
            <Card
                hoverable
                cover={
                    product.productImages && product.productImages.length > 0 ? (
                        <img 
                            alt={product.productName} 
                            src={product.productImages[0].productImage1}
                            className="w-full h-60 object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                            }}
                        />
                    ) : (
                        <div className="w-full h-60 flex items-center justify-center bg-gray-200">
                            No Image
                        </div>
                    )
                }
            >
                <div className="text-center">
                    <h3 className="text-lg font-medium">{product.productName}</h3>
                    <p className="text-gray-500">${product.price}</p>
=======
        <Link to={`/productdetail/${product.id}`}>
            <Card
                hoverable
                cover={<img alt={product.name} src={product.image} className="w-full h-60 object-cover" />}
            >
                <div className="text-center">
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-gray-500">${(product.price).toLocaleString()} VND</p>
>>>>>>> 49c7d7b4238a6a8826dbcd7f5c99c5d0a672a75e
                    <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded">
                        Shop Now
                    </button>
                </div>
            </Card>
        </Link>
    );

    const sizes = ['all', ...new Set((Array.isArray(products) ? products : [])
        .map(product => product.size)
        .filter(Boolean))];
    
    // Popularity: "featured"
    const popularityValues = ['all', 'bestseller'];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spin size="large" tip="Loading products..." />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="p-8 mt-10 mb-16">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-pink-500 mb-8">PRODUCT</h1>
                    <p className="text-gray-600 text-lg mt-2">
                        Discover our exclusive collection of flowers and find the perfect one for you!
                    </p>
                </div>

                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
<<<<<<< HEAD
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedColor(value)}>
                            <Option value="all">All Colors</Option>
                            <Option value="red">Red</Option>
                            <Option value="pink">Pink</Option>
                            <Option value="white">White</Option>
                        </Select>
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedPrice(value)}>
=======
                        <Select 
                            defaultValue="all" 
                            className="w-32" 
                            onChange={(value) => setSelectedPrice(value)}
                        >
>>>>>>> 49c7d7b4238a6a8826dbcd7f5c99c5d0a672a75e
                            <Option value="all">All Prices</Option>
                            <Option value="low">Below 100,000 VND</Option>
                            <Option value="high">100,000 VND & Above</Option>
                        </Select>
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedSize(value)}>
                            <Option value="all">All Sizes</Option>
                            {sizes.filter(size => size !== 'all').map(size => (
                                <Option key={size} value={size}>{size}</Option>
                            ))}
                        </Select>
                        <Select defaultValue="all" className="w-40" onChange={(value) => setSelectedPopularity(value)}>
                            <Option value="all">All Products</Option>
                            <Option value="bestseller">Best Sellers</Option>
                        </Select>
                    </div>
<<<<<<< HEAD
                    <Search 
                        placeholder="Search flowers..." 
                        allowClear 
                        onSearch={(value) => setSearchTerm(value)} 
                        className="w-full max-w-md" 
                        prefix={<SearchOutlined className="text-gray-400" />} 
                    />
                </div>

                <Tabs defaultActiveKey="0" items={categories.map((category, index) => ({
                    key: index.toString(),
                    label: category,
                    children: (
                        <Row gutter={[16, 16]}>
                            {filterProducts(category).map(product => (
                                <Col key={product.productId} xs={24} sm={12} md={6}>
                                    <ProductCard product={product} />
                                </Col>
                            ))}
                        </Row>
                    )
                }))} />
=======
                    <Search
                        placeholder="Search flowers..."
                        allowClear
                        onSearch={(value) => setSearchTerm(value)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md"
                        prefix={<SearchOutlined className="text-gray-400" />}
                    />
                </div>

                {categories.length > 0 ? (
                    <Tabs defaultActiveKey="0">
                        {categories.map((category, index) => (
                            <TabPane tab={category} key={index.toString()}>
                                <Row gutter={[16, 16]}>
                                    {Array.isArray(products) && filterProducts(category).length > 0 ? (
                                        filterProducts(category).map(product => (
                                            <Col key={product.id} xs={24} sm={12} md={6}>
                                                <ProductCard product={product} />
                                            </Col>
                                        ))
                                    ) : (
                                        <div className="w-full text-center p-8">
                                            <p>No products found matching your criteria.</p>
                                        </div>
                                    )}
                                </Row>
                            </TabPane>
                        ))}
                    </Tabs>
                ) : (
                    <div className="text-center p-8">
                        <p>No categories available.</p>
                    </div>
                )}
>>>>>>> 49c7d7b4238a6a8826dbcd7f5c99c5d0a672a75e
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;