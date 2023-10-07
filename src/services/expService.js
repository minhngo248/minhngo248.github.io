import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

function getAllExperiences() {
    const expRef = collection(db, "experience");
    const q = query(expRef, orderBy("from_year", "desc"),
        orderBy("from_month", "desc"));
    return new Promise((resolve, reject) => {
        getDocs(q)
            .then((querySnapshot) => {
                let list_exp = [];
                querySnapshot.forEach((doc) => {
                    list_exp.push({
                        id: doc.id,
                        company: doc.data().company,
                        description: doc.data().description,
                        from_month: doc.data().from_month,
                        from_year: doc.data().from_year,
                        to_month: doc.data().to_month,
                        to_year: doc.data().to_year,
                        job_title: doc.data().job_title,
                        link_company: doc.data().link_company
                    });
                });
                resolve(list_exp);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    getAllExperiences
};