import Dexie from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';

const db = new Dexie('photoDB');
db.version(1).stores({ photos: '++id,takenAt,label' });

export function usePhotoStore() {
  const photos = useLiveQuery(() => db.photos.toArray(), []);

  /** add a new photo */
  const addPhoto = p => db.photos.add(p);

  /** update label */
  const updatePhoto = (id, label) =>
    db.photos.update(id, { label });

  /** delete photo */
  const deletePhoto = id => db.photos.delete(id);

  return {
    photos: photos ?? [],
    addPhoto,
    updatePhoto,
    deletePhoto,
  };
}
