import {
  IonIcon,
  IonLabel,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { bookmarkOutline, homeOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { PagesProps } from "../models/PagesProps";
import Bookmarked from "./Bookmarked";
import Home from "./Home/Home";

const AppWrapper: React.FC<PagesProps> = ({ setLoading, setError }) => {
  const { t } = useTranslation();
  /*
    VARIABLES
  */

  /*
    HOOKS
  */

  /*
    FUNCTIONS
  */

  return (
    <IonTabs>
      <IonTab tab="home">
        <Home setError={setError} setLoading={setLoading} />
      </IonTab>
      <IonTab tab="bookmarked">
        <Bookmarked setError={setError} setLoading={setLoading} />
      </IonTab>

      <IonTabBar slot="bottom">
        <IonTabButton tab="home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="bookmarked">
          <IonIcon icon={bookmarkOutline} />
          <IonLabel>{t("button.bookmarked")}</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default AppWrapper;
