import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function ShowRecipe() {
    const { id } = useParams();
    const navigate = useNavigate(); 


    const [recipe, setRecipe] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        //Checking user
        async function checkUser() {
            const { data } = await supabase.auth.getUser();
            if (!data?.user) {
                navigate("/login");
                return;
            }
            setUser(data.user);
        }

        checkUser();
    }, []);

    useEffect(() => {
        //Fetching recipe from database
        async function fetchRecipe() {
            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError(`Reseptin näyttäminen ei onnistu: ${error.message}`);
            } else {
                setRecipe(data);
            }

            setLoading(false);
        }

        if (user) fetchRecipe();
    }, [user, id]);

    //Deleting the recipe
    async function deleteRecipe(recipeId) {
        const { data, error } = await supabase
        .from("recipes")      
        .delete()             
        .eq("id", recipeId)
        .eq("owner", user.id);

        if (error) {
            console.error("Poisto epäonnistui:", error.message);
            return;
        }

        navigate("/recipes");
    }


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

        <button
        onClick={() => {
            if (window.confirm("Poistetaanko resepti?")) deleteRecipe(id);
        }}
        >
        Poista resepti
        </button>

        <button onClick={() => navigate(`/editRecipe/${id}`)}>
            Muokkaa reseptiä
        </button>
        
    
    </div>
    );

}
