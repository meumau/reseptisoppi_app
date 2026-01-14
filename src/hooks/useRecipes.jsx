import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function useRecipes(userId) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    async function loadRecipes() {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("owner", userId);

      if (fetchError) {
        setError("Reseptien haku epäonnistui.");
        setLoading(false);
        return;
      }

      setRecipes(data || []);
      setLoading(false);
    }

    loadRecipes();
  }, [userId]);

  return { recipes, loading, error };
}
