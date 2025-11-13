import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function AddRecipe() {

    const navigate = useNavigate();

    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    //Checking if the user is logged in
    useEffect(() => {
        async function checkUser() {
        const { data } = await supabase.auth.getUser();

        if (!data?.user) {
            navigate("/login");
        } else {
            setUser(data.user); //Saving user data
            setLoading(false);
        }
        }

        checkUser();
    }, [navigate]);

    if (loading) {
        return <p>Ladataan...</p>;
    }

    //Handling the submitted form
    async function handleSubmit(e) {
        e.preventDefault();
    
        //Placeholder image
        let imageUrl = "https://grqvzebxmjnyaracmbtl.supabase.co/storage/v1/object/sign/Recipeimages/default-placeholder.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTRiMzk2ZS03ZDYyLTQ0NzMtOTZiMi1lMmU2ZTVlYjNiYzYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZWNpcGVpbWFnZXMvZGVmYXVsdC1wbGFjZWhvbGRlci5wbmciLCJpYXQiOjE3NjI1MzY2MjAsImV4cCI6MjM5MzI1NjYyMH0.klH_Mi-rq3O_yXSCpZh_uu3Wav0oZPNLi_6xLvq_RXM";

        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            const { error: uploadError } = await supabase.storage //uploadData turha?????
            .from("Recipeimages")
            .upload(fileName, imageFile);

            if (uploadError) {
                setError("Kuvan lataus epäonnistui" + uploadError.message);
                return;
            }

            //Creating URL for image (private link valid for 20 years)
            const TWENTY_YEARS = 60 * 60 * 24 * 365 * 20;
            const { data: signedUrlData, error: signedUrlError } = await supabase
                .storage
                .from("Recipeimages")
                .createSignedUrl(fileName, TWENTY_YEARS);

            if (signedUrlError) {
                setError("Kuvan URL:n luonti epäonnistui: " + signedUrlError.message);
                return;
            }

                
            imageUrl = signedUrlData.signedUrl;
        }


        //Saving the recipe to the database
        const { error: insertError } = await supabase
            .from("recipes")
            .insert([
                {
                    name: recipeName,
                    ingredients,
                    instructions,
                    image_url: imageUrl,
                    owner: user.id,
                }
            ]);

        if (insertError) {
            setError("Reseptin tallennus epäonnistui: " + insertError.message);
            return;
        }

            navigate("/recipes");
    }

    //Setting ingredient value
    const handleIngredientChange = (index, value) => {
        setIngredients((prev) =>
        prev.map((ing, i) => (i === index ? value : ing))
        );
    };


    return (
        <div>

        <button onClick={() => navigate("/recipes")}>Takaisin</button>

        <h1>Uusi resepti</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        <input type="text" placeholder="Reseptin nimi" required value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />

        {ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Ainesosa ${index + 1}`}
            value={ingredient}
            onChange={(e) => handleIngredientChange(index, e.target.value)}
          />
        ))}

        <button type="button" onClick={() => setIngredients([...ingredients, ""])}>
            Lisää ainesosa
        </button>

        <textarea
        placeholder="Valmistusohjeet"
        required
        rows="5"
        style={{ resize: "vertical", padding: "8px" }}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
            e.stopPropagation();
            }
        }}
        ></textarea>

        <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        />

        <button type="submit">Lisää resepti</button>

        </form>

        </div>
    );

}