import { useNavigate } from "react-router-dom";

export default function Recipes() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>

      <h1>Reseptisi</h1>

      <button onClick={() => navigate("/addrecipe")} style={{ marginTop: "20px" }}>
        Lisää uusi resepti
      </button>
    </div>
  );
}

