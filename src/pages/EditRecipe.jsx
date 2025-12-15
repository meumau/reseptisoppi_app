import { useNavigate, useParams } from "react-router-dom"; 
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faArrowLeft, faFloppyDisk, faUser } from '@fortawesome/free-solid-svg-icons'

export default function EditRecipe() {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [menuOpen, setMenuOpen] = useState(false);

    const [recipeName, setRecipeName] = useState("");
    const [ingredients, setIngredients] = useState([""]);
    const [instructions, setInstructions] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(""); 
    const [previewUrl, setPreviewUrl] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        //Checking user
        async function checkUser() {
            const { data } = await supabase.auth.getUser();
            if (!data?.user) {
                setLoading(false);
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
                setError("Reseptin haku epäonnistui. Yritä uudelleen.");
                setLoading(false);
                return;
            }

            if (!data) {
                setError("Reseptiä ei löytynyt.");
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

        if (isSubmitting) return;
        setIsSubmitting(true);

        let newImageUrl = imageUrl;

        //If image is changed, uploading new file to the database
        if (imageFile) {
            const fileName = `${Date.now()}_${imageFile.name}`;
            const { error: uploadError } = await supabase.storage
                .from("Recipeimages")
                .upload(fileName, imageFile);

            if (uploadError) {
                setError("Kuvan lataus epäonnistui. Yritä uudelleen.");
                setIsSubmitting(false);
                return;
            }

            //Creating URL for image (private link valid for 20 years)
            const TWENTY_YEARS = 60 * 60 * 24 * 365 * 20;
            const { data: signedUrlData, error: signedUrlError } = await supabase
                .storage
                .from("Recipeimages")
                .createSignedUrl(fileName, TWENTY_YEARS);

            if (signedUrlError) {
                setError("Kuvan lataus epäonnistui. Yritä uudelleen.");
                setIsSubmitting(false);
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
            setError("Reseptin muokkaaminen epäonnistui. Yritä uudelleen.");
            setIsSubmitting(false);
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
            setError("Uloskirjautuminen epäonnistui. Yritä uudelleen.");
        } else {
            navigate("/");
        }
    }


    if (loading) return <p>Ladataan reseptiä...</p>;

 return (
        <div>

            <header className="header">
                <div className="left">
                <h3>Reseptisoppi</h3>
                </div>
                <div className="right">
                <button onClick={() => setMenuOpen(!menuOpen)}> <FontAwesomeIcon icon={faUser} /> </button>

                {menuOpen && (
                    <button className="dropdown-menu" onClick={handleLogout}>
                    Kirjaudu ulos
                    </button>
                )}
                </div>
            </header>

            
            
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="show-recipe">


                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="show-recipe-topbar">

                        <button type="button" onClick={() => navigate("/recipes")}><FontAwesomeIcon icon={faArrowLeft} /></button>
                        <h1 style={{ fontSize: "1em" }}>Muokkaa reseptiä</h1>
                        <button type="submit" disabled={isSubmitting}><FontAwesomeIcon icon={faFloppyDisk} /></button>


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


                    {/* TEKSTISISÄLTÖ */}
                    <div className="show-recipe-content">
                        <h3>Reseptin nimi</h3>
                        <input
                            type="text"
                            className="text-field"
                            placeholder="Reseptin nimi"
                            required
                            value={recipeName}
                            onChange={(e) => setRecipeName(e.target.value)}
                        />

                        <br></br><br></br>

                        <h3>Ainesosat</h3>

                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="ingredient-row">
                                <input
                                    type="text"
                                    className="text-field"
                                    placeholder={`Ainesosa ${index + 1}`}
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => handleIngredientDelete(index)} className="button-transparent">
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>

                                
                            </div>
                        ))}

                        <br></br>

                        <button type="button" onClick={() => setIngredients([...ingredients, ""])}  style={{ margin: 0 }}>
                            Lisää ainesosa
                        </button>

                        <br></br>
                        <br></br>

                        <h3>Valmistusohjeet</h3>

                        <textarea
                            className="text-field-textarea"
                            placeholder="Valmistusohjeet"
                            required
                            rows="5"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                        ></textarea>
                    </div>

                </form>
            </div>

        </div>
    );
}
