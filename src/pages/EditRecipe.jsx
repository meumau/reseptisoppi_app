import { useNavigate, useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function EditRecipe() {
    const navigate = useNavigate();
    const { id } = useParams(); 

    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); 

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
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
    }, [navigate]);


    useEffect(() => {
        if (!user) return;
        //Fetching recipe from database
        async function fetchRecipe() {
            const { data, error } = await supabase
                .from("recipes")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                setError("Reseptin haku epäonnistui: " + error.message);
                setLoading(false);
                return;
            }

            setRecipeName(data.name);
            setIngredients(data.ingredients || [""]);
            setInstructions(data.instructions);
            setImageUrl(data.image_url);
            setLoading(false);
        }

        fetchRecipe();
    }, [id, user]);


    //Saving the edited recipe to the database
    async function handleSubmit(e) {
        e.preventDefault();

        let newImageUrl = imageUrl;

        //If image is changed, uploading new file to the database
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from("Recipeimages")
                .upload(fileName, imageFile);

            if (uploadError) {
                setError("Kuvan lataus epäonnistui: " + uploadError.message);
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

            newImageUrl = signedUrlData.signedUrl;
        }

        //Updating content
        const { error: updateError } = await supabase
            .from("recipes")
            .update({
                name: recipeName,
                ingredients,
                instructions,
                image_url: newImageUrl,
                owner: user.id
            })
            .eq("id", id);

        if (updateError) {
            setError("Reseptin muokkaaminen epäonnistui: " + updateError.message);
            return;
        }

        navigate("/recipes");
    }

    //Setting ingredient value for the ingredient user is editing
    const handleIngredientChange = (index, value) => {
        setIngredients((prev) =>
            prev.map((ing, i) => (i === index ? value : ing))
        );
    };

    //Deleting ingredient
    const handleIngredientDelete = (index) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };


    if (loading) return <p>Ladataan reseptiä...</p>;

    return (
        <div>
            <button onClick={() => navigate("/recipes")}>Takaisin</button>
            <h1>Muokkaa reseptiä</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Reseptin nimi"
                    required
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                />

                {ingredients.map((ingredient, index) => (
                    <div key={index} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder={`Ainesosa ${index + 1}`}
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                        />
                        <IconButton color="secondary" aria-label="delete" onClick={() => handleIngredientDelete(index)}>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                ))}

                <button type="button" onClick={() => setIngredients([...ingredients, ""])}>Lisää ainesosa</button>

                <textarea
                    placeholder="Valmistusohjeet"
                    required
                    rows="5"
                    style={{ resize: "vertical", padding: "8px" }}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                ></textarea>

                <div>
                    <p>Nykyinen kuva:</p>
                    {imageUrl && <img src={imageUrl} alt="Nykyinen reseptikuva" style={{ maxWidth: "200px" }} />}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button type="submit">Tallenna muutokset</button>
            </form>



        </div>
    );
}
