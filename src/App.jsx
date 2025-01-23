import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage"
import ProductPage from "./pages/ProductPage"

function App() {
  return (
      <BrowserRouter>
          <Routes>
              <Route path="/home" element={<Homepage />} />
              <Route path="/product" element={<ProductPage />} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;
