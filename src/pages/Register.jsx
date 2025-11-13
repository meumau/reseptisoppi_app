import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Register() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  //If the user has already logged in, redirecting to recipes-page
  useEffect(() => {
    async function checkUser() {
        const { data } = await supabase.auth.getUser();
    
        if (data?.user) {
            navigate("/recipes");
            return;
        } 
    }
  
          checkUser();
  }, [navigate]);

  async function signUpNewUser(e) {

    e.preventDefault();
    setError("");

    //If password isn't same as confirm password & if password isn't 6 or more characters, error shows up

    if (password !== confirmPassword) {
      setError("Salasanat eivät täsmää.");
      return;
    }

    if (password.length < 6) {
      setError("Salasanan on oltava vähintään 6 merkkiä pitkä.");
      return;
    }

    //Signing in with Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    //If sign up doesn't succeed, error shows up
    if (signUpError) {
      setError("Tunnuksen luominen ei onnistunut");
      return;
    }

    //When the user has signed up succesfully, app navigates to recipes page
    navigate("/recipes");

  }


  return (
    <div>
      <button onClick={() => navigate("/")}>Takaisin</button>
      <h1>Luo tunnus</h1>
      <form onSubmit={signUpNewUser} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Sähköposti" required value={email} onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="Salasana" required value={password} onChange={(e) => setPassword(e.target.value)}/>
        <input type="password" placeholder="Vahvista salasana" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>

        {error && <p style={{ color: "red" }}>{error}</p>}


        <button>Rekisteröidy</button>
      </form>
    </div>
  );
}
