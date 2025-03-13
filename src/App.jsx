import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Homepage from "./pages/Homepage"
import AboutUs from './pages/AboutUs';
import ProductPage from "./pages/ProductPage"
import ProductDetail from "./pages/ProductDetail"
import UserProfile from "./pages/UserProfile"
import WalletPage from "./pages/Wallet"
import ShoppingCart from "./pages/ShoppingCart"
import Checkout from "./pages/Checkout"
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import Customize from "./pages/Customize"
import PaymentSuccess from "./pages/PaymentSuccess"
import PaymentFailure from "./pages/PaymentFailure"
import CheckoutCustom from "./pages/CheckoutCustom"
import CheckoutCart from "./pages/CheckoutCart"
import HistoryOrder from "./pages/HistoryOrder"
import Wallet2Page from "./pages/Wallet2"

import Layout from "./components/Layout"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="/changepassword" element={<ChangePasswordPage />} />

                <Route path="/home" element={<Layout><Homepage /></Layout>} />
                <Route path="/about" element={<Layout><AboutUs /></Layout>} />
                <Route path="/product" element={<Layout><ProductPage /></Layout>} />
                <Route path="/productdetail" element={<Layout><ProductDetail /></Layout>} />
                <Route path="/productdetail/:id" element={<Layout><ProductDetail /></Layout>} />
                <Route path="/userprofile" element={<Layout><UserProfile /></Layout>} />
                <Route path="/wallet" element={<Layout><WalletPage /></Layout>} />
                <Route path="/wallet2" element={<Layout><Wallet2Page /></Layout>} />

                <Route path="/cart" element={<Layout><ShoppingCart /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/checkout-custom" element={<Layout><CheckoutCustom /></Layout>} />
                <Route path="/checkout-cart" element={<Layout><CheckoutCart /></Layout>} />
                <Route path="/customize" element={<Layout><Customize /></Layout>} />
                <Route path="/payment-success" element={<Layout><PaymentSuccess /></Layout>} />
                <Route path="/payment-failure" element={<Layout><PaymentFailure /></Layout>} />
                <Route path="/history-order" element={<Layout><HistoryOrder /></Layout>} />

                <Route path="/" element={<Layout><Homepage /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;