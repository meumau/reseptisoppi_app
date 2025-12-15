import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faArrowLeft, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'

export default function AddRecipe() {

    const navigate = useNavigate();

    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState("");

    const PLACEHOLDER_URL = "https://grqvzebxmjnyaracmbtl.supabase.co/storage/v1/object/sign/Recipeimages/default-placeholder.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82YTRiMzk2ZS03ZDYyLTQ0NzMtOTZiMi1lMmU2ZTVlYjNiYzYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJSZWNpcGVpbWFnZXMvZGVmYXVsdC1wbGFjZWhvbGRlci5wbmciLCJpYXQiOjE3NjI1MzY2MjAsImV4cCI6MjM5MzI1NjYyMH0.klH_Mi-rq3O_yXSCpZh_uu3Wav0oZPNLi_6xLvq_RXM"
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(PLACEHOLDER_URL); 
    const [previewUrl, setPreviewUrl] = useState(PLACEHOLDER_URL);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    //Checking if the user is logged in
    useEffect(() => {
        async function checkUser() {
            const { data } = await supabase.auth.getUser();

            if (!data?.user) {
                navigate("/login");
                return;
            }

            setUser(data.user);
            setLoading(false);
        }

        checkUser();
    }, [navigate]);

    if (loading) return <p>Ladataan...</p>;
   

    //Handling the submitted form
    async function handleSubmit(e) {
        e.preventDefault();
    
        //Placeholder image
        let newImageUrl = imageUrl || PLACEHOLDER_URL;
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            const { error: uploadError } = await supabase.storage 
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

                
            newImageUrl = signedUrlData.signedUrl;
        }


        //Saving the recipe to the database
        const { error: insertError } = await supabase
            .from("recipes")
            .insert([
                {
                    name: recipeName,
                    ingredients,
                    instructions,
                    image_url: newImageUrl,
                    owner: user.id,
                }
            ]);

        if (insertError) {
            setError("Reseptin tallennus epäonnistui: " + insertError.message);
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

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="show-recipe">

                

                <form onSubmit={handleSubmit} className="edit-form">

                    <div className="show-recipe-topbar">
                    
                        <button type="button" onClick={() => navigate("/recipes")}><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <h1 style={{ fontSize: "1em" }}>Lisää resepti</h1>
                        <button type="submit"><FontAwesomeIcon icon={faFloppyDisk} /></button>
                    
                    
                    </div>

                    <div className="edit-recipe-image-container">

                        {previewUrl ? (
                            <img src={previewUrl} alt="Esikatselu" />
                        ) : (
                            imageUrl && <img src={imageUrl} alt="Nykyinen reseptikuva" />
                        )}

                        <input
                            type="file"
                            className="file-button"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setImageFile(file);

                                if (file) {
                                    const preview = URL.createObjectURL(file);
                                    setPreviewUrl(preview);
                                }
                            }}
                        />

                        
                    </div>
                    
                    <div className="show-recipe-content">

                        <h3>Reseptin nimi</h3>

                        <input type="text" className="text-field" required value={recipeName} onChange={(e) => setRecipeName(e.target.value)} />

                        <br></br><br></br>

                        <h3>Ainesosat</h3>

                        {ingredients.map((ingredient, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    className="text-field"
                                    placeholder={`Ainesosa ${index + 1}`}
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                />

                                <button onClick={() => handleIngredientDelete(index)} className="button-transparent">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                
                            </div>
                        ))}

                        <br></br>


                        <button type="button" onClick={() => setIngredients([...ingredients, ""])} style={{ margin: 0 }}>
                            Lisää ainesosa
                        </button>

                        <br></br>
                        <br></br>

                        <h3>Valmistusohjeet</h3>

                        <textarea
                        className="text-field-textarea"
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


                    </div>

                </form>

                
            </div>

        </div>
    );

}