import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function signInWithEmail(e) {

    e.preventDefault();

    setError("");

    //Signing in with Supabase Auth
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //If the user writes wrong email or password, this error shows up
    if (signInError) {
      setError("Virheelliset kirjautumistiedot");
      return;
    }

   //When signing in is complete, app navigates to recipes page
    navigate("/recipes");
    
  }

  return (
    <div>
      <button onClick={() => navigate("/")}>Takaisin</button>
      <h1>Kirjaudu sisään</h1>
      <form onSubmit={signInWithEmail} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Sähköposti" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Salasana" required value={password} onChange={(e) => setPassword(e.target.value)}/>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button>Kirjaudu</button>
      </form>
    </div>
  );
}
