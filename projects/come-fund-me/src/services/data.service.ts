import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth'
import { environment } from '../environments/environment';


@Injectable({providedIn: 'root'})
export class DataService {
    public database: firebase.firestore.Firestore;

    constructor() {
        firebase.initializeApp(environment.firebase);
        this.database = firebase.firestore();
        this.database.enablePersistence();
    }

    authorize() {
        return new Promise((resolve, reject) => {
            if (firebase.auth().currentUser) {
                resolve();
            } else {
                firebase.auth().signInWithEmailAndPassword(environment.firebaseCredentials.email, environment.firebaseCredentials.password)
                .then(() => resolve()).catch(err => reject(err));
            }
        })
    }

}