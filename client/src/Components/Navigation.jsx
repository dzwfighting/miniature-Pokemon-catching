import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../App.css";
import "../style/navigation.css";

const Navigation = () => {
  return (
    <div className="hei">
      <Navbar className="bg" expand="lg">
        <Container>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/" className="dis">
                Home
              </Nav.Link>
              <Nav.Link href="/pokemon/page/0" className="dis">
                All Pokemon
              </Nav.Link>
              <Nav.Link href="/trainers" className="dis">
                All Trainer
              </Nav.Link>
              {/* <Nav.Link href="/addtrainer" className="dis">
                Add Trainer
              </Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navigation;
