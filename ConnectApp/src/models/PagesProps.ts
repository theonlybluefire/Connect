import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

export type PagesProps = {
    setLoading: (loading: boolean) => void
    app: FirebaseApp
    auth: Auth
    db: Firestore
};