import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import './Home.css';
import Events from '../components/Events';
import { useEffect, useRef, useState } from 'react';
import { EventData } from '../models/EventData';
import { connectToFirebase } from '../logic/ConnectToFirebase';
import { FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, getDocs, collection, DocumentData } from "firebase/firestore";
import { PagesProps } from '../models/PagesProps';
import { mapQueryToEventData } from '../logic/Mappings';


const events = [
  {
    id: 1,
    title: 'Meetup im Park',
    occurrences: [
      { date: '2025-08-25', time: '15:00' },
      { date: '2025-08-28', time: '17:00' },
    ],
    categories: ['Meetup', 'Sport'],
    location: 'Stadtpark',
    description: 'Gemeinsames Treffen im Stadtpark mit Picknick.',
  },
  {
    id: 2,
    title: 'Tech Talk',
    occurrences: [
      { date: '2025-09-01', time: '18:30' },
    ],
    categories: ['Tech', 'Kunst'],
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
    categories: ['Kino', 'Musik'],
    description: 'Gemeinsamer Filmabend mit Diskussion.',
  },
];

const DATA_COLLECTION = "com.data.events";

const Home: React.FC<PagesProps> = ({ setLoading, app }) => {
  const [currentEvents, setcurrentEvents] = useState<EventData[]>([]);
  const events = useRef<EventData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const firebaseApp = useRef<FirebaseApp>(null);
  const firestoreDb = useRef<Firestore>(null);
  const searchbar = useRef<HTMLIonSearchbarElement>(null);

  //temporary categories for demo purposes
  useEffect(() => {
    console.log("test§)");
    getFirebaseData();
    setCategories(['Alle', 'Meetup', 'Sport', 'Tech', 'Kunst', 'Kino', 'Musik', 'Outdoor', 'Spiele', 'Bildung', 'Networking']);
  }, []);

  //get data
  const getFirebaseData = async () => {
    let eventsList: EventData[] = [];

    setLoading(true);

    //fetch event data from firestore
    firestoreDb.current = getFirestore(app);

    const querySnapshot = await getDocs(collection(firestoreDb.current, DATA_COLLECTION));
    querySnapshot.forEach((doc) => {
      eventsList.push(mapQueryToEventData(doc.data()));
    });

    console.log(eventsList);

    events.current = eventsList;
    setcurrentEvents(eventsList);

    //fetch categories from firestore
    setLoading(false);
  }


  //refresh handler
  const handleRefresh = (event: CustomEvent) => {
    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 2000);
  };

  const filterEventList = () => {
    const query = searchbar.current?.value?.toLowerCase();

    //filter events
    if (query) {
      const filteredEvents = events.current.filter((event) => {
        return event.name.toLowerCase().includes(query) ||
          (event.description && event.description.toLowerCase().includes(query)) ||
          (event.region && event.region.toLowerCase().includes(query)) ||
          (event.categories && event.categories.some(cat => cat.toLowerCase().includes(query)));
      });
      setcurrentEvents(filteredEvents);
    
    }   
  }


  return (
    <IonPage>
      <IonHeader>
      </IonHeader>
      <IonContent fullscreen>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonSearchbar ref={searchbar} onKeyDown={filterEventList} mode='ios' animated={true} placeholder="Nach Ereignissen suchen ..."></IonSearchbar>

        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            padding: '8px 0',
            gap: '8px',
            whiteSpace: 'nowrap',
          }}
        >
          {categories.map((label, idx) => (
            <IonChip mode='ios' key={idx} style={{ flex: '0 0 auto' }}>
              <IonLabel>{label}</IonLabel>
            </IonChip>
          ))}
        </div>

        <IonCard mode='ios' color="primary">
          <IonCardHeader>
            <IonCardSubtitle>Aktivität von Freunden </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Cooming soon</p>
          </IonCardContent>
        </IonCard>

        <Events events={currentEvents} />

      </IonContent>
    </IonPage>
  );
};

export default Home;


