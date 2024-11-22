import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

const Home = () => {
  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="4">
            <Form className="pt-3 w-100">
              <InputGroup>
                <Form.Control
                  placeholder="IP Address Range"
                  size="sm"
                  type="text"
                  id="input-ipaddress"
                />
                <DropdownButton
                  variant="outline-secondary"
                  title="Type"
                  id="input-scantype"
                  align="end"
                >
                  <Dropdown.Item href="#">
                    Full Vulnerability Scan
                  </Dropdown.Item>
                  <Dropdown.Divider />

                  <Dropdown.Item href="#">Ping Scan</Dropdown.Item>
                  <Dropdown.Item href="#">Detailed Scan</Dropdown.Item>
                  <Dropdown.Item href="#">OS-only Scan</Dropdown.Item>
                </DropdownButton>
                <Button variant="primary" id="button-beginscan">
                  {/* <IconContext.Provider
                    value={{ className: "react-icon-button" }}
                  >
                    <TbZoomScan />
                  </IconContext.Provider> */}
                  Scan
                </Button>
              </InputGroup>{" "}
              <Form.Text id="ipAddressHelpText" className="formfield-help">
                e.g. 192.168.0-255 or 192.168.0/24
              </Form.Text>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
