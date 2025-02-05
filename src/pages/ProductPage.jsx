import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";

const { Search } = Input;

const ProductPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const products = [
        {
            id: 1,
            image: 'https://i.pinimg.com/736x/52/16/98/5216984883394666537faad7316373cf.jpg',
            title: 'Bouquet No. 1',
            price: '$40',
            link: '/product/1'
        },
        {
            id: 2,
            image: 'https://inkythuatso.com/uploads/thumbnails/800/2023/02/hinh-anh-lang-hoa-dep-chuc-mung-sinh-nhat-1-08-09-31-09.jpg',
            title: 'Bouquet No. 2',
            price: '$40',
            link: '/product/2'
        },
        {
            id: 3,
            image: 'https://nhahoa.com.vn/wp-content/uploads/2021/06/HG025.jpg',
            title: 'Bouquet No. 3',
            price: '$40',
            link: '/product/3'
        },
        {
            id: 4,
            image: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474077hDX/anh-gio-hoa-sen-dep-y-nghia_091937096.jpg',
            title: 'Bouquet No. 4',
            price: '$40',
            link: '/product/4'
        },
        {
            id: 5,
            image: 'https://www.queenflowers.vn/Uploads/images/2024/4/TVC60112_0543.jpg',
            title: 'Bouquet No. 5',
            price: '$40',
            link: '/product/4'
        },
        {
            id: 6,
            image: 'https://hoatuoi9x.com/wp-content/uploads/2022/05/g4.jpg',
            title: 'Bouquet No. 6',
            price: '$40',
            link: '/product/4'
        },
        {
            id: 7,
            image: 'https://cdn.f20beauty.com/29369/faa27ac3fd19ba4a7fa390a72c582b51.jpg',
            title: 'Bouquet No. 7',
            price: '$40',
            link: '/product/4'
        },
        {
            id: 8,
            image: 'https://media.dienhoanhanh.vn/product-images/60a4d2868b1262b83a0a8b9a/66eea01abf4247eaa38b83ed/60a76dae1b716eb579fb00dd/normal/gio-hoa-yeu-mai-binh-yendienhoanhanhvn638625114504109446-2048-2048.webp',
            title: 'Bouquet No. 8',
            price: '$40',
            link: '/product/4'
        }
    ];

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
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

            {/* Product Cards */}
            <Row gutter={[16, 16]}>
                {filteredProducts.map(product => (
                    <Col key={product.id} xs={24} sm={12} md={6}>
                        <Link to="/productdetail">
                        <Card
                            hoverable
                            cover={<img alt={product.title} src={product.image} className="w-full h-60 object-cover" />}
                        >
                            <div className="text-center">
                                <h3 className="text-lg font-medium">{product.title}</h3>
                                <p className="text-gray-500">{product.price}</p>
                                <a href={product.link}>
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
