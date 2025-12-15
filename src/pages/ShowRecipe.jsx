import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

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

    //Log out
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Uloskirjautuminen epäonnistui:", error.message);
        } else {
            navigate("/");
        }
    }


    //Errors
    if (loading) return <p>Ladataan...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!recipe) return <p style={{ color: "red" }}>Reseptiä ei löytynyt</p>;

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

        

        <div className="show-recipe">

            <div className="show-recipe-topbar">

                <div>
                    <button onClick={() => navigate("/recipes")}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>

                <div>

                    <button onClick={() => navigate(`/editRecipe/${id}`)}>
                        <FontAwesomeIcon icon={faPen} />
                    </button>

                    <button
                    onClick={() => {
                        if (window.confirm("Poistetaanko resepti?")) deleteRecipe(id);
                    }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </button>

                </div>



            </div>
            

            <div className="show-recipe-image-container">
                <img src={recipe.image_url} alt={recipe.name} width="300" />
            </div>
            
            <div className="show-recipe-content">

                <h1>{recipe.name}</h1>

                <h3>Ainesosat:</h3>
                
                {recipe.ingredients.map((ing, i) => (
                <p key={i}>{ing}</p>
                ))}
                
                <br></br>

                <h3>Ohjeet:</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{recipe.instructions}</p>
            </div>



        </div>
        
    
    </div>
    );

}
