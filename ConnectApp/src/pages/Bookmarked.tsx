import {
  IonButton,
  IonContent,
  IonFooter,
  IonIcon,
  IonPage,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Events from "../components/Events/Events";
import { loadBookmarkedEvents } from "../logic/FirestoreLogic";
import { EventData } from "../models/EventData";
import { PagesProps } from "../models/PagesProps";
import { UserService } from "../services/FirebaseServices";
import "./Home.css";

const Bookmarked: React.FC<PagesProps> = ({ setLoading, setError }) => {
  const router = useIonRouter();
  const { t } = useTranslation();

  const [bookmarkedEvents, setBookmarkedEvents] = useState<EventData[]>([]);

  useIonViewWillEnter(() => {
    UserService.subscribeToUserData(() => {});
    loadData();
  });

  const loadData = async () => {
    setLoading(true);

    setBookmarkedEvents(await loadBookmarkedEvents());

    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Events events={bookmarkedEvents} />
      </IonContent>
      <IonFooter>
        {router.canGoBack() && (
          <IonButton expand="full" onClick={() => router.goBack()}>
            <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
          </IonButton>
        )}
      </IonFooter>
    </IonPage>
  );
};

export default Bookmarked;
