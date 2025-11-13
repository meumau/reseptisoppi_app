import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ShowRecipe() {
    const { id } = useParams();
    const navigate = useNavigate(); 


    const [recipe, setRecipe] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState("");

    //Fetching recipe from database
    useEffect(() => {
        async function fetchRecipe() {

        const { data, error } = await supabase
            .from("recipes")
            .select("*")
            .eq("id", id) 
            .single(); 

        if (error) {
            console.error(error);
            setError(`Reseptin näyttäminen ei onnistu: ${error.message}`);
            setLoading(false);
            return;
        }

        setRecipe(data); 
        setLoading(false); 
        }

        fetchRecipe();
    }, [id]); 

    //Errors
    if (loading) return <p>Ladataan...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!recipe) return <p style={{ color: "red" }}>Reseptiä ei löytynyt</p>;

    return (
    <div style={{ padding: "20px" }}>

        <button onClick={() => navigate("/recipes")}>Takaisin resepteihin</button>

        <h1>{recipe.name}</h1>

        {recipe.image_url && (
        <img src={recipe.image_url} alt={recipe.name} width="300" />
        )}

        <h3>Ainesosat:</h3>
        <ul>
        {recipe.ingredients.map((ing, i) => (
        <li key={i}>{ing}</li>
        ))}
        </ul>

        <h3>Ohjeet:</h3>
        <p>{recipe.instructions}</p>
        
    
    </div>
    );

}
