import './App.css'

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/addrecipe" element={<AddRecipe />} />
      </Routes>
    </Router>
  )
}

export default App
