import { generateSlug } from "random-word-slugs";
import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../services/Client";
import { Profile } from "../types/probus";
import { isValidIPv4Range } from "../utils/IPUtils";

const Home = () => {
  const navigate = useNavigate();
  const [scanFormData, setScanFormData] = useState({
    ipAddress: "",
  });
  const [validIP, setValidIP] = useState(true);
  // const [showToast, setShowToast] = useState(false);
  // const [scanFormToastMessage, setScanFormToastMessage] = useState("");

  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setScanFormData({ ...scanFormData, [id]: value });
  };

  const handleSubmit = (e: {
    preventDefault: () => void;
    currentTarget: any;
    stopPropagation: () => void;
  }) => {
    e.preventDefault();

    if (!isValidIPv4Range(scanFormData.ipAddress)) {
      setValidIP(false);
      e.stopPropagation();
      return;
    }

    setValidIP(true);

    // Create a new profile
    const result = createProfile({
      profile_name: generateSlug(2, { format: "title" }),
      ip_range: scanFormData.ipAddress,
    } as Profile);

    result.then((resp) => {
      console.log("Profile Created: ", resp);
      navigate("/results/" + resp.profile_id, {
        state: { data: resp },
      });
    });
  };

  return (
    <>
      <Container
        fluid
        className="vh-100 d-flex justify-content-center align-items-center"
      >
        <Row className="w-50">
          <Col className="mb-5">
            <Form className="w-100 mb-5" onSubmit={handleSubmit} noValidate>
              <Alert variant="secondary">
                {" "}
                <InputGroup>
                  <Form.Control
                    placeholder="Enter IP Address or Range to begin scanning..."
                    type="text"
                    id="ipAddress"
                    onChange={handleChange}
                    value={scanFormData.ipAddress}
                    required
                    aria-describedby="ipAddressHelpText"
                    isInvalid={!validIP}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Invalid IP Address or Range
                  </Form.Control.Feedback>
                  <Button variant="primary" id="button-beginscan" type="submit">
                    Scan
                  </Button>{" "}
                </InputGroup>{" "}
                <Form.Text id="ipAddressHelpText" className="formfield-help">
                  e.g. 192.168.1.0-255 or 192.168.1.0/24
                </Form.Text>
              </Alert>
            </Form>

            {/* <Toast
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
            </Toast> */}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
