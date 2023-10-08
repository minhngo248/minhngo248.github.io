import {collection, getDocs, query, orderBy, where} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function getProjectsByYear(year) {
    const projectRef = collection(db, "project");
    const q = query(projectRef, where("year", "==", year), orderBy("name", "desc"));
    return new Promise((resolve, reject) => {
        getDocs(q)
            .then((querySnapshot) => {
                let list_project = [];
                querySnapshot.forEach((doc) => {
                    list_project.push({
                        id: doc.id,
                        name: doc.data().name,
                        description: doc.data().description,
                        skills: doc.data().skills,
                        year: doc.data().year,
                        link: doc.data().link
                    });
                });
                resolve(list_project);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    getProjectsByYear
};