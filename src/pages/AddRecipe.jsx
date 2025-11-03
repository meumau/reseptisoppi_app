import { useNavigate } from "react-router-dom";

export default function AddRecipe() {

    const navigate = useNavigate();

    return (
        <div>
        <button onClick={() => navigate("/recipes")}>Takaisin</button>
        <h1>Uusi resepti</h1>
        <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="text" placeholder="Reseptin nimi" required />
            <input type="text" placeholder="Valmistusohjeet" required />
            <button>Lisää resepti</button>
        </form>
        </div>
    );

}