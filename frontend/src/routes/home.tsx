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
import { fetchDetailedData, fetchPingData } from "../services/Client";

const Home = () => {
  const [scanFormData, setScanFormData] = useState({
    ipAddress: "",
    scanType: "",
  });
  const [validated, setValidated] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [results, setResults] = useState<any[]>([]);
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

    const fetchScanData = async (ipRange: string) => {
      console.log("Scanning IP Range: ", ipRange);
      let scanData = await fetchPingData(ipRange);
      setResults((prevResults) => [...prevResults, scanData]);
      return scanData;
    };

    const response = fetchScanData(scanFormData.ipAddress);
    response
      .then((data) => {
        console.log("Ping Data: ", data);

        // Sometimes host is missing, if all IPs are down.
        if ("host" in data.result.nmaprun) {
          const hosts = data.result.nmaprun.host;

          // hosts can be an array, when multiple hosts are up. Otherwise, it's an object.
          if (hosts.isArray) {
            hosts.forEach((host: any) => {
              console.log("Host UP: ", host);
            });
          } else {
            console.log("Host UP: ", hosts);
          }
        }
      })
      .then(() => {
        // TODO: only scan hosts that are up
        const response_detailed = fetchDetailedData(scanFormData.ipAddress);
        response_detailed.then((data) => {
          console.log("Detailed Data: ", data);
        });
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
                  defaultValue=""
                  value={scanFormData.scanType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Select a Scan Profile...
                  </option>
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
