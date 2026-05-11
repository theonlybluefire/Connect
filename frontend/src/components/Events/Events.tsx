import { useTranslation } from "react-i18next";
import { EventData } from "../../models/EventData";
import Event from "../Event/Event";

type EventsProps = {
  events: EventData[];
  bookmarkEvent: (event: EventData) => void;
};

const Events: React.FC<EventsProps> = ({ events, bookmarkEvent }) => {
  /*
    VARIABLES
  */
  const { t } = useTranslation();

  const bookmarkEventHandler = async (event: EventData) => {
    if (event.bookmarked) {
      event.setBookmarked(false);
    } else {
      event.setBookmarked(true);
    }

    await bookmarkEvent(event);
  };

  return (
    <div className="flex">
      {events.map((event, index) => (
        <Event
          event={event}
          index={index}
          bookmarkEvent={bookmarkEventHandler}
        />
      ))}
    </div>
  );
};

export default Events;
