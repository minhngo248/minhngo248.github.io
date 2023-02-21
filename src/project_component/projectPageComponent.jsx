import React, { Component } from 'react';
import NavComponent from '../navComponent';

class ProjectPageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        const elemTitle = document.getElementById("page_title");
        elemTitle.innerHTML = "Project";
    }

    render() { 
        return (
            <>
                <NavComponent />
                <div id='main'>
                    
                </div>
            </>
        );
    }
}
 
export default ProjectPageComponent;