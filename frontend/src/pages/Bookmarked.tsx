import {
  IonButton,
  IonCard,
  IonCardHeader,
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

const Bookmarked: React.FC<PagesProps> = ({ setLoading, setError }) => {
  /*
    VARIABLES
  */
  const router = useIonRouter();
  const { t } = useTranslation();

  const [bookmarkedEvents, setBookmarkedEvents] = useState<EventData[]>([]);

  /*
    HOOKS
  */
  useIonViewWillEnter(() => {
    loadData();
  });

  /* 
    FUNCTIONS 
  */
  const loadData = async () => {
    setLoading(true);

    try {
      setBookmarkedEvents(await loadBookmarkedEvents());
    } catch (error: unknown) {
      setError(t("messages.generalError") + ": " + (error as Error).message);
    }

    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <Events events={bookmarkedEvents} />
        {bookmarkedEvents.length === 0 && (
          <IonCard mode="ios">
            <IonCardHeader>{t("messages.nothingToShow")}</IonCardHeader>
          </IonCard>
        )}
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
