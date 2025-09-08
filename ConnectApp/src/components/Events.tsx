import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonChip,
    IonLabel,
    IonIcon,
} from '@ionic/react';

import { map } from 'ionicons/icons';
import { EventData } from '../models/EventData';

type EventsProps = {
    events: EventData[];
};

const Events: React.FC<EventsProps> = ({ events }) => {
    return (
        <>
            {events.map((event, idx) => (
                <IonCard mode='ios' key={event.name + event.added + idx}>
                    <IonCardHeader>
                        <IonCardTitle>{event.name}</IonCardTitle>
                        <IonCardSubtitle>
                            <IonChip>
                                <IonIcon icon={map} color="primary"></IonIcon>
                                <IonLabel>{event.region}</IonLabel>
                            </IonChip></IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        {event.timeText && !event.fromDay && !event.toDay &&
                            <p>{event.timeText}</p>
                        }
                        {event.fromDay &&
                            <>
                                <strong>Von: </strong>
                                {event.fromDay.toLocaleDateString()}
                            </>
                        }
                        {event.fromTime &&
                            <>um {event.fromTime} Uhr </>
                        }
                        <br />

                        {event.toDay &&
                            <>
                                <strong>Bis: </strong>
                                {event.toDay.toLocaleDateString()}
                            </>
                        }
                        {event.toTime &&
                            <>um {event.toTime} Uhr </>
                        }
                        <br />

                        <strong>Kategorien :</strong>
                        {event.categories &&
                            event.categories.map((occ, idx) => (
                                <IonChip outline={true} mode='ios' key={idx}>
                                    <IonLabel>{occ}</IonLabel>
                                </IonChip>
                            ))
                        }
                        <p style={{ marginTop: '0.5em' }}>{event.description}</p>
                    </IonCardContent>
                </IonCard>
            ))}
        </>
    );
};

export default Events;
