import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
} from '@ionic/react';
import './Login.css';
import { PagesProps } from '../models/PagesProps';

const Logout: React.FC<PagesProps> = ({ app , auth}) => {

  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonButton mode='ios' expand="block" className="ion-margin-top" onClick={() => auth.signOut()}>
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Logout;
