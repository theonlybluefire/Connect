import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { bookmark, filter } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Events from "../../components/Events/Events";
import {
  getCategoryNames,
  getEventData,
  getRegionData,
} from "../../logic/FirestoreLogic";
import { EventData } from "../../models/EventData";
import { PagesProps } from "../../models/PagesProps";
import { RegionData } from "../../models/RegionData";
import { FirebaseService } from "../../services/FirebaseServices";
import "./Home.css";

const Home: React.FC<PagesProps> = ({ setLoading, setError }) => {
  /*
    VARIABLES
  */
  const router = useIonRouter();
  const { t } = useTranslation();

  const [currentEvents, setCurrentEvents] = useState<EventData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [regions, setRegions] = useState<RegionData[]>([]);

  const events = useRef<EventData[]>([]);
  const searchbar = useRef<HTMLIonSearchbarElement>(null);
  const filterModal = useRef<HTMLIonModalElement>(null);

  const [isFilterSet, setIsFilterSet] = useState<boolean>(false);
  const [fastFilter, setFastFilter] = useState<number>(0); //0 = no filter, 1 = todays fast filter, above = category filter in order
  const filterRegion = useRef<HTMLIonInputElement>(null);
  const filterDateFrom = useRef<HTMLIonInputElement>(null);
  const filterDateTo = useRef<HTMLIonInputElement>(null);
  const filterCategorie = useRef<HTMLIonInputElement>(null);

  /*
    HOOKS
  */
  useEffect(() => {
    setLoading(true);
    getFirebaseData().then(() => setLoading(false));
  }, []);

  /*
    FUNCTIONS
  */
  const getFirebaseData = async () => {
    try {
      events.current = await getEventData();

      setCategories(await getCategoryNames());
      setRegions(await getRegionData());
      setCurrentEvents(events.current);
    } catch (e) {
      setError(t("messages.generalError") + e);
    }
  };

  const handleRefresh = (event: CustomEvent) => {
    getFirebaseData().then(() => event.detail.complete());
  };

  const searchEventList = () => {
    const query = searchbar.current?.value?.toLowerCase();

    //filter events
    if (query) {
      const filteredEvents = events.current.filter((event) => {
        return (
          event.name.toLowerCase().includes(query) ||
          (event.description &&
            event.description.toLowerCase().includes(query)) ||
          (event.region && event.region.toLowerCase().includes(query)) ||
          (event.categories &&
            event.categories.some((cat) => cat.toLowerCase().includes(query)))
        );
      });
      setCurrentEvents(filteredEvents);
    }
  };

  const filterEventList = () => {
    let region: string =
      filterRegion.current?.value?.toString().toLowerCase() || "";
    let dateFrom: Date | null = filterDateFrom.current?.value
      ? new Date(String(filterDateFrom.current?.value || ""))
      : null;
    let dateTo: Date | null = filterDateTo.current?.value
      ? new Date(String(filterDateTo.current?.value))
      : null;
    let category: string =
      filterCategorie.current?.value?.toString().toLocaleLowerCase() || "";

    let categories: String[] = category.split(",");

    region || category || dateTo || dateFrom
      ? setIsFilterSet(true)
      : setIsFilterSet(false);

    const filteredEvents = events.current.filter((event) => {
      let matches = true;
      if (region) {
        matches = matches && event.region?.toLowerCase().includes(region);
      }
      if (dateFrom && event.fromDay) {
        console.log(dateFrom);
        matches = matches && event.fromDay >= dateFrom;
      }
      if (dateTo && event.toDay) {
        matches = matches && event.toDay <= dateTo;
      }
      if (category) {
        matches =
          matches &&
          event.categories?.filter((item) => categories.includes(item))
            .length != 0;
      }
      return matches;
    });
    setCurrentEvents(filteredEvents);
  };

  const resetFilters = () => {
    setCurrentEvents(events.current);
    setIsFilterSet(false);
    filterRegion.current!.value = "";
    filterDateFrom.current!.value = "";
    filterDateTo.current!.value = "";
    filterCategorie.current!.value = "";
  };

  const handleTodayFastFilter = () => {
    if (fastFilter == 1) {
      //reset filter
      setCurrentEvents(events.current);
      setIsFilterSet(false);
      setFastFilter(0);
      return;
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const filteredEvents = events.current.filter((event) => {
      let matches = true;

      if (event.fromDay) {
        matches = matches && event.fromDay >= today;
      }
      if (event.toDay) {
        matches = matches && event.toDay <= tomorrow;
      }

      return matches;
    });

    setCurrentEvents(filteredEvents);

    setFastFilter(1);
  };

  return (
    <IonPage>
      <IonHeader translucent={true} mode="ios">
        <IonRow class="ion-align-items-center">
          <IonCol size="auto">
            <IonChip
              onClick={() => router.push("/setup", "forward", "replace")}
              style={{ cursor: "pointer" }}
            >
              <IonAvatar>
                <img
                  alt="Silhouette of a person's head"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <IonLabel>
                {FirebaseService.Instance.auth.currentUser?.displayName ||
                  FirebaseService.Instance.auth.currentUser?.email}
              </IonLabel>
            </IonChip>
          </IonCol>
          <IonCol>
            <IonSearchbar
              ref={searchbar}
              onKeyDown={searchEventList}
              mode="ios"
              animated={true}
              placeholder={t("placeholders.search")}
            ></IonSearchbar>
          </IonCol>
          <IonCol size="auto">
            <IonButton id="open-filter-modal" mode="md">
              <IonIcon icon={filter} slot="icon-only"></IonIcon>
              {isFilterSet && (
                <IonBadge
                  color="danger"
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-1px",
                    fontSize: "0.75em",
                    zIndex: 999999,
                  }}
                >
                  1
                </IonBadge>
              )}
            </IonButton>
          </IonCol>
          <IonCol size="auto">
            <IonButton routerLink="/bookmarked" mode="md">
              <IonIcon slot="icon-only" icon={bookmark}></IonIcon>
            </IonButton>
          </IonCol>
        </IonRow>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "8px 0",
            gap: "8px",
            whiteSpace: "nowrap",
          }}
        >
          <IonChip
            className={fastFilter == 1 ? "animated-gradient" : ""}
            onClick={handleTodayFastFilter}
            color={fastFilter == 1 ? "" : "primary"}
            mode="ios"
            style={{ flex: "0 0 auto", marginLeft: "8px" }}
          >
            <IonLabel>{t("label.today")}</IonLabel>
          </IonChip>
          {categories.map((label, idx) => (
            <IonChip mode="ios" key={idx} style={{ flex: "0 0 auto" }}>
              <IonLabel>{label}</IonLabel>
            </IonChip>
          ))}
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <Events events={currentEvents} />
        <IonModal mode="ios" ref={filterModal} trigger="open-filter-modal">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start"></IonButtons>
              <IonTitle>Events filtern</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  strong={true}
                  onClick={() => {
                    filterEventList();
                    filterModal.current?.dismiss();
                  }}
                >
                  {t("button.confirm")}
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonList mode="ios">
              <IonItem>
                <IonLabel position="stacked">{t("label.region")}</IonLabel>
                <IonInput
                  ref={filterRegion}
                  value={filterRegion.current?.value}
                  placeholder="nach Region suchen"
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  {t("label.date")} {t("event.from")}
                </IonLabel>
                <IonInput
                  ref={filterDateFrom}
                  value={filterDateFrom.current?.value}
                  type="date"
                  placeholder={t("label.date") + " " + t("event.from")}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  {t("label.date")} {t("event.to")}
                </IonLabel>
                <IonInput
                  ref={filterDateTo}
                  value={filterDateTo.current?.value}
                  type="date"
                  placeholder={t("label.date") + " " + t("event.to")}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{t("event.categories")}</IonLabel>
                <IonInput
                  ref={filterCategorie}
                  value={filterCategorie.current?.value}
                  placeholder={t("placeholders.search")}
                ></IonInput>
              </IonItem>
            </IonList>
            <IonButton expand="block" color="danger" onClick={resetFilters}>
              {t("button.reset")}
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Home;
