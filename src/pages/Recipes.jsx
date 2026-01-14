import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useAuth from "../hooks/useAuth";
import useRecipes from "../hooks/useRecipes";
import Header from "../components/Header";

export default function Recipes() {

  const { user, loading: authLoading } = useAuth();
  const { recipes, loading, error } = useRecipes(user?.id);
  const navigate = useNavigate();

  //Checking if user is logged in
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }


  }, [user, authLoading, navigate]);


  return (
    <div>

      <Header />

      
      <div className="recipes">
        <h1>Omat reseptit</h1>

        {loading && <p>Ladataan reseptejä...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="recipes-grid">
          <div className="recipe-card" onClick={() => navigate("/addrecipe")}>
            <div className="recipe-image-container">
              <span>+</span>
            </div>
            <div className="recipe-content">
              <h3>Lisää uusi resepti</h3>
            </div>
          </div>
          {recipes.map((r) => (
            <div key={r.id} className="recipe-card" onClick={() => navigate("/showrecipe/" + r.id)}>
              <div className="recipe-image-container">
                <img src={r.image_url} alt={r.name} className="recipe-image" />
              </div>
              <div className="recipe-content">
                <h3>{r.name}</h3>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

