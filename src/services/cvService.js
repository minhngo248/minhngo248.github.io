import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function getAllCVs() {
    return new Promise((resolve, reject) => {
        getDocs(collection(db, "cv"))
            .then((querySnapshot) => {
                let list_cv = [];
                querySnapshot.forEach((doc) => {
                    list_cv.push({
                        id: doc.id,
                        language: doc.data().language,
                        link: doc.data().link
                    });
                });
                resolve(list_cv);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    getAllCVs
};