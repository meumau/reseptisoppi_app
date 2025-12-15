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
       <header className="header">
        <div className="left">
          <h3>Reseptisoppi</h3>
        </div>
        <div className="right">
          <button onClick={() => navigate("/login")}> Kirjaudu sisään </button>
        </div>
      </header>

      <div className="frontpage">

        <div className="frontpage-container">

          <h2>Pidä lempireseptisi tallessa</h2>

          <button onClick={() => navigate("/register")}>
            Luo tunnus
          </button>

        </div>
        <div className="frontpage-gradient"></div>

      </div>

              <p className="footertext">© Reseptisoppi 2025</p>

    </div>
  );
}