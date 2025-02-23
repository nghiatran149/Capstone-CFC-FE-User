import React, { useState, useEffect } from 'react';
import { Button, Input, Rate, List, DatePicker, InputNumber, Tag } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`https://customchainflower-ecbrb4bhfrguarb9.southeastasia-01.azurewebsites.net/api/Product/GetProductById?id=${id}`);
        setProduct(response.data.data); 
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetail();
  }, [id]);

  const handleSubmit = () => {
    if (text.trim() !== '') {
      setComments([{ text, rating, id: Date.now() }, ...comments]);
      setText('');
      setRating(0);
    }
  };

  if (!product) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="w-full">
      <Header />

      <div className="flex ml-20 mt-10 mb-4">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          className="bg-pink-300 text-white text-lg px-6 py-5 rounded-md shadow-md"
          onClick={() => navigate(-1)}
        >
          BACK
        </Button>
      </div>

      <div className="mx-20 my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="w-full h-auto flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src={product.productImages[0].imageUrl} 
                alt={product.productName}
                className="w-3/4 h-auto object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center justify-center rounded-lg overflow-hidden gap-4 mt-10">
              {}
              {product.productImages.map((image, index) => (
                <img
                  key={index}
                  src={image.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-pink-400"
                />
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-5xl text-left font-bold mb-8">{product.productName}</h1>
            <div className="flex gap-2 mb-5">
              <Tag color="pink">Category: {product.categoryName}</Tag>
            </div>
            <div className="flex items-center gap-5 mb-5">
              <Rate disabled defaultValue={0} />
              <span>(No reviews)</span>
            </div>
            <h2 className="text-left text-lg font-bold mb-2">Description:</h2>
            <p className="text-left text-gray-600">{product.description}</p>
            <div className="flex items-center gap-4 mt-5">
              <h2 className="text-left text-lg font-bold">Date:</h2>
              <DatePicker className="border-pink-400 rounded-md px-2 py-2" suffixIcon={<CalendarOutlined className="text-black text-lg" />} />
            </div>
            <div className="flex items-center gap-4 mt-5">
              <h2 className="text-left text-lg font-bold">Time:</h2>
              <input type="time" className="border border-pink-400 rounded-md px-2 py-1" />
            </div>
            <div className="flex items-center gap-4 mt-5">
              <h2 className="text-left text-lg font-bold">Quantity:</h2>
              <InputNumber min={1} defaultValue={1} className="border-pink-400 rounded-md" />
            </div>
            <Button type="primary" className="bg-pink-400 text-white text-xl px-10 py-6 mt-10 rounded-md">
              ADD TO CART
            </Button>
          </div>
        </div>

        <div className="mt-16 px-20">
          <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
          <div className="mb-6 p-4 border rounded-md">
            <h3 className="text-xl font-semibold">Leave a Comment</h3>
            <Rate onChange={setRating} value={rating} className="mb-2" />
            <Input.TextArea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your review..."
            />
            <Button type="primary" className="mt-3 bg-pink-400 text-white" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<UserOutlined className="text-2xl" />}
                  title={<Rate disabled defaultValue={item.rating} />}
                  description={item.text}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
