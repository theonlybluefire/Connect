import { useTranslation } from "react-i18next";
import { bookmarkEvent } from "../../logic/FirestoreLogic";
import { EventData } from "../../models/EventData";
import Event from "../Event/Event";

type EventsProps = {
  events: EventData[];
};

const Events: React.FC<EventsProps> = ({ events }) => {
  /*
    VARIABLES
  */
  const { t } = useTranslation();

  const bookmarkEventHandler = (event: EventData) => {
    if (event.bookmarked) {
      event.setBookmarked(false);
    } else {
      event.setBookmarked(true);
    }

    bookmarkEvent(event.documentId);
  };

  return (
    <>
      {events.map((event, index) => (
        <Event
          event={event}
          index={index}
          bookmarkEvent={bookmarkEventHandler}
        />
      ))}
    </>
  );
};

export default Events;
