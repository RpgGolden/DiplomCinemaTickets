import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import "./styles/app.scss";
import Catalog from "./pages/Catalog/Catalog";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
function App() {

  const context = {
    valueBasic: "Home Page",
  };

  return (
    <DataContext.Provider
    value={
      context
    }
  >
    <BrowserRouter>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/catalog" element={<Catalog />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  </DataContext.Provider>
  );
}

export default App;
