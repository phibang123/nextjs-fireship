import  'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import firebase from 'firebase/compat/app'

const firebaseConfig = {
  apiKey: "AIzaSyBr1isJBeMXDiCHfxAolmpJORKGy2GEU5s",
  authDomain: "text-bde78.firebaseapp.com",
  projectId: "text-bde78",
  storageBucket: "text-bde78.appspot.com",
  messagingSenderId: "243033744820",
  appId: "1:243033744820:web:a078e8da39b801674d3ee1",
  measurementId: "G-R99RBKFN8L"
};

if (!firebase.apps.length) {
  firebase.initializeApp({ ...firebaseConfig })
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export const storage = firebase.storage();
export const increment = firebase.firestore.FieldValue.increment;
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/// Helper functions
/*
   *Gets a users/{uid} document with username
   *@Param {string} username
*/

export async function getUserWithUsername(username) {
  const usersRef = firestore.collection('users');
  const query = usersRef.where('username', '==', username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
