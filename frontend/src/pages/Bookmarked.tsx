import {
  IonCard,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonPage,
  useIonRouter,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Events from "../components/Events/Events";
import { bookmarkEvent, loadBookmarkedEvents } from "../logic/FirestoreLogic";
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

  const bookmarkEventHandler = async (event: EventData) => {
    setLoading(true);

    await bookmarkEvent(event.documentId);

    setLoading(false);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="safe-area-margin-top">
        <IonHeader></IonHeader>
        <Events
          events={bookmarkedEvents}
          bookmarkEvent={bookmarkEventHandler}
        />
        {bookmarkedEvents.length === 0 && (
          <IonCard mode="ios">
            <IonCardHeader>{t("messages.nothingToShow")}</IonCardHeader>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Bookmarked;
