import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function getAllSubjectsByYearSemesterAndAggregateByUe(year, semester) {
    const subjectRef = collection(db, "subject");
    const q = query(subjectRef, where("year", "==", year),
        where("semester", "==", semester),
        orderBy("ue", "asc"), orderBy("name", "asc"));
    return new Promise((resolve, reject) => {
        getDocs(q)
            .then((querySnapshot) => {
                let list_subject = [];
                querySnapshot.forEach((doc) => {
                    list_subject.push({
                        id: doc.id,
                        name: doc.data().name,
                        ue: doc.data().ue,
                        year: doc.data().year,
                        semester: doc.data().semester,
                        link: doc.data().link
                    });
                });
                let aggregate_subject = [];
                list_subject.forEach((subject) => {
                    let index = aggregate_subject.findIndex((item) => {
                        return item.ue === subject.ue;
                    });
                    if (index === -1) {
                        aggregate_subject.push({
                            ue: subject.ue,
                            subjects: [subject]
                        });
                    } else {
                        aggregate_subject[index].subjects.push(subject);
                    }
                });
                resolve(aggregate_subject);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export {
    getAllSubjectsByYearSemesterAndAggregateByUe
};