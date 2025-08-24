import {
  IonContent,
  IonHeader,
  IonPage,
  IonButton,
} from '@ionic/react';
import { useState } from 'react';
import './Login.css';
import { FirebaseApp } from 'firebase/app';
import { PagesProps } from '../models/PagesProps';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



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
