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
  IonAvatar,
  IonRow,
  IonCol,
  IonItem,
  useIonRouter,
  IonModal,
  IonButtons,
  IonButton,
  IonInput,
  IonList,
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
import { Router } from 'react-router';
import { filter } from 'ionicons/icons';

const DATA_COLLECTION = "com.data.events";

const Home: React.FC<PagesProps> = ({ setLoading, auth, db }) => {
  const router = useIonRouter();

  const [currentEvents, setcurrentEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const events = useRef<EventData[]>([]);
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const filterModal = useRef<HTMLIonModalElement>(null);

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

    const querySnapshot = await getDocs(collection(db, DATA_COLLECTION));
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

  const searchEventList = () => {
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
        <IonRow class="ion-align-items-center">
          <IonCol size='auto'>
            <IonChip onClick={() => router.push('/setup', 'forward', 'replace')} style={{ cursor: 'pointer' }}>
              <IonAvatar>
                <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </IonAvatar>
              <IonLabel>{auth.currentUser?.displayName || auth.currentUser?.email}</IonLabel>
            </IonChip>
          </IonCol>
          <IonCol>
            <IonSearchbar
              ref={searchbar}
              onKeyDown={searchEventList}
              mode='ios'
              animated={true}
              placeholder="Nach Ereignissen suchen ..."
            ></IonSearchbar>
          </IonCol>
          <IonCol size='auto'>
            <IonButton id="open-filter-modal" >
              <IonIcon icon={filter} slot="icon-only"></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>

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

      </IonHeader>
      <IonContent fullscreen>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>


        <IonCard mode='ios' color="primary">
          <IonCardHeader>
            <IonCardSubtitle>Aktivität von Freunden </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>Cooming soon</p>
          </IonCardContent>
        </IonCard>

        <Events events={currentEvents} />

        <IonModal mode='ios' ref={filterModal} trigger="open-filter-modal">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
              </IonButtons>
              <IonTitle>Events filtern</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => filterModal.current?.dismiss()}>
                  bestätigen
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" >
            <IonList mode='ios'>
              <IonItem>
                <IonLabel position="stacked">Region</IonLabel>
                <IonInput placeholder="nach Region suchen"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datum von</IonLabel>
                <IonInput type='date' placeholder="Datum von"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datum bis</IonLabel>
                <IonInput type='date' placeholder="Datum bis"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kategorie</IonLabel>
                <IonInput placeholder="nach Kategorien suchen"></IonInput>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;


