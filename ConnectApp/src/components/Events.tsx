import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonCardSubtitle,
    IonChip,
    IonLabel,

} from '@ionic/react';
import { EventData } from '../models/EventData';

type EventsProps = {
    events: EventData[];
};

const Events: React.FC<EventsProps> = ( {events} ) => {

    return (
        <>
            {events.map(event => (
                <IonCard mode='ios' key={event.name + event.added}>
                    <IonCardHeader>
                        <IonCardTitle>{event.name}</IonCardTitle>
                        <IonCardSubtitle>{event.region}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <strong>Von:</strong>
                        {event.fromDay.toLocaleDateString()} 
                        { event.fromTime && 
                            <>um {event.fromTime} Uhr </>
                        }
                        <br/>
                        <strong>Bis:</strong>
                        {event.toDay.toLocaleDateString()} 
                        { event.toTime && 
                            <>um {event.toTime} Uhr </>
                        }
                        
                        <strong>Kategorien :</strong>
                        { event.categories && 
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
