import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  Database,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
} from "firebase/database";
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  QuerySnapshot,
} from "firebase/firestore";

export interface IFirebaseService {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  realtimeDb: Database;
}

export class UserService {
  public static async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(
      FirebaseService.Instance.auth,
      email,
      password
    );

    console.info(
      "UserService: User logged in successfully! User: ",
      userCredential.user
    );
  }

  public static subscribeToUserData(onDataChange: (data: any) => void) {
    const dbRef = ref(
      FirebaseService.Instance.realtimeDb,
      `users/` + FirebaseService.Instance.auth.currentUser?.uid
    );

    onValue(dbRef, (snapshot) => {
      console.debug(
        "UserService: User data changed. New data: ",
        snapshot.val()
      );

      onDataChange(snapshot.val());
    });
  }

  public static async getUserData(dataPointName: string): Promise<any> {
    const dbRef = ref(
      FirebaseService.Instance.realtimeDb,
      "users/" +
        FirebaseService.Instance.auth.currentUser?.uid +
        "/" +
        dataPointName
    );

    const snapshot = await get(dbRef);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.warn("UseService: Snapshot was not found");
      return;
    }
  }

  public static pushUserData(dataPointName: string, data: any) {
    const dbRef = ref(
      FirebaseService.Instance.realtimeDb,
      "users/" + FirebaseService.Instance.auth.currentUser?.uid
    );

    set(dbRef, { [dataPointName]: data });
  }

  public static removeUserData(dataPointName: string) {
    const dbRef = ref(
      FirebaseService.Instance.realtimeDb,
      "users/" +
        FirebaseService.Instance.auth.currentUser?.uid +
        "/" +
        dataPointName
    );

    remove(dbRef);
  }

  public static subscribeToLoginState(onStateChange: (user: any) => void) {
    FirebaseService.Instance.auth.onAuthStateChanged((user) => {
      console.debug("UserService: Auth state changed. New user: ", user);
      onStateChange(user);
    });
  }

  public static signOut() {
    FirebaseService.Instance.auth.signOut();
  }
}

export class FirestoreService {
  public static async getFirestoreDocument(
    collectionName: string,
    documentId: string
  ): Promise<DocumentSnapshot<DocumentData, DocumentData>> {
    const result = await getDoc(
      doc(FirebaseService.Instance.firestore, collectionName, documentId)
    );

    return result;
  }

  public static async getFirestoreDocuments(
    collectionName: string,
    documentIds: string[]
  ): Promise<DocumentSnapshot<DocumentData, DocumentData>[]> {
    return await Promise.all(
      documentIds.map((id) =>
        getDoc(doc(FirebaseService.Instance.firestore, collectionName, id))
      )
    );
  }

  public static async getFirestoreCollection<T>(
    collectionName: string,
    mapping: (snapshot: QuerySnapshot<DocumentData, DocumentData>) => T[]
  ) {
    const querySnapshot = await getDocs(
      collection(FirebaseService.Instance.firestore, collectionName)
    );

    return mapping(querySnapshot);
  }
}

export class FirebaseService {
  private static firebaseService: IFirebaseService;

  private constructor() {}

  private static init(): IFirebaseService {
    console.debug("FirebaseService: Initializing Firebase Service...");

    const FIREBASE_CONFIG = {
      apiKey: "AIzaSyCJOdjpTzqHaVWIzTfGGeYXn91R-AQNhaM",
      authDomain: "connectapp-e67ff.firebaseapp.com",
      databaseURL: "https://connectapp-e67ff-default-rtdb.firebaseio.com",
      projectId: "connectapp-e67ff",
      storageBucket: "connectapp-e67ff.firebasestorage.app",
      messagingSenderId: "701150268019",
      appId: "1:701150268019:web:238bc3adab17e0ad397806",
    };

    const firebaseApp = initializeApp(FIREBASE_CONFIG);

    return {
      app: firebaseApp,
      firestore: getFirestore(firebaseApp),
      auth: getAuth(firebaseApp),
      realtimeDb: getDatabase(firebaseApp),
    } as IFirebaseService;
  }

  public static get Instance(): IFirebaseService {
    if (!FirebaseService.firebaseService) {
      FirebaseService.firebaseService = this.init();
    }

    return FirebaseService.firebaseService;
  }
}
