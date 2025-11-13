import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Home() {
  const navigate = useNavigate();

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

  return (
    <div>
      <h1>Reseptisoppi</h1>
      <h2>Lisää lempireseptisi ja jaa ne ystäviesi kanssa!</h2>

    {/*Options: log in or register*/}
      <div>
        <button onClick={() => navigate("/login")}>
          Kirjaudu sisään
        </button>

        <button onClick={() => navigate("/register")}>
          Luo tunnus
        </button>
      </div>
    </div>
  );
}