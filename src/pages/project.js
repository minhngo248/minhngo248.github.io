import {Fragment, useEffect, useState} from "react";
import NavBarComponent from "../components/navbar/navBar";
import CarouselComponent from "../components/project/carouselComponent";
const projectService = require('../services/projectService');

const ProjectPage = () => {
    const [page_title, setPageTitle] = useState("Projects");

    document.getElementById("page_title").innerHTML = page_title;
    const [first_list_project, setFirstListProject] = useState([]);

    useEffect(() => {
        projectService.getProjectsByYear(2023)
            .then((list_project) => {
                setFirstListProject(list_project);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const [second_list_project, setSecondListProject] = useState([]);
    useEffect(() => {
        projectService.getProjectsByYear(2022)
            .then((list_project) => {
                setSecondListProject(list_project);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <Fragment>
            <NavBarComponent />
            <div id={"main"}>
                <h2>Highlighted projects in M.S</h2>

                <div className="d-block w-75">
                    <CarouselComponent />
                </div>

                <h2>List of noteworthy projects</h2>
                <strong>2023</strong>
                <ul>
                    {first_list_project.map((project) => {
                        return (
                            <li key={project.id}>
                                {project.name}<br />
                                <i>Description: </i> {project.description}<br />
                                <i>Skills: </i>{project.skills}<br />
                                <i>Repo git: </i><a href={project.link}>here</a><br />
                            </li>
                    )})
                    }
                </ul>

                <strong>2022</strong>
                <ul>
                    {second_list_project.map((project) => {
                        return (
                            <li key={project.id}>
                                {project.name}<br />
                                <i>Description: </i> {project.description}<br />
                                <i>Skills: </i>{project.skills}<br />
                                <i>Repo git: </i><a href={project.link}>here</a><br />
                            </li>
                    )})
                    }
                </ul>
            </div>
        </Fragment>
    );
}

export default ProjectPage;
