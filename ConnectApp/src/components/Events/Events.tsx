import { useTranslation } from "react-i18next";
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

  const bookmarkEvent = (event: EventData) => {
    if (event.bookmarked) {
      event.setBookmarked(false);
    } else {
      event.setBookmarked(true);
    }

    bookmarkEvent(event);
  };

  return (
    <>
      {events.map((event, index) => (
        <Event event={event} index={index} bookmarkEvent={bookmarkEvent} />
      ))}
    </>
  );
};

export default Events;
