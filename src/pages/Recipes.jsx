import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";


import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

export default function Recipes() {

  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMyRecipes() {
      setLoading(true);
      setError("");

      const { data: userData, error } = await supabase.auth.getUser();
      console.log("userData:", userData);

      const userId = userData.user.id;

      const { data, error: fetchError } = await supabase
      .from("recipes")
      .select("*")
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
  }, []);

  return (
    <div style={{ padding: "20px" }}>

      <h1>Reseptisi</h1>

      {loading && <p>Ladataan reseptejä...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {recipes.map((r) => (
          <Card key={r.id} sx={{ width: 300 }}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={r.image_url}
                alt={r.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6">
                  {r.name}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>


      <button onClick={() => navigate("/addrecipe")} style={{ marginTop: "20px" }}>
        Lisää uusi resepti
      </button>
    </div>
  );
}

