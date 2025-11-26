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
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Setup from "./pages/Setup";
import { UserService } from "./services/FirebaseService";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<number>(-1); //def. loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  };

  UserService.subscribeToLoginState((data) => {
    if (data) {
      console.debug("App: User is logged in.");
      setLoggedIn(1);
    } else {
      console.debug("App: User is logged out.");
      setLoggedIn(0);
    }
  });

  return (
    <IonApp>
      {loggedIn === -1 || (loading && <IonLoading mode="ios" isOpen={true} />)}

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
            {loggedIn === 1 && (
              <Home setError={setError} setLoading={setLoadingState} />
            )}
            {loggedIn === 0 && <Redirect to="/login" />}
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/login">
            {loggedIn === 1 && <Redirect to="/home" />}
            {loggedIn === 0 && (
              <Login setError={setError} setLoading={setLoadingState} />
            )}
          </Route>
          <Route exact path="/logout">
            {loggedIn === 1 && (
              <Logout setError={setError} setLoading={setLoadingState} />
            )}
            {loggedIn === 0 && <Redirect to="/login" />}
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
