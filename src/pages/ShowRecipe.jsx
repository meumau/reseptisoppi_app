import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import useAuth from "../hooks/useAuth";
import useRecipe from "../hooks/useRecipe";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Header from "../components/Header";

export default function ShowRecipe() {

    const { id } = useParams();
    const navigate = useNavigate();

    const { user, loading: authLoading } = useAuth();
    const { recipe, loading, error } = useRecipe(id);

    //Checking if user is logged in
    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login");
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        //Fetching recipe from database
        async function fetchRecipe() {
            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError("Reseptin näyttäminen epäonnistui. Yritä uudelleen.");
            } else {
                setRecipe(data);
            }

            setLoading(false);
        }

        if (user) fetchRecipe();
    }, [user, id]);

    //Deleting the recipe
    async function deleteRecipe(recipeId) {
        if (!user) return;

        const { error } = await supabase
            .from("recipes")
            .delete()
            .eq("id", recipeId)
            .eq("owner", user.id);

        if (error) {
            console.error("Reseptin poisto epäonnistui");
            return;
        }

        navigate("/recipes");
    }

    //Loading
    if (authLoading || loading) {
        return <p>Ladataan...</p>;
    }


    return (
    <div>

        <Header />

        {recipe ? (
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
        ) : (
            <p style={{ color: "red" }}>{error}</p>
        )}

       
    </div>
    );

}
