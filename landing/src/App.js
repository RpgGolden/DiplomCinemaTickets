import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context";
import HomePage from "./pages/HomePage/HomePage";
import Catalog from "./pages/Catalog/Catalog";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import "./styles/app.scss";
import Profile from "./pages/Profile/Profile";

function App() {
    return (
        <DataProvider>
            <BrowserRouter>
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile/>} />
                    </Routes>
                </main>
            </BrowserRouter>
        </DataProvider>
    );
}

export default App;
