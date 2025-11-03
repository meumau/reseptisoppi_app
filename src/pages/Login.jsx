import { useNavigate } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Takaisin</button>
      <h1>Kirjaudu sisään</h1>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Sähköposti" required />
        <input type="password" placeholder="Salasana" required />
        <button>Kirjaudu</button>
      </form>
    </div>
  );
}
