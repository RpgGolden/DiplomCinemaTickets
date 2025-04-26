import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import DataContext from "./context";
import "./styles/app.scss"
import Login from "./pages/Auth/Login/Login";
import AdminPage from "./pages/AdminPage/AdminPage";
import Users from "./modules/AdminPageModule/Users/Users";
import Movies from "./modules/AdminPageModule/Movies/Movies";
import Sessions from "./modules/AdminPageModule/Sessions/Sessions";
import Halls from "./modules/AdminPageModule/Halls/Halls";
import Promotions from "./modules/AdminPageModule/Promotions/Promotions";
import Requests from "./modules/AdminPageModule/Requests/Requests";
import TypePlace from "./modules/AdminPageModule/TypePlace/TypePlace";
import News from "./modules/AdminPageModule/News/News";
import Posters from "./modules/AdminPageModule/Posters/Posters";
import Register from "./pages/Auth/Register/Register";
function App() {
  const context = {
   
  }

  return (
    <DataContext.Provider value={context}>
    <BrowserRouter>
      <main>
        <Routes>
        <Route path="/adminPage/*" element={<AdminPage />}>
          <Route path="request" element={<Requests/>} ></Route>
          <Route path="users" element={<Users/>} ></Route>
          <Route path="movies" element={<Movies/>} ></Route>
          <Route path="sessions" element={<Sessions/>} ></Route>
          <Route path="halls" element={<Halls/>} ></Route>
          <Route path="promotions" element={<Promotions/>} ></Route>
          <Route path="typePlace" element={<TypePlace/>} ></Route>
          <Route path="news" element={<News/>} ></Route>
          <Route path="posters" element={<Posters/>} ></Route>
        </Route>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/SecretRegister" element={<Register/>}></Route>
        </Routes>
      </main>
    </BrowserRouter>
  </DataContext.Provider>
  );
}

export default App;
