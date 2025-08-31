import { IonAvatar, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFooter, IonHeader, IonItem, IonList, IonPage, IonTextarea, useIonRouter } from "@ionic/react";
import { PagesProps } from "../models/PagesProps";
import { updateProfile, User } from "firebase/auth";
import { useEffect, useRef } from "react";

const Setup: React.FC<PagesProps> = ({ setLoading,setError,  app, auth }) => {
    const router = useIonRouter();

    const user: User | null = auth.currentUser;

    const avatarSize = Math.min(window.innerWidth * 0.25, 120);

    const displayNameRef = useRef<HTMLIonTextareaElement>(null);
    const emailRef = useRef<HTMLIonTextareaElement>(null);

    const finished = () => {
        if(!user) return;

        setLoading(true);

        updateProfile(user, {
            displayName: displayNameRef.current?.value || user.displayName,
        }).then(() => {
            setLoading(false);
            router.canGoBack() ? router.goBack() : router.push('/home', 'forward', 'replace');
            
        }).catch((error) => {
            setError(error.message.toString());
            setLoading(false);
        });
    }

    return (
        <IonPage>
            <IonHeader>
            </IonHeader>
            <IonContent>
                <IonCard mode="ios">
                    <IonCardHeader className="ion-text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <IonAvatar style={{ width: avatarSize, height: avatarSize, margin: "16px auto" }}>
                            <img
                                alt="Profilbild"
                                src={user?.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </IonAvatar>
                        <IonCardTitle style={{ marginTop: 8 }}>
                            {user?.displayName || user?.email}
                        </IonCardTitle>
                        <IonCardSubtitle>Hier siehst du dein Profil ...</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList inset>
                            <IonItem>
                                <IonTextarea ref={displayNameRef} label="Name" placeholder={user?.displayName || ""}></IonTextarea>
                            </IonItem>
                            <IonItem>
                                <IonTextarea disabled ref={emailRef} label="E-Mail" placeholder={user?.email || ""}></IonTextarea>
                            </IonItem>
                        </IonList>
                    </IonCardContent>


                </IonCard>


            </IonContent>
            <IonFooter>
                <IonButton expand="block" onClick={finished}>Fertig</IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default Setup;


