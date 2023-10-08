import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function getAllCertificates() {
    const certRef = collection(db, "certification");
    const q = query(certRef, orderBy("time_year", "desc"),
        orderBy("time_month_num", "desc"));
    return new Promise((resolve, reject) => {
        getDocs(q)
            .then((querySnapshot) => {
                let list_cert = [];
                querySnapshot.forEach((doc) => {
                    list_cert.push({
                        id: doc.id,
                        name: doc.data().name,
                        time_year: doc.data().time_year,
                        time_month: doc.data().time_month,
                        link: doc.data().link
                    });
                });
                resolve(list_cert);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    getAllCertificates
};