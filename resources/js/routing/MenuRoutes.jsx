import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderDetail from '../pages/OrderDetail'
import AddTags from '../pages/AddTags';
import Orders from '../pages/Orders'
import Products from '../pages/Products'

const MenuRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Orders />} />
      <Route exact path="/page/orderDetail/:OrderID" element={<OrderDetail />} />
      <Route exact path="/page/product" element={<Products />} />
      {/* <Route exact path="/page/add-tag" element={<AddTags />} /> */}
    </Routes>
  )
}

export default MenuRoutes
