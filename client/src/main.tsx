import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Route, Routes } from "react-router";
import LoginWithCustomSSO from "./components/loginWithCustomSSO.tsx";
import SamlCallback from "./components/SamlCallback.tsx";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/account/login/saml" element={<LoginWithCustomSSO />} />
        <Route path="/saml/callback" element={<SamlCallback />} />
        <Route path="*" element={<App />}></Route>
      </Routes>
    </Router>
  </Provider>
);
