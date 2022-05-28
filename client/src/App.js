import React, { Component } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Dashboard from "./views/Dashboard";
import Home from "./views/Home";
import Login from "./views/Login";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login></Login>}></Route>
          <Route path="/create-account" element={<Home></Home>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
