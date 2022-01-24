import { auth, firestore, increment } from '../lib/firebase';
import { useDocument, useDocumentData } from 'react-firebase-hooks/firestore';

export default function HeartButton({ postRef })
{
  // Listen to heart document for currently Logged in user
  const heartRef = postRef.collection('hearts').doc(auth.currentUser.uid);
  const [heartRealtime] = useDocumentData(heartRef)
  //const [heartDoc] = useDocument(heartRef);
  

  // Create a user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };
  return heartRealtime ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
