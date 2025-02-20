import React from 'react';
import { Button, DatePicker, InputNumber, Tag, Rate } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Thêm dòng này
import Header from "../components/Header";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const navigate = useNavigate(); // Khởi tạo navigate

  return (
    <div className="w-full">
      <Header />

      <div className="flex ml-20 mt-10 mb-4">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          className="bg-pink-300 text-white text-lg px-6 py-5 rounded-md shadow-md"
          onClick={() => navigate(-1)} // Quay lại trang trước
        >
          BACK
        </Button>
      </div>

      <div className="mx-20 my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="w-full h-auto flex items-center justify-center rounded-lg overflow-hidden">
              <img
                src="https://hoatuoionline.net/wp-content/uploads/2024/06/z2482687689180_97a7f86dbc0b8fe8cf800dcab84b8196.jpg"
                alt="Bouquet No.3"
                className="w-3/4 h-auto object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center justify-center rounded-lg overflow-hidden gap-4 mt-10">
              <img
                src="https://hoatuoionline.net/wp-content/uploads/2024/06/z2482687689180_97a7f86dbc0b8fe8cf800dcab84b8196.jpg"
                alt="Thumbnail 1"
                className="w-20 h-20 object-cover rounded-lg border-2 border-pink-400"
              />
              <img
                src="https://hoatuoionline.net/wp-content/uploads/2024/06/z2482687689180_97a7f86dbc0b8fe8cf800dcab84b8196.jpg"
                alt="Thumbnail 2"
                className="w-20 h-20 object-cover rounded-lg"
              />
              <img
                src="https://hoatuoionline.net/wp-content/uploads/2024/06/z2482687689180_97a7f86dbc0b8fe8cf800dcab84b8196.jpg"
                alt="Thumbnail 3"
                className="w-20 h-20 object-cover rounded-lg"
              />
            </div>
          </div>

          <div>
            <h1 className="text-5xl text-left font-bold mb-8">BOUQUET NO. 10</h1>

            <div className="flex gap-2 mb-5">
              <Tag color="pink">Lily</Tag>
              <Tag color="pink">Vase Decoration</Tag>
              <Tag color="pink">Home Decor</Tag>
            </div>

            <div className="flex items-center gap-5 mb-5">
              <Rate disabled defaultValue={0} />
              <span>(No reviews)</span>
            </div>

            <h2 className="text-left text-lg font-bold mb-2">Description:</h2>
            <p className="text-left text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque semper libero enim. Donec
              aliquet interdum leo in iaculis. Cras enim est, semper ut tortor vel, rhoncus sodales massa.
              Morbi in pellentesque leo.
            </p>

            <div className="flex items-center gap-4 mt-5">
              <h2 className="text-left text-lg font-bold">Date:</h2>
              <DatePicker
                className="border-pink-400 rounded-md px-2 py-2"
                suffixIcon={<CalendarOutlined className="text-black text-lg" />}
                defaultValue={null}
                placeholder="Date"
              />
            </div>

            <div className="flex items-center gap-4 mt-5">
              <h2 className="text-left text-lg font-bold">Time:</h2>
              <input
                type="time"
                className="border border-pink-400 rounded-md px-2 py-1"
              />
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
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
