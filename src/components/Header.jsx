import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Header() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    //Log out
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Uloskirjautuminen epäonnistui. Yritä uudelleen.");
        } else {
            setMenuOpen(false);
            navigate("/");
        }
    }

    return (
        <header className="header">
            <div className="left">
                <h3
                    onClick={() => navigate(user ? "/recipes" : "/")}
                    style={{ cursor: "pointer" }}
                >Reseptisoppi</h3>
            </div>
            <div className="right">
                <button onClick={() => setMenuOpen(!menuOpen)}> <FontAwesomeIcon icon={faUser} /> </button>

            {menuOpen && (
                user ? (
                    <button className="dropdown-menu" onClick={handleLogout}>
                        Kirjaudu ulos
                    </button>
                ) : (
                    <button className="dropdown-menu" onClick={() => navigate("/login")}>
                        Kirjaudu sisään
                    </button>
                )
            )}

            </div>
        </header>
    )

}