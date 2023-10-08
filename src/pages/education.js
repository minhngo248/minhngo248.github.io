import {Fragment, useEffect, useState} from "react";
import NavBarComponent from "../components/navbar/navBar";
const educationService = require('../services/educationService');

const EducationPage = () => {
    const [page_title, setPageTitle] = useState("Education");
    document.getElementById("page_title").innerHTML = page_title;

    const [list_education, setListEducation] = useState([]);
    useEffect(() => {
        educationService.getAllSubjectsByYearSemesterAndAggregateByUe(3, 1)
            .then((list_education) => {
                setListEducation(list_education);
            }
            )
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Fragment>
            <NavBarComponent />
            <div id={"main"}>
                <h2>Program</h2>
                <p>Here is the program of the 3rd year of the Computer Science department of INSA de Lyon.</p>
                <p>Click on the name of the UE to see the subjects.</p>
                <div className="accordion accordion-flush" id="accordionFlushExample">
                    {list_education.map((ue, index) => {
                        return (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={"flush-heading-" + index}>
                                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={"#flush-collapse-" + index} aria-expanded="false" aria-controls={"flush-collapse-" + index}>
                                        {ue.ue}
                                    </button>
                                </h2>
                                <div id={"flush-collapse-" + index} className="accordion-collapse collapse" aria-labelledby={"flush-heading-" + index} data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        <ul>
                                            {ue.subjects.map((subject, index) => {
                                                return (
                                                    <li key={index}>
                                                        <a href={subject.link} target="_blank" rel="noreferrer">{subject.name}</a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Fragment>
    );
}

export default EducationPage;