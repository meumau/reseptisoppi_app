import './App.css'

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Recipes from "./pages/Recipes";
import AddRecipe from "./pages/AddRecipe";
import ShowRecipe from "./pages/ShowRecipe";
import EditRecipe from "./pages/EditRecipe";

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
        <Route path="/showrecipe/:id" element={<ShowRecipe />} />
        <Route path="/editrecipe/:id" element={<EditRecipe />} />
      </Routes>
    </Router>
  )
}

export default App
