import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Toast,
} from "react-bootstrap";
import { scanPingType } from "../services/Client";

const Home = () => {
  const [scanFormData, setScanFormData] = useState({
    ipAddress: "",
    scanType: "full",
  });
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [scanFormToastMessage, setScanFormToastMessage] = useState("");

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setScanFormData({ ...scanFormData, [id]: value });
  };

  const handleScan = (e: {
    preventDefault: () => void;
    currentTarget: any;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();

    console.log("Scan Form Data: ", scanFormData);

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    if (scanFormData.ipAddress === "" || scanFormData.ipAddress === null) {
      console.log("IP Address is required");
      return;
    }

    setShowToast(true);
    setScanFormToastMessage(
      `Scan started for IP Address(es): ${scanFormData.ipAddress}`
    );

    // Send the scan request to the backend
    // scanListType(scanFormData.ipAddress).then((data) => {
    //   console.log("Scan Response: ", data);
    // });

    scanPingType(scanFormData.ipAddress).then((data) => {
      console.log("Ping Response: ", data);
    });
  };

  return (
    <>
      <Container>
        <Row className="justify-content-md-center">
          <Col lg="6">
            <Form
              className="pt-3 w-100"
              onSubmit={handleScan}
              noValidate
              validated={validated}
            >
              <InputGroup hasValidation>
                <Form.Control
                  placeholder="IP Address Range"
                  size="sm"
                  type="text"
                  id="ipAddress"
                  onChange={handleChange}
                  value={scanFormData.ipAddress}
                  required
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  Please enter a valid IP Address or Range
                </Form.Control.Feedback>
                <Form.Select
                  id="scanType"
                  size="sm"
                  defaultValue="full"
                  onChange={handleChange}
                >
                  <option value="full">Full Vulnerability Scan</option>
                  <option value="ping">Ping Scan</option>
                  <option>Detailed Scan</option>
                  <option>OS-only Scan</option>
                </Form.Select>
                <Button variant="primary" id="button-beginscan" type="submit">
                  Scan
                </Button>
              </InputGroup>{" "}
              <Form.Text id="ipAddressHelpText" className="formfield-help">
                e.g. 192.168.0-255 or 192.168.0/24
              </Form.Text>
            </Form>
            <Toast
              bg="success"
              delay={5000}
              autohide
              show={showToast}
              onClose={() => setShowToast(false)}
              style={{ position: "absolute", top: 20, right: 20 }}
            >
              <Toast.Header>
                <strong className="me-auto">Scan Started</strong>
              </Toast.Header>
              <Toast.Body>{scanFormToastMessage}</Toast.Body>
            </Toast>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
