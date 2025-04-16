import React, { useState } from "react";
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    message,
    Card,
    Typography,
    Divider,
    Space
} from "antd";
import { UploadOutlined, SendOutlined, PictureOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";

const { Title, Text } = Typography;
const { TextArea } = Input;


const Customize2 = () => {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();


    const handleImageUpload = (info) => {
        if (info.file.status === "uploading") {
            setLoading(true);
            return;
        }
        if (info.file.status === "done") {
            getBase64(info.file.originFileObj, (url) => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };
    
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const beforeUpload = (file) => {
        const isImage = file.type.startsWith("image/");
        if (!isImage) {
            message.error("You can only upload image files!");
        }
        return isImage;
    };

    const handleDeleteImage = () => {
        setImageUrl(null);
        message.success("Image deleted successfully!");
    };

    const onFinish = (values) => {
        if (!imageUrl && !values.description && !values.price) {
            message.info("Please provide at least one piece of information about your bouquet!");
            return;
        }

        message.success("Your request has been sent successfully!");
        console.log("Form values:", { ...values, imageUrl });

    };

    const dummyRequest = ({ onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    return (
        <div className="w-full bg-pink-50">
            <div className="flex ml-20 py-10">
                <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    className="bg-pink-300 text-white text-lg px-6 py-5 rounded-md shadow-md"
                    onClick={() => navigate(-1)}
                >
                    BACK
                </Button>
            </div>
            <h1 className="text-center text-6xl font-bold text-pink-600 p-3 rounded">Share Your Idea</h1>
            <p className="text-xl text-gray-500 mb-10 text-center">Describe your dream bouquet or upload a photo—our florists will bring it to life.</p>

            <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg mx-10 mb-20 p-10 gap-6">

                {/* Picture Part */}
                <div className="w-full md:w-1/2 flex flex-col p-6">
                    <Card className="flex-grow flex flex-col items-center justify-center overflow-hidden">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt="Sample bouquet image"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 w-64 text-gray-400 border-2 border-dashed border-gray-300 rounded-md">
                                <PictureOutlined style={{ fontSize: 48 }} />
                                <Text className="mt-2">Sample bouquet image</Text>
                            </div>
                        )}
                    </Card>

                    <div className="mt-4 flex gap-2">
                        <Upload
                            name="flowerImage"
                            listType="text"
                            showUploadList={false}
                            customRequest={dummyRequest}
                            beforeUpload={beforeUpload}
                            onChange={handleImageUpload}
                            className="flex-1"
                        >
                            <Button
                                icon={<UploadOutlined />}
                                loading={loading}
                                className="w-full"
                                size="large"
                            >
                                Upload sample bouquet image
                            </Button>
                        </Upload>
                        
                        <Button
                            icon={<DeleteOutlined />}
                            onClick={handleDeleteImage}
                            className="w-40"
                            size="large"
                            danger
                            disabled={!imageUrl}
                        >
                            Delete image
                        </Button>
                    </div>
                </div>

                {/* Description Part */}
                <div className="w-full md:w-1/2 p-6">
                    <h1 className="text-center text-3xl font-bold text-pink-600 p-3 rounded">Bouquet Information</h1>
                    <Text className="text-gray-500 mb-4 block">
                        Please provide more information about the bouquet you would like to order. All fields are optional.
                    </Text>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >

                        <Form.Item name="price" label="Estimated budget (VND)">
                            <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Ex: 500,000"
                                className="w-full"
                            />
                        </Form.Item>

                        <Form.Item name="occasion" label="Occasion">
                            <Input
                                placeholder="Ex: Birthday, Anniversary, Love..."
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="mainColor" label="Main Color">
                                <Input
                                    placeholder="Ex: Red, Pink, Pastel..."
                                />
                            </Form.Item>

                            <Form.Item name="flowerType" label="Flower Type">
                                <Input
                                    placeholder="Ex: Rose, Sunflower, Lily..."
                                />
                            </Form.Item>
                        </div>

                        <Form.Item name="card" label="Card">
                            <Input placeholder="Card content (if any)" />
                        </Form.Item>

                        <Form.Item name="description" label="Description">
                            <TextArea
                                rows={4}
                                placeholder="Describe in detail the bouquet you desire, any special requests or additional information."
                            />
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                icon={<SendOutlined />}
                                size="large"
                                className="bg-pink-400 text-white text-xl px-8 py-6 rounded-md"
                            >
                                Send Request
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default Customize2;