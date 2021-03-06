import { useState, useContext, useEffect } from 'react';
import { FirebaseContext } from '../firebase';

function useWatchLists() {
  const { user, firebase } = useContext(FirebaseContext);
  const [watchLists, setWatchLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(false);

    function getWatchLists() {
      if (user) {
        return firebase.db
          .doc(`users/${user.uid}`)
          .collection('lists')
          .onSnapshot(
            (snapshot) => {
              const fetchedLists = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              setWatchLists(fetchedLists);
              setLoading(false);
            },
            (err) => setError(err)
          );
      }
      return () => {};
    }
    const unsubscribe = getWatchLists();
    return () => unsubscribe();
  }, [user, firebase.db]);

  return { watchLists, loading, error };
}

export default useWatchLists;
