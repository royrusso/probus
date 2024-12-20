import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { IconContext } from "react-icons";
import { FaGithub } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

const Header = () => {
  return (
    <header>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand href="/">
            {"{"} Probus {"}"}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="me-auto">
              <Nav.Link href="/">New Scan</Nav.Link>
              <Nav.Link href="/profiles">Profiles</Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              <Nav.Link href="/settings">
                <IconContext.Provider
                  value={{ size: "1.5em", className: "react-icon-button" }}
                >
                  <FaGear />
                </IconContext.Provider>
              </Nav.Link>
              <Nav.Link
                href="https://github.com/royrusso/probus"
                target="_blank"
              >
                <IconContext.Provider
                  value={{ size: "1.5em", className: "react-icon-button" }}
                >
                  <FaGithub />
                </IconContext.Provider>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
