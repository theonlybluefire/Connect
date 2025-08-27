import {
  IonContent,
  IonHeader,
  IonPage,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import { useState } from 'react';
import './Login.css';
import { PagesProps } from '../models/PagesProps';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";


const Login: React.FC<PagesProps> = ({ app }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Angemeldet als:", user.email);
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
    }

  };

  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard mode='ios'>
          <IonCardContent mode='ios'>
            <IonItem mode='ios'>
              <IonInput
                mode='ios'
                type="email"
                fill="solid"
                label="E-Mail "
                labelPlacement="floating"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>
            <IonItem mode='ios'>
              <IonInput
                mode='ios'
                type="password"
                fill="solid"
                label="Passwort"
                labelPlacement="floating"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>
            <IonButton mode='ios' expand="block" className="ion-margin-top" onClick={handleLogin}>
              Login
            </IonButton>
          </IonCardContent>
        </IonCard>

      </IonContent>
    </IonPage>
  );
};

export default Login;
