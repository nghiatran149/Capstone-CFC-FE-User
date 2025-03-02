import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Homepage from "./pages/Homepage"
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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="/changepassword" element={<ChangePasswordPage />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/payment-failure" element={<PaymentFailure />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/product" element={<ProductPage />} />
                <Route path="/productdetail" element={<ProductDetail />} />
                <Route path="/productdetail/:id" element={<ProductDetail />} />
                <Route path="/userprofile" element={<UserProfile />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/customize" element={<Customize />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
