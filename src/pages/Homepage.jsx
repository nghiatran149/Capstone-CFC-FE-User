import React from "react";
import { Layout, Button, Card, Input, Typography } from 'antd';
import { PayCircleOutlined, ClockCircleOutlined, PictureOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import Header from "../components/Header";
import Footer from "../components/Footer";
import VoucherCard from "../components/VoucherCard";
import Flower1 from "../assets/homepic1.jpg";
import Flower2 from "../assets/homepic2.jpg";
import Flower3 from "../assets/homepic3.jpg";
import Homepic4 from "../assets/homepic4.jpg";
import Homepic5 from "../assets/homepic5.jpg";
import LatestDealBG from "../assets/latestdeal.jpg"

const { Paragraph } = Typography;

const Homepage = () => {
    const vouchers = [
        {
            title: "Happy Wedding Anniversary",
            description: "SALE UP TO 30% OFF",
            buttonText: "Learn More",
        },
        {
            title: "Happy New Year 2025",
            description: "SALE UP TO 20% OFF",
            buttonText: "Learn More",
        },
    ];

    return (
        <div className="bg-pink-50 w-full">
            <Header />
            <section className="py-16 bg-pink-100 relative h-auto">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
                    <div className="space-y-10 pl-20">
                        <h1 className="text-7xl text-left font-bold">
                            Fresh Flowers For Any Occasion
                        </h1>
                        <Paragraph className="text-gray-600 text-left text-base leading-relaxed">
                            Most flowering plants depend on animals, such as bees, moths, and butterflies, to transfer their pollen between different flowers, and have evolved to attract these pollinators.
                        </Paragraph>
                        <button className="bg-pink-600 text-white px-10 p-2 hover:bg-pink-800">
                            Learn More
                        </button>
                        <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-10">
                            <div className="text-left">
                                <h3 className="text-2xl font-bold">250+</h3>
                                <p className="text-gray-600">Customers Reviews</p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-bold">100+</h3>
                                <p className="text-gray-600">Flowers Collection</p>
                            </div>
                            <div className="text-left">
                                <h3 className="text-2xl font-bold">5+</h3>
                                <p className="text-gray-600">Locations</p>
                            </div>
                        </section>
                    </div>
                    <div className="relative w-full h-[300px] md:h-[600px]">
                        <div className="absolute top-[0px] left-[450px] z-10">
                            <img
                                src={Flower1}
                                alt="Flower 1"
                                className="rounded-lg w-[230px] h-[230px] object-contain"
                            />
                        </div>
                        <div className="absolute top-[50px] left-[120px] md:top-[130px] md:left-[230px] z-0">
                            <img
                                src={Flower2}
                                alt="Flower 2"
                                className="rounded-lg w-[350px] h-[350px] object-contain"
                            />
                        </div>
                        <div className="absolute top-[180px] left-[50px] md:top-[360px] md:left-[110px] z-10">
                            <img
                                src={Flower3}
                                alt="Flower 3"
                                className="rounded-lg w-[230px] h-[230px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white grid grid-cols-1 md:grid-cols-4 gap-6 px-10">
                <div className="text-center">
                    <PayCircleOutlined className="text-4xl text-pink-500 mb-3" />
                    <h3 className="text-lg font-bold">Easy Payment</h3>
                    <p className="text-gray-600">Fast and secure payment methods</p>
                </div>
                <div className="text-center">
                    <ClockCircleOutlined className="text-4xl text-pink-500 mb-3" />
                    <h3 className="text-lg font-bold">Delivery On Time</h3>
                    <p className="text-gray-600">Guaranteed on-time delivery</p>
                </div>
                <div className="text-center">
                    <PictureOutlined className="text-4xl text-pink-500 mb-3" />
                    <h3 className="text-lg font-bold">Real Photos</h3>
                    <p className="text-gray-600">View actual product images</p>
                </div>
                <div className="text-center">
                    <CustomerServiceOutlined className="text-4xl text-pink-500 mb-3" />
                    <h3 className="text-lg font-bold">24/7 Customer Support</h3>
                    <p className="text-gray-600">We're always here to help</p>
                </div>
            </section>


            {/* Voucher */}
            <section className="py-12 px-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vouchers.map((voucher, index) => (
                        <VoucherCard
                            key={index}
                            title={voucher.title}
                            description={voucher.description}
                            buttonText={voucher.buttonText}
                        />
                    ))}
                </div>
            </section>

            <section className="py-16 bg-white relative h-auto">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-4">
                    <div className="space-y-10 pl-20">
                        <h1 className="text-6xl text-left font-bold">
                            Create Your Perfect Floral Design
                        </h1>
                        <Paragraph className="text-gray-600 text-left text-base leading-relaxed">
                            Craft stunning flower designs tailored to your unique preferences. Choose from a wide range of blooms, styles, and personalized touches to make your bouquet truly one of a kind.
                        </Paragraph>
                        <button className="bg-pink-600 text-white px-10 p-2 hover:bg-pink-800">
                            Try It!
                        </button>
                    </div>
                    <div className="relative w-full h-[300px] md:h-[500px]">
                        <div className="absolute md:top-[0px] md:left-[150px] z-0">
                            <img
                                src={Homepic4}
                                alt="Homepic 4"
                                className="w-[500px] h-[500px] object-contain"
                            />
                        </div>
                        <div className="absolute top-[180px] left-[50px] md:top-[240px] md:left-[100px] z-10">
                            <img
                                src={Homepic5}
                                alt="Homepic 5"
                                className="w-[300px] h-[300px] object-contain"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription */}
            <section
                className="text-center py-12"
                style={{
                    backgroundImage: `url(${LatestDealBG})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <h1 className="text-5xl font-bold mb-4 mt-10">Get The Latest Deals</h1>
                <p className="text-gray-600 mb-6">Sign up now and get $10 coupon for first shopping!</p>
                <div className="inline-flex mb-10">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="border px-4 py-2"
                    />
                    <button className="bg-pink-600 text-white px-6 py-2 hover:bg-pink-800">
                        Subscribe
                    </button>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Homepage;

