import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
} from "@ionic/react";
import { useState } from "react";
import { PagesProps } from "../models/PagesProps";
import { UserService } from "../services/FirebaseService";
import "./Login.css";

const Login: React.FC<PagesProps> = ({ setError }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await UserService.login(email, password);
    } catch (error: unknown) {
      error instanceof Error && setError(error.message.toString());
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard mode="ios">
          <IonCardContent mode="ios">
            <IonItem mode="ios">
              <IonInput
                mode="ios"
                type="email"
                fill="solid"
                label="E-Mail "
                labelPlacement="floating"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>
            <IonItem mode="ios">
              <IonInput
                mode="ios"
                type="password"
                fill="solid"
                label="Passwort"
                labelPlacement="floating"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                required
              ></IonInput>
            </IonItem>
            <IonButton
              mode="ios"
              expand="block"
              className="ion-margin-top"
              onClick={handleLogin}
            >
              Login
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
