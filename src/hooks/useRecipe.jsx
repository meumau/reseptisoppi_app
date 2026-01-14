import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useRecipe(recipeId) {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    useEffect(() => {
        if (!recipeId) return;

        async function fetchRecipe() {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("id", recipeId)
                .single();

            if (error) {
                setError("Reseptin näyttäminen epäonnistui.");
                setRecipe(null);
            } else {
                setRecipe(data);
            }

            setLoading(false);
        }

        fetchRecipe();
    }, [recipeId]);

    return { recipe, loading, error };
}
