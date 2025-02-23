import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

const { Search } = Input;

const ProductPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct');
        setProducts(response.data.data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []); 

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="p-8 mt-10 mb-16">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-pink-500 mb-8">PRODUCT</h1>
          <p className="text-gray-600 text-lg mt-2">Discover our exclusive collection of flowers and find the perfect one for you!</p>
        </div>

        <div className="mb-12 flex justify-center">
          <Search
            placeholder="Search flowers..."
            allowClear
            onSearch={value => setSearchTerm(value)}
            className="w-full max-w-md"
            prefix={<SearchOutlined className="text-gray-400" />}
          />
        </div>

        {}
        <Row gutter={[16, 16]}>
          {filteredProducts.map(product => (
            <Col key={product.productId} xs={24} sm={12} md={6}>
              <Link to={`/productdetail/${product.productId}`}>
                <Card
                  hoverable
                  cover={<img alt={product.productName} src={product.productImages[0].imageUrl} className="w-full h-60 object-cover" />}
                >
                  <div className="text-center">
                    <h3 className="text-lg font-medium">{product.productName}</h3>
                    <p className="text-gray-500">${product.price}</p>
                    <a href={`/productdetail/${product.productId}`}>
                      <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded">
                        Shop Now
                      </button>
                    </a>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
      <Footer />
    </div>
  );
};

export default ProductPage;
