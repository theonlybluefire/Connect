import { IonButton, IonContent, IonHeader, IonPage } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { PagesProps } from "../models/PagesProps";
import { UserService } from "../services/FirebaseServices";

const Logout: React.FC<PagesProps> = () => {
  /*
    VARIABLES
  */
  const { t } = useTranslation();

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
          {t("button.logout")}
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Logout;
