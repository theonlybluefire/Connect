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
import { useTranslation } from "react-i18next";
import { PagesProps } from "../models/PagesProps";
import { UserService } from "../services/FirebaseService";
import "./Login.css";

const Login: React.FC<PagesProps> = ({ setError }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: any): Promise<void> => {
    e.preventDefault();
    try {
      await UserService.login(email, password);
    } catch (error: unknown) {
      setError(t("messages.loginError") + ": " + (error as Error).message);
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard mode="ios">
          <IonCardContent mode="ios">
            <form onSubmit={handleLogin}>
              <IonItem mode="ios">
                <IonInput
                  mode="ios"
                  type="email"
                  fill="solid"
                  label={t("label.email")}
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
                  label={t("label.password")}
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
                type="submit"
              >
                {t("button.login")}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Login;
