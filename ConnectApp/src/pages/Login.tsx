import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonCardSubtitle,
} from '@ionic/react';
import { useState } from 'react';
import './Login.css';
import { FirebaseApp } from 'firebase/app';
import { PagesProps } from '../models/PagesProps';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const events = [
  {
    id: 1,
    title: 'Meetup im Park',
    occurrences: [
      { date: '2025-08-25', time: '15:00' },
      { date: '2025-08-28', time: '17:00' },
    ],
    location: 'Stadtpark',
    description: 'Gemeinsames Treffen im Stadtpark mit Picknick.',
  },
  {
    id: 2,
    title: 'Tech Talk',
    occurrences: [
      { date: '2025-09-01', time: '18:30' },
    ],
    location: 'Coworking Space',
    description: 'Vortrag über neue Web-Technologien.',
  },
  {
    id: 3,
    title: 'Kinoabend',
    occurrences: [
      { date: '2025-09-10', time: '20:00' },
      { date: '2025-09-17', time: '20:00' },
    ],
    location: 'Kino Central',
    description: 'Gemeinsamer Filmabend mit Diskussion.',
  },
];

const chipLabels = [
  'Alle',
  'Meetup',
  'Tech',
  'Kino',
  'Sport',
  'Kunst',
  'Musik',
];


const Login: React.FC<PagesProps> = ({ app }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const auth = getAuth(app);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Hier kannst du z.B. den Benutzer speichern oder weiterleiten
      console.log("Angemeldet als:", user.email);
    } catch (error) {
      // Fehler abfangen und behandeln
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
              <IonLabel position="floating">E-Mail</IonLabel>
              <IonInput
                mode='ios'
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem mode='ios'>
              <IonLabel position="floating">Passwort</IonLabel>
              <IonInput
                mode='ios'
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                required
              />
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
