import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Recipes() {

  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    async function loadMyRecipes() {
      setLoading(true);
      setError("");

      //Getting user data from supabase
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        //If user hasn't logged in, redirecting to login page
        navigate("/login");
        return;
      }

      const userId = userData.user.id;

      //Getting users recipes from supabase
      const { data, error: fetchError } = await supabase
      .from("recipes")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("owner", userId);

      if (fetchError) {
        setError("Reseptien haku epäonnistui: " + fetchError.message);
        setLoading(false);
        return;
      }

      setRecipes(data || []);
      setLoading(false);
    }

    loadMyRecipes();
  }, [navigate]);

  //Log out
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Uloskirjautuminen epäonnistui:", error.message);
    } else {
        navigate("/");
    }
  }

  return (
    <div>

      <header className="header">
        <div className="left">
          <h3>Reseptisoppi</h3>
        </div>
        <div className="right">
          <button onClick={handleLogout}>Kirjaudu ulos</button>
        </div>
      </header>

      
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

