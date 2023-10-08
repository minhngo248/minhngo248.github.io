import {Fragment, useEffect, useState} from "react";
import NavBarComponent from "../components/navbar/navBar";
import '../styles/home.css';
import Ngoc_Minh from '../data/img/Ngoc_Minh.jpg';
import lsf from '../data/img/lsf_2.png';
const cvService = require('../services/cvService');
const expService = require('../services/expService');
const certService = require('../services/certService');

const HomePage = () => {
    const [page_title, setPageTitle] = useState("Minh NGO's homepage");

    document.getElementById("page_title").innerHTML = page_title;
    const [list_cv, setListCV] = useState([]);
    useEffect(() => {
        cvService.getAllCVs()
            .then((list_cv) => {
                setListCV(list_cv);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const [list_exp, setListExp] = useState([]);
    useEffect(() => {
        expService.getAllExperiences()
            .then((list_exp) => {
                setListExp(list_exp);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const [list_certification, setListCertification] = useState([]);
    useEffect(() => {
        certService.getAllCertificates()
            .then((list_certification) => {
                setListCertification(list_certification);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Fragment>
        <NavBarComponent />
            <div id={"main"}>
                <div className="row">
                    <div id="column1">
                        <h1>Welcome to Minh NGO's website</h1>
                    </div>

                    <div id="column2">
                        <img src={Ngoc_Minh} className="rounded-circle"
                             style={{width: '150px', height: '170px'}} alt="Identity photo" />
                    </div>
                </div>

                <h2>About me</h2>
                <p>Currently pursue M.S degree of the Department of Computer Science, Institut National des Sciences Appliquées de Lyon (<a href="https://www.insa-lyon.fr">INSA de Lyon</a>).
                    Passionate about new technologies, I want to move towards CS training to become a Data Analyst.</p>

                <h2>Curriculum Vitae</h2>
                <ul>
                    {list_cv.map((cv) => {
                        return (
                            <li key={cv.id}>CV in {cv.language} <a href={cv.link}>here</a></li>
                        );
                    })
                    }
                </ul>

                <h2>Professional experiences</h2>
                <ul>
                    {list_exp.map((exp) => {
                        return (
                            <li key={exp.id}>{exp.from_month} {exp.from_year} - {exp.to_month} {exp.to_year}: {exp.job_title} in the <a href={exp.link_company}>{exp.company}</a><br/>
                                <i>Description of mission:</i> {exp.description}<br />
                                <i>Repo git:</i> <a href={exp.repo_git}>here</a>
                            </li>
                        );
                    })
                    }
                </ul>

                <h2>Licenses and Certifications</h2>
                <ul>
                    {list_certification.map((cert) => {
                        return (
                            <li key={cert.id}>{cert.time_month} {cert.time_year}: {cert.name} <a href={cert.link}>here</a></li>
                        );
                    })
                    }
                </ul>

                <figure>
                <img className='w-25 h-25'
                    style={{display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '40%'}}
                    src={lsf}
                    alt="LSF of 9 positions in the image"
                />
                <figcaption style={{textAlign: 'center'}}><b>Figure</b>. Line Spread Function visualization</figcaption>
                </figure>
            </div>
        </Fragment>
    );
}

export default HomePage;