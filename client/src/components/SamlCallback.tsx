import useRequest from "../hooks/useRequest";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setAuth, setTenants, setUser } from "../store/store";
import { useDispatch } from "react-redux";

const FE_BASE_URL =
  import.meta.env.VITE_FE_BASE_URL ?? "https://auth.sabich.life";

export default function SamlCallback() {
  const { sendRequest, statusCode, requestErrors } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function getUserAuth() {
      try {
        await sendRequest({
          url: `${FE_BASE_URL}/identity/resources/auth/v2/user/token/refresh`,
          method: "POST",
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          onSuccess: (data) => {
            if (data.auth && data.user && data.userTenants) {
              console.log("in if");
              dispatch(setTenants(data.userTenants));
              dispatch(setAuth(data.auth));
              dispatch(setUser(data.user));
              navigate("/");
            }
          },
        });
      } catch (err) {
        console.error(err);
      }
    }
    getUserAuth();
  }, []);

  return (
    <>
      <h2 className="text-2xl">Getting A New JWT...</h2>
      <h3 className="font-bold text-red-500">{statusCode}</h3>
      {requestErrors &&
        requestErrors.map((err) => (
          <p key={err.message} className="text-red-500">
            {err.message}
          </p>
        ))}
      <button className="mt-5" onClick={() => navigate("/account/login/saml")}>
        Back to Login
      </button>
    </>
  );
}
