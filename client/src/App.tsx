import { useNavigate } from "react-router";
import "./App.css";
import { useSelector } from "react-redux";
import { selectUser } from "./store/store";

function App() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  console.log(user);

  return (
    <>
      <h1 className="my-5">SSO With APIs</h1>
      {user ? (
        <div className="flex flex-col justify-center items-center">
          <h1>Logged in as {user.name}</h1>
          <img src={user.profilePictureUrl} width={80} />
        </div>
      ) : (
        <button onClick={() => navigate("/account/login/saml")}>
          Login with SSO
        </button>
      )}
    </>
  );
}

export default App;
