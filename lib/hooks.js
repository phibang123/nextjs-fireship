import { auth, firestore } from "../lib/firebase";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";

// Custom hook to read  auth record and user profile doc
export function useUserData() {
	const [user] = useAuthState(auth);
	const [username, setUsername] = useState(null);
  
	useEffect(() => {
		// turn off realtime subscription
		let unsubscribe;
    
		if (user) {
			const ref = firestore.collection("users").doc(user.uid);
			// ref.set({
			//   displayName: user?.displayName,
			//   email: user?.email,
			//   photoURL: user?.photoURL
			// })
			// const refs = firestore.collection('usernames').doc(user.email);
			// refs.set({
			//   uid: user.uid
			// })
			unsubscribe = ref.onSnapshot(async doc => {
				 setUsername(await doc.data()?.username);
			});
		} else {
			setUsername(null);
		}

		return unsubscribe;
	}, [user]);

	return { user, username };
}
