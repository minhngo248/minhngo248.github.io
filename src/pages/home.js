import {Fragment, useEffect, useState} from "react";
import NavBarComponent from "../components/navbar/navBar";
import '../styles/home.css';
const cvService = require('../services/cvService');
const expService = require('../services/expService');
const HomePage = () => {
    const [state, setState] = useState({
        list_cv: [],
        list_experience: [],
        list_certification: [],
    });

    useEffect(() => {
        cvService.getAllCVs()
            .then((list_cv) => {
                setState({
                    ...state,
                    list_cv: list_cv
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        expService.getAllExperiences()
            .then((list_experience) => {
                setState({
                    ...state,
                    list_experience: list_experience
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Fragment>
        <NavBarComponent />
            <div className="row">
                <div id="column1">
                    <h1>Welcome to Minh NGO's website</h1>
                </div>

                <div id="column2">
                    <img src={"https://drive.google.com/file/d/1lxHPx8nVSTgjUxSzRjgTTmwlt3A7exni/view?usp=sharing"} className="rounded-circle"
                         style={{width: '150px', height: '170px'}} alt="Identity photo" />
                </div>
            </div>

            <h2>About me</h2>
            <p>Currently pursue M.S degree of the Department of Computer Science, Institut National des Sciences Appliquées de Lyon (<a href="https://www.insa-lyon.fr">INSA de Lyon</a>).
                Passionate about new technologies, I want to move towards CS training to become a Data Analyst.</p>

            <h2>Curriculum Vitae</h2>
            <ul>
                {state.list_cv.map((cv) => {
                    return (
                        <li key={cv.id}>CV in {cv.language} <a href={cv.link}>here</a></li>
                    );
                })
                }
            </ul>

            <h2>Professional experiences</h2>
            <ul>
                {state.list_experience.map((exp) => {
                    return (
                        <li key={exp.id}>{exp.from_month} {exp.from_year} - {exp.to_month} {exp.to_year}: {exp.job_title} in the <a href={exp.link_company}>{exp.company}</a></li>
                    );
                })
                }
            </ul>
        </Fragment>
    );
}

export default HomePage;