import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function Login() {

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //If the user has already logged in, redirecting to recipes-page
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      navigate("/recipes");
      return;
    }

  }, [user, authLoading, navigate]);


  async function signInWithEmail(e) {

    e.preventDefault();

    setError("");

    //Signing in with Supabase Auth
    const { error: signInError } = await supabase.auth.signInWithPassword({
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
      <div className="login">
        <div className="login-topbar">
          <button type="button" onClick={() => navigate("/")}><FontAwesomeIcon icon={faArrowLeft} /></button>
        </div>
        <div className="login-container">
          <h1 style={{ fontSize: "2em" }}>Kirjaudu sisään</h1>
          <form onSubmit={signInWithEmail} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input type="email" className="login-field" placeholder="Sähköposti" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type="password" className="login-field" placeholder="Salasana" required value={password} onChange={(e) => setPassword(e.target.value)}/>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button type="submit">Kirjaudu</button>
          </form>
          <p>Eiko sinulla ole tunnuksia?</p>
          <button onClick={() => navigate("/register")}>Luo tunnus</button>
        </div>
      </div>
    </div>
  );
}
