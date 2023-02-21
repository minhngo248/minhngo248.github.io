import React, { Component } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

class NavComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this._mounted = false;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar bg="light" expand="lg">
                    <Container fluid>
                        <Navbar.Brand href="/">Minh Ngo</Navbar.Brand>
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: "100px" }}
                        >
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/education">Education</Nav.Link>
                            <Nav.Link href="/project">Projects</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </React.Fragment>
        );
    }
}

export default NavComponent;