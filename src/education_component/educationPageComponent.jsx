import React, { Component } from 'react';
import NavComponent from '../navComponent';
import chargerHttpXML from '../chargeHttpXML';
import XMLData from '../data/personal.xml';
import XSLData from '../data/personal.xsl';
import { Button } from 'react-bootstrap';

class EducationPageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataIf3Sem1: Object(),
            dataIf3Sem2: Object(),
            dataIf4Sem1: Object(),
            dataIf4Sem2: Object()
        };
        const elemTitle = document.getElementById("page_title");
        elemTitle.innerHTML = "Education";
        this._mounted = false;
    }

    componentDidMount() {
        if (this._mounted) return;
        var xslDocument = chargerHttpXML(XSLData);
        var xmlDocument = chargerHttpXML(XMLData);
        var xsltProcessor = new XSLTProcessor();

        // Importation du .xsl
        xsltProcessor.importStylesheet(xslDocument);

        xsltProcessor.setParameter("", "year", "if3");
        xsltProcessor.setParameter("", "sem", "sem1");
        var newXmlDocument = xsltProcessor.transformToDocument(xmlDocument);
        this.setState({
            dataIf3Sem1: newXmlDocument.getElementsByTagName("element_module")[0].innerHTML
        });
        xsltProcessor.setParameter("", "year", "if3");
        xsltProcessor.setParameter("", "sem", "sem2");
        var newXmlDocument1 = xsltProcessor.transformToDocument(xmlDocument);
        this.setState({
            dataIf3Sem2: newXmlDocument1.getElementsByTagName("element_module")[0].innerHTML
        });
        xsltProcessor.setParameter("", "year", "if4");
        xsltProcessor.setParameter("", "sem", "sem1");
        var newXmlDocument2 = xsltProcessor.transformToDocument(xmlDocument);
        this.setState({
            dataIf4Sem1: newXmlDocument2.getElementsByTagName("element_module")[0].innerHTML
        });
        xsltProcessor.setParameter("", "year", "if4");
        xsltProcessor.setParameter("", "sem", "sem2");
        var newXmlDocument3 = xsltProcessor.transformToDocument(xmlDocument);
        this.setState({
            dataIf4Sem2: newXmlDocument3.getElementsByTagName("element_module")[0].innerHTML
        });
        this._mounted = true;
    }

    render() {
        return (
            <React.Fragment>
                <NavComponent />
                <div id='main'>
                    <h2>Program</h2>

                    <h3>Fourth year of the Department of Computer Science</h3>

                    <Button variant="info" id="button-4.1"
                        onClick={() => {
                            const elemModule = document.getElementById("if4-sem1");
                            elemModule.style.display = 'block';
                            elemModule.innerHTML = this.state.dataIf4Sem1;
                            const elemModule2 = document.getElementById("if4-sem2");
                            elemModule2.style.display = 'none';
                        }}>First semester</Button>

                    <Button variant="info" id="button-4.2"
                        onClick={() => {
                            const elemModule = document.getElementById("if4-sem2");
                            elemModule.style.display = 'block';
                            elemModule.innerHTML = this.state.dataIf4Sem2;
                            const elemModule2 = document.getElementById("if4-sem1");
                            elemModule2.style.display = 'none';
                        }}>Second semester</Button><br />

                    <div id="if4-sem1" style={{ display: 'none' }}>
                    </div>
                    <div id="if4-sem2" style={{ display: 'none' }}>
                    </div>

                    <h3>Third year of the Department of Computer Science</h3>

                    <Button variant="info" id="button-3.1"
                        onClick={() => {
                            const elemModule = document.getElementById("if3-sem1");
                            elemModule.style.display = 'block';
                            elemModule.innerHTML = this.state.dataIf3Sem1;
                            const elemModule2 = document.getElementById("if3-sem2");
                            elemModule2.style.display = 'none';
                        }}>First semester</Button>

                    <Button variant="info" id="button-3.2"
                        onClick={() => {
                            const elemModule = document.getElementById("if3-sem2");
                            elemModule.style.display = 'block';
                            elemModule.innerHTML = this.state.dataIf3Sem2;
                            const elemModule2 = document.getElementById("if3-sem1");
                            elemModule2.style.display = 'none';
                        }}>Second semester</Button><br />


                    <div id="if3-sem1" style={{ display: 'none' }}>
                    </div>

                    <div id="if3-sem2" style={{ display: 'none' }}>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}

export default EducationPageComponent;