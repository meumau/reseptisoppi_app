import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();


  //If the user has already logged in, redirecting to recipes-page
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      navigate("/recipes");
      return;
    }

  }, [user, authLoading, navigate]);


  return (
    <div>
       <Header />

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