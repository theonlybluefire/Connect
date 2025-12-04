import { IonButton, IonContent, IonHeader, IonPage } from "@ionic/react";
import { PagesProps } from "../models/PagesProps";
import { UserService } from "../services/FirebaseService";
import "./Login.css";

const Logout: React.FC<PagesProps> = () => {
  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonButton
          mode="ios"
          expand="block"
          className="ion-margin-top"
          onClick={() => UserService.signOut()}
        >
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Logout;
