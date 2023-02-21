import React, { Component } from 'react';
import NavComponent from '../navComponent';
import Ngoc_Minh from '../data/img/Ngoc_Minh.jpg';
import CV_eng from '../data/files/NGO-Ngoc-Minh_CV_eng.pdf';
import CV from '../data/files/NGO-Ngoc-Minh_CV.pdf';
import './homePage.css';

class HomePageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this._mounted = false;
    }

    render() {
        return (
            <>
                <NavComponent />
                <div className="row">
                    <div id="column1">
                        <h1>Welcome to Minh NGO's website</h1>
                    </div>

                    <div id="column2">
                        <img src={Ngoc_Minh} width="100" height="130" alt="Identity photo" />
                    </div>
                </div>

                <h2>Personal Information</h2>
                Currently a fourth year student of the Department of Computer Science, Institut National des Sciences Appliquées de Lyon (<a href="https://www.insa-lyon.fr">INSA de Lyon</a>). 
                Passionate about new technologies, especially in the field of Computer Science, I want to move towards CS training to become a Data Analyst.

                <h2>Curriculum Vitae</h2>
                <ul>
                    <li>CV in English <a href={CV_eng}>click here
                    </a></li>
                    <li>CV in French <a href={CV}>click here
                    </a></li>
                </ul>

                <h2>Professional Experiences</h2>
                <ul>
                    <li>June 2022 - Sept 2022: data analysis internship at the Astrophysical Research Centre of Lyon</li>
                    <li>June 2020 - Oct 2020: private tutor in Maths and Physics for a high-school student who struggled with working from home.</li>
                </ul>
            </>
        );
    }
}

export default HomePageComponent;