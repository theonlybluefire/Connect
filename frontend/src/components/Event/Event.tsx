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

import {
  bookmark,
  bookmarkOutline,
  calendarOutline,
  folder,
  globeOutline,
  map,
  timeOutline,
} from "ionicons/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EventData } from "../../models/EventData";
import "./Event.css";

type EventProps = {
  event: EventData;
  index?: number;
  bookmarkEvent: (event: EventData) => Promise<void>;
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
            <IonChip>
              <IonIcon icon={calendarOutline} />
              <IonLabel>
                {event.fromDay &&
                event.toDay &&
                event.fromDay.toDateString() != event.toDay.toDateString() ? (
                  <>
                    {event.fromDay?.toLocaleDateString()} -{" "}
                    {event?.toDay?.toLocaleDateString()}
                  </>
                ) : event.fromDay ? (
                  event.fromDay.toLocaleDateString()
                ) : (
                  event.timeText
                )}
              </IonLabel>
            </IonChip>
            {(event.fromTime && event.toTime) ||
              (event.fromTime && (
                <IonChip>
                  <IonIcon icon={timeOutline} />
                  <IonLabel>
                    {event.fromTime && event.toTime ? (
                      <>
                        {event.fromTime} - {event.toTime}
                      </>
                    ) : (
                      event.fromTime
                    )}
                  </IonLabel>
                </IonChip>
              ))}

            <IonChip>
              <IonIcon icon={map} color="primary"></IonIcon>
              <IonLabel>{event.region}</IonLabel>
            </IonChip>
            {event.categories?.map((cat) => (
              <IonChip>
                <IonIcon icon={folder}></IonIcon>
                <IonLabel>{cat}</IonLabel>
              </IonChip>
            ))}
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <p style={{ marginTop: "0.5em" }}>{event.description}</p>
          <br />
          <i>
            {t("event.added")}: {event.added.toLocaleDateString()}{" "}
            {event.added.toLocaleTimeString()}
          </i>
        </IonCardContent>
        <IonButton
          data-testid="bookmark"
          fill="clear"
          className={"connect-save-button " + (bookmarked ? "is-saved" : "")}
          onClick={async () => {
            await bookmarkEvent(event);
            setBookmarked(event.bookmarked);
          }}
        >
          <IonIcon
            slot="start"
            icon={bookmarked ? bookmark : bookmarkOutline}
          />
          {t("event.bookmark")}
        </IonButton>
        {event.website && (
          <IonButton
            data-testid="bookmark"
            fill="clear"
            onClick={() => {
              bookmarkEvent(event);
              setBookmarked(event.bookmarked);
            }}
          >
            <IonIcon slot="start" icon={globeOutline} />
            {t("event.toWebsite")}
          </IonButton>
        )}
      </IonCard>
    </>
  );
};

export default Event;
