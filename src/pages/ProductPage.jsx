import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, Row, Col, Select, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

const categories = [
    "All", "Wedding Flowers", "Gift Flowers", "Anniversary Flowers", "Birthday Flowers", "Sympathy Flowers"
];

const ProductPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedColor, setSelectedColor] = useState('all');
    const [selectedPrice, setSelectedPrice] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');
    const [selectedPopularity, setSelectedPopularity] = useState('all');

    const products = [
        {
            id: 1,
            title: 'Bouquet No. 1',
            price: 35,
            category: 'Wedding Flowers',
            color: 'red',
            size: 'small',
            popularity: 'bestseller',
            image: 'https://i.pinimg.com/736x/52/16/98/5216984883394666537faad7316373cf.jpg',
        },
        {
            id: 2,
            title: 'Bouquet No. 2',
            price: 40,
            category: 'Gift Flowers',
            color: 'red',
            size: 'medium',
            popularity: 'trending',
            image: 'https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-lang-hoa-dep-chuc-mung-sinh-nhat-1-08-09-31-09.jpg',
        },
        {
            id: 3,
            title: 'Bouquet No. 3',
            price: 35,
            category: 'Anniversary Flowers',
            color: 'pink',
            size: 'large',
            popularity: 'bestseller',
            image: 'https://nhahoa.com.vn/wp-content/uploads/2021/06/HG025.jpg',
        },
        {
            id: 4,
            title: 'Bouquet No. 4',
            price: 45,
            category: 'Birthday Flowers',
            color: 'white',
            size: 'small',
            popularity: 'bestseller',
            image: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474077hDX/anh-gio-hoa-sen-dep-y-nghia_091937096.jpg',
        },
        {
            id: 5,
            title: 'Bouquet No. 5',
            price: 50,
            category: 'Sympathy Flowers',
            color: 'white',
            size: 'medium',
            popularity: 'new',
            image: 'https://www.queenflowers.vn/Uploads/images/2024/4/TVC60112_0543.jpg',
        },
        {
            id: 6,
            title: 'Bouquet No. 6',
            price: 55,
            category: 'Wedding Flowers',
            color: 'pink',
            size: 'large',
            popularity: 'new',
            image: 'https://hoatuoi9x.com/wp-content/uploads/2022/05/g4.jpg',
        },
        {
            id: 7,
            title: 'Bouquet No. 7',
            price: 30,
            category: 'Wedding Flowers',
            color: 'red',
            size: 'small',
            popularity: 'trending',
            image: 'https://cdn.f20beauty.com/29369/faa27ac3fd19ba4a7fa390a72c582b51.jpg',
        },
        {
            id: 8,
            title: 'Bouquet No. 8',
            price: 60,
            category: 'Gift Flowers',
            color: 'pink',
            size: 'medium',
            popularity: 'trending',
            image: 'https://media.dienhoanhanh.vn/product-images/60a4d2868b1262b83a0a8b9a/66eea01abf4247eaa38b83ed/60a76dae1b716eb579fb00dd/normal/gio-hoa-yeu-mai-binh-yendienhoanhanhvn638625114504109446-2048-2048.webp',
        }
    ];

    const filterProducts = (category) => {
        return products.filter(product => {
            const matchesCategory = category === "All" || product.category === category;
            const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
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
        <Link to={`/productdetail`}>
            <Card
                hoverable
                cover={<img alt={product.title} src={product.image} className="w-full h-60 object-cover" />}
            >
                <div className="text-center">
                    <h3 className="text-lg font-medium">{product.title}</h3>
                    <p className="text-gray-500">${product.price}</p>
                    <button className="mt-4 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded">
                        Shop Now
                    </button>
                </div>
            </Card>
        </Link>
    );
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
                    <p className="text-gray-600 text-lg mt-2">
                        Discover our exclusive collection of flowers and find the perfect one for you!
                    </p>
                </div>
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
                <div className="flex justify-between items-center mb-8">
                    <div className="flex gap-4">
                        <Select 
                            defaultValue="all" 
                            className="w-32" 
                            onChange={(value) => setSelectedColor(value)}
                        >
                            <Option value="all">All Colors</Option>
                            <Option value="red">Red</Option>
                            <Option value="pink">Pink</Option>
                            <Option value="white">White</Option>
                        </Select>
                        <Select 
                            defaultValue="all" 
                            className="w-32" 
                            onChange={(value) => setSelectedPrice(value)}
                        >
                            <Option value="all">All Prices</Option>
                            <Option value="low">Below $40</Option>
                            <Option value="high">$40 & Above</Option>
                        </Select>
                        <Select 
                            defaultValue="all" 
                            className="w-32" 
                            onChange={(value) => setSelectedSize(value)}
                        >
                            <Option value="all">All Sizes</Option>
                            <Option value="small">Small</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="large">Large</Option>
                        </Select>
                        <Select 
                            defaultValue="all" 
                            className="w-40" 
                            onChange={(value) => setSelectedPopularity(value)}
                        >
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
                <Tabs defaultActiveKey="0">
                    {categories.map((category, index) => (
                        <TabPane tab={category} key={index.toString()}>
                            <Row gutter={[16, 16]}>
                                {filterProducts(category).map(product => (
                                    <Col key={product.id} xs={24} sm={12} md={6}>
                                        <ProductCard product={product} />
                                    </Col>
                                ))}
                            </Row>
                        </TabPane>
                    ))}
                </Tabs>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
