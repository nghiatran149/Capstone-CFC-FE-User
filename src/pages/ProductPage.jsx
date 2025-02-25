import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, Row, Col, Select, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

const { Search } = Input;
const { Option } = Select;

const categories = [
    "All", "Wedding Flowers", "Gift Flowers", "Anniversary Flowers", "Birthday Flowers", "Sympathy Flowers"
];

const ProductPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedColor, setSelectedColor] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedPopularity, setSelectedPopularity] = useState('all');

    useEffect(() => {
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

    const filterProducts = (category) => {
        return products.filter(product => {
            const matchesCategory = category === "All" || product.categoryName === category;
            const matchesSearch = product.productName?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesColor = selectedColor === 'all' || product.color === selectedColor;
            const matchesPrice = selectedPrice === 'all' ||
                (selectedPrice === 'low' ? product.price < 40 : product.price >= 40);
            const matchesSize = selectedSize === 'all' || product.size === selectedSize;
            const matchesPopularity = selectedPopularity === 'all' || product.popularity === selectedPopularity;

            return matchesCategory && matchesSearch && matchesColor && 
                   matchesPrice && matchesSize && matchesPopularity;
        });
    };

    const ProductCard = ({ product }) => (
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
                    <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded">
                        Shop Now
                    </button>
                </div>
            </Card>
        </Link>
    );

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
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedColor(value)}>
                            <Option value="all">All Colors</Option>
                            <Option value="red">Red</Option>
                            <Option value="pink">Pink</Option>
                            <Option value="white">White</Option>
                        </Select>
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedPrice(value)}>
                            <Option value="all">All Prices</Option>
                            <Option value="low">Below $40</Option>
                            <Option value="high">$40 & Above</Option>
                        </Select>
                        <Select defaultValue="all" className="w-32" onChange={(value) => setSelectedSize(value)}>
                            <Option value="all">All Sizes</Option>
                            <Option value="small">Small</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="large">Large</Option>
                        </Select>
                        <Select defaultValue="all" className="w-40" onChange={(value) => setSelectedPopularity(value)}>
                            <Option value="all">All Products</Option>
                            <Option value="bestseller">Best Sellers</Option>
                            <Option value="new">New Arrivals</Option>
                            <Option value="trending">Trending</Option>
                        </Select>
                    </div>
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
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;