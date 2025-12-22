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
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EventData } from "../../models/EventData";

type EventProps = {
  event: EventData;
  index?: number;
  bookmarkEvent: (event: EventData) => void;
};

const Event: React.FC<EventProps> = ({ event, index, bookmarkEvent }) => {
  /*
    VARIABLES
  */
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState<boolean>(event.bookmarked);

  return (
    <>
      <IonCard mode="ios" key={event.name + event.added + (index ? index : "")}>
        <IonCardHeader>
          <IonCardTitle>{event.name}</IonCardTitle>
          <IonCardSubtitle>
            <IonButton
              data-testid="bookmark"
              onClick={() => {
                bookmarkEvent(event);
                setBookmarked(event.bookmarked);
              }}
            >
              <IonIcon
                slot="icon-only"
                icon={bookmarked ? bookmark : bookmarkOutline}
              />
            </IonButton>
            <IonChip>
              <IonIcon icon={map} color="primary"></IonIcon>
              <IonLabel>{event.region}</IonLabel>
            </IonChip>{" "}
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
    </>
  );
};

export default Event;
