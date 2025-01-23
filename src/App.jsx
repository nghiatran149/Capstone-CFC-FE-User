import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Homepage from "./pages/Homepage"
import ProductPage from "./pages/ProductPage"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/product" element={<ProductPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
