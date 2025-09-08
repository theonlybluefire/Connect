import { Redirect, Route } from 'react-router-dom';
import { IonAlert, IonApp, IonLoading, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import { connectToFirebase } from './logic/ConnectToFirebase';
import { FirebaseApp } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { Firestore, getFirestore } from 'firebase/firestore';
import Logout from './pages/Logout';
import Setup from './pages/Setup';

setupIonicReact();
const app: FirebaseApp = connectToFirebase();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);


const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<number>(-1); //def. loading
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(1); //logged in 
    } else {
      setLoggedIn(0); //not logged in
    }
  });


  return (
    <IonApp>

      {loggedIn === -1 || loading && <IonLoading mode='ios' isOpen={true} />}

      {error !== "" && <IonAlert
        mode='ios'
        isOpen={error !== ""}
        header="Fehler"
        subHeader="Ein Fehler ist aufgetreten"
        message={error}
        buttons={['OK']}
        onDidDismiss={() => setError("")}
      ></IonAlert>}

      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home setError={setError} setLoading={setLoadingState} app={app} auth={auth} db={db} />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/login">
            {loggedIn === 1 && <Redirect to="/home" />}
            {loggedIn === 0 && <Login setError={setError} setLoading={setLoadingState} app={app} auth={auth} db={db} />}
          </Route>
          <Route exact path="/logout">
            {loggedIn === 1 && <Logout setError={setError} setLoading={setLoadingState} app={app} auth={auth} db={db} />}
            {loggedIn === 0 && <Redirect to="/login" />}
          </Route>
          <Route exact path="/setup">
            <Setup setError={setError} setLoading={setLoadingState} app={app} auth={auth} db={db} />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}


export default App;
