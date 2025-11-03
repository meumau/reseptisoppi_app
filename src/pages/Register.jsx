import { useNavigate } from "react-router-dom";

export default function Register() {

  const navigate = useNavigate();


  return (
    <div>
      <button onClick={() => navigate("/")}>Takaisin</button>
      <h1>Luo tunnus</h1>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Sähköposti" required />
        <input type="password" placeholder="Salasana" required />
        <input type="password" placeholder="Vahvista salasana" required />
        <button>Rekisteröidy</button>
      </form>
    </div>
  );
}
