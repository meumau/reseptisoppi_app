import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Reseptisoppi</h1>
      <h2>Lisää lempireseptisi ja jaa ne ystäviesi kanssa!</h2>

    {/*Vaihtoehdot: kirjaudu sisään tai luo tunnus*/}
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