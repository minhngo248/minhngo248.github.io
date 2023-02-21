import React, { Component } from 'react';
import NavComponent from '../navComponent';
import CarouselComponent from './carouselComponent';
import XMLData from '../data/personal.xml';
import XSLData from '../data/personal.xsl';
import chargerHttpXML from '../chargeHttpXML';

class ProjectPageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectsElem: Object()
        };
        const elemTitle = document.getElementById("page_title");
        elemTitle.innerHTML = "Project";
        this._mounted = false;
    }

    componentDidMount() {
        if (this._mounted) return;
        var xslDocument = chargerHttpXML(XSLData);
        var xmlDocument = chargerHttpXML(XMLData);
        var xsltProcessor = new XSLTProcessor();

        // Importation du .xsl
        xsltProcessor.importStylesheet(xslDocument);

        var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);
        this.setState({
            projectsElem: newXmlDocument.getElementsByTagName("element_project")[0].innerHTML
        });
        const elemProjects = document.getElementById("projects");
        elemProjects.innerHTML = newXmlDocument.getElementsByTagName("element_project")[0].innerHTML;
        this._mounted = true;
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <NavComponent />
                </div>

                <div id='main'>
                    <h2>Highlighted projects in M.S</h2>
                    
                    <div className="d-block w-75">
                        <CarouselComponent />
                    </div>

                    <h2>Code sources</h2>
                    <div id="projects">

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ProjectPageComponent;