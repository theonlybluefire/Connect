import {
  IonAlert,
  IonApp,
  IonLoading,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import { useState } from "react";
//import { connectToFirebase } from "./logic/ConnectToFirebase";
import { LoginState } from "./enums";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Setup from "./pages/Setup";
import { UserService } from "./services/FirebaseService";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [loginState, setLoginState] = useState<LoginState>(LoginState.LOADING); //def. loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  };

  UserService.subscribeToLoginState((data) => {
    if (data) {
      console.debug("App: User is logged in.");
      setLoginState(LoginState.LOGGED_IN);
    } else {
      console.debug("App: User is logged out.");
      setLoginState(LoginState.LOGGED_OUT);
    }
  });

  return (
    <IonApp>
      {loginState === LoginState.LOADING ||
        (loading && <IonLoading mode="ios" isOpen={true} />)}

      {error !== "" && (
        <IonAlert
          mode="ios"
          isOpen={error !== ""}
          header="Fehler"
          subHeader="Ein Fehler ist aufgetreten"
          message={error}
          buttons={["OK"]}
          onDidDismiss={() => setError("")}
        ></IonAlert>
      )}

      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            {loginState === LoginState.LOGGED_IN && (
              <Home setError={setError} setLoading={setLoadingState} />
            )}
            {loginState === LoginState.LOGGED_OUT && <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/login">
            {loginState === LoginState.LOGGED_IN && <Redirect to="/home" />}
            {loginState === LoginState.LOGGED_OUT && (
              <Login setError={setError} setLoading={setLoadingState} />
            )}
          </Route>
          <Route exact path="/logout">
            {loginState === LoginState.LOGGED_IN && (
              <Logout setError={setError} setLoading={setLoadingState} />
            )}
            {loginState === LoginState.LOGGED_OUT && <Redirect to="/login" />}
          </Route>
          <Route exact path="/setup">
            <Setup setError={setError} setLoading={setLoadingState} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
