import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
} from "@ionic/react";

import { bookmark, bookmarkOutline, map } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { bookmarkEvent } from "../../logic/FirestoreLogic";
import { EventData } from "../../models/EventData";

type EventsProps = {
  events: EventData[];
};

const Events: React.FC<EventsProps> = ({ events }) => {
  const { t } = useTranslation();
  return (
    <>
      {events.map((event, idx) => (
        <IonCard mode="ios" key={event.name + event.added + idx}>
          <IonCardHeader>
            <IonCardTitle>{event.name}</IonCardTitle>
            <IonCardSubtitle>
              <IonButton
                onClick={() => {
                  event.setBookmarked(true);
                  bookmarkEvent(event.documentId);
                }}
              >
                <IonIcon
                  slot="icon-only"
                  icon={event.bookmarked ? bookmark : bookmarkOutline}
                />
              </IonButton>
              <IonChip>
                <IonIcon icon={map} color="primary"></IonIcon>
                <IonLabel>{event.region}</IonLabel>
              </IonChip>
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {event.timeText && !event.fromDay && !event.toDay && (
              <p>{event.timeText}</p>
            )}
            {event.fromDay && (
              <>
                <strong>{t("events.from")}: </strong>
                {event.fromDay.toLocaleDateString()}
              </>
            )}
            {event.fromTime && (
              <>
                {t("events.at")} {event.fromTime} {t("event.time")}{" "}
              </>
            )}
            <br />

            {event.toDay && (
              <>
                <strong>{t("events.to")}: </strong>
                {event.toDay.toLocaleDateString()}
              </>
            )}
            {event.toTime && <>um {event.toTime} Uhr </>}
            <br />

            <strong>{t("event.categories")}: </strong>
            {event.categories &&
              event.categories.map((occ, idx) => (
                <IonChip outline={true} mode="ios" key={idx}>
                  <IonLabel>{occ}</IonLabel>
                </IonChip>
              ))}
            <p style={{ marginTop: "0.5em" }}>{event.description}</p>
          </IonCardContent>
        </IonCard>
      ))}
    </>
  );
};

export default Events;
