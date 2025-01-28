import useRequest from "../hooks/useRequest";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { setAuth, setTenants, setUser } from "../store/store";
import { useDispatch } from "react-redux";

const FE_BASE_URL = import.meta.env.VITE_FE_BASE_URL
  ? import.meta.env.VITE_FE_BASE_URL
  : "https://app-kcj0djtbjuee.frontegg.com";

export default function SamlCallback() {
  const { sendRequest, requestErrors } = useRequest();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function getUserAuth() {
    try {
      await sendRequest({
        url: `${FE_BASE_URL}/identity/resources/auth/v2/user/token/refresh`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
        onSuccess: (data) => {
          console.log(data);
          if (data.message?.errors) {
            console.error(
              `Error status ${data.statusCode}: ${data.message.errors[0]}`
            );
            // navigate("/sso");
          }
          if (data.auth && data.user && data.userTenants) {
            console.log("in if");
            dispatch(setTenants(data.userTenants));
            dispatch(setAuth(data.auth));
            dispatch(setUser(data.user));
            navigate("/");
          } else {
            alert("some error occured");
          }
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getUserAuth();
  }, []);

  return (
    <>
      <h1>Getting A New JWT...</h1>
      {requestErrors &&
        requestErrors.map((err) => (
          <p key={err.message} className="text-red-500">
            {err.message}
          </p>
        ))}
    </>
  );
}
