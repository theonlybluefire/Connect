import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonChip,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter
} from '@ionic/react';
import { filter } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import Events from '../components/Events';
import { getAvailableRegionNames, getEventData } from '../logic/FirestoreLogic';
import { EventData } from '../models/EventData';
import { PagesProps } from '../models/PagesProps';
import './Home.css';

const Home: React.FC<PagesProps> = ({ setLoading, auth, db, setError }) => {
  const router = useIonRouter();

  const [currentEvents, setcurrentEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const events = useRef<EventData[]>([]);
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const filterModal = useRef<HTMLIonModalElement>(null);

  //filter
  const [isFilterSet, setIsFilterSet] = useState<boolean>(false);
  const filterRegion = useRef<HTMLIonInputElement>(null);
  const filterDateFrom = useRef<HTMLIonInputElement>(null);
  const filterDateTo = useRef<HTMLIonInputElement>(null);
  const filterCategorie = useRef<HTMLIonInputElement>(null);
  //temporary categories for demo purposes
  useEffect(() => {
    setLoading(true);
    getFirebaseData().then(() => setLoading(false));

    setCategories(['Alle', 'Meetup', 'Sport', 'Tech', 'Kunst', 'Kino', 'Musik', 'Outdoor', 'Spiele', 'Bildung', 'Networking']);
  }, []);

  //get data
  const getFirebaseData = async () => {
    console.info("Getting event data");

    try {
      //get events
      events.current = await getEventData(db);

      //get available region ids
      setRegions(await getAvailableRegionNames(db));
    }
    catch (e) {
      setError("Error while loading events: " + e);
    }

    setcurrentEvents(events.current);

    console.info("Finished getting event data");
  }

  //refresh handler
  const handleRefresh = (event: CustomEvent) => {
    getFirebaseData().then(() => event.detail.complete());
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

  const filterEventList = () => {

    let region: string = filterRegion.current?.value?.toString().toLowerCase() || "";
    let dateFrom: Date | null = filterDateFrom.current?.value ? new Date(String(filterDateFrom.current?.value || "")) : null;
    let dateTo: Date | null = filterDateTo.current?.value ? new Date(String(filterDateTo.current?.value)) : null;
    let category: string = filterCategorie.current?.value?.toString().toLocaleLowerCase() || "";

    let categories: String[] = category.split(",");

    (region || category || dateTo || dateFrom) ? setIsFilterSet(true) : setIsFilterSet(false);

    //filter events based on filters defined above
    const filteredEvents = events.current.filter((event) => {
      let matches = true;
      if (region) {
        matches = matches && event.region?.toLowerCase().includes(region);
      }
      if (dateFrom && event.fromDay) {
        console.log(dateFrom)
        matches = matches && event.fromDay >= dateFrom;
      }
      if (dateTo && event.toDay) {
        matches = matches && event.toDay <= dateTo;
      }
      if (category) {
        matches = matches && event.categories?.filter((item) => categories.includes(item)).length != 0;
      }
      return matches;
    });
    setcurrentEvents(filteredEvents);
  }

  const handleTodayFastFilter = () => {
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() +1);

    const filteredEvents = events.current.filter((event) => {
      let matches = true;

      if (event.fromDay) {
        matches = matches && event.fromDay >= today;
      }
      if (event.toDay) {
        matches = matches && event.toDay <= tomorrow;
      }
      
      return matches;
    });

    setcurrentEvents(filteredEvents);

    console.log(filteredEvents);

    setIsFilterSet(true);
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
              {isFilterSet &&
                <IonBadge color="danger">1</IonBadge>
              }
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
          <IonChip onClick={handleTodayFastFilter} color={'primary'} mode='ios' style={{ flex: '0 0 auto', marginLeft: '8px' }}>
            <IonLabel>Heute</IonLabel>
          </IonChip>
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
                <IonButton strong={true} onClick={() => { filterEventList(); filterModal.current?.dismiss() }
                }>
                  bestätigen
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding" >
            <IonList mode='ios'>
              <IonItem>
                <IonLabel position="stacked">Region</IonLabel>
                <IonInput ref={filterRegion} value={filterRegion.current?.value} placeholder="nach Region suchen"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datum von</IonLabel>
                <IonInput ref={filterDateFrom} value={filterDateFrom.current?.value} type='date' placeholder="Datum von"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Datum bis</IonLabel>
                <IonInput ref={filterDateTo} value={filterDateTo.current?.value} type='date' placeholder="Datum bis"></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Kategorie</IonLabel>
                <IonInput ref={filterCategorie} value={filterCategorie.current?.value} placeholder="nach Kategorien suchen"></IonInput>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;


