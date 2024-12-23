import { generateSlug } from "random-word-slugs";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { createProfile, fetchLatestScannedProfiles } from "../services/Client";
import { Profile } from "../types/probus";
import { isValidIPv4Range } from "../utils/IPUtils";
import formatDateTime from "../utils/Tools";

const generateProfileCards = (
  profiles: Profile[],
  navigate: NavigateFunction
) => {
  return profiles.map((profile) => {
    return (
      <Col key={profile.profile_id} className="mb-3" xs={6} md={4} lg={4}>
        <Alert variant="info">
          <div className="text-center">
            <h5>{profile.profile_name}</h5>
            <div className="profile-card-details">
              {formatDateTime(profile.last_scan ?? "")}
            </div>
            <div className="profile-card-details">{profile.ip_range}</div>
          </div>
          <div className="text-end small mt-2">
            <Button
              variant="outline-info"
              size="sm"
              onClick={() => navigate("/results/" + profile.profile_id)}
            >
              Results
            </Button>
          </div>
        </Alert>
      </Col>
    );
  });
};

const Home = () => {
  const navigate = useNavigate();
  const [scanFormData, setScanFormData] = useState({
    ipAddress: "",
  });
  const [validIP, setValidIP] = useState(true);
  const [profileCards, setProfileCards] = useState<JSX.Element[]>([]);

  const fetchLast5Profiles = () => {
    const result = fetchLatestScannedProfiles(3);
    result.then((resp) => {
      console.log("Latest Profiles: ", resp);

      // Generate the profile cards
      const cards = generateProfileCards(resp, navigate);
      setProfileCards(cards);
      console.log("Profile Cards: ", profileCards);
    });
  };

  useEffect(() => {
    fetchLast5Profiles();
  }, []);

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
      navigate("/results/" + resp.profile_id);
    });
  };

  return (
    <>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
      >
        <Row className="w-50 mt-5">
          <Col className="mb-5">
            <Form className="w-100 mb-5" onSubmit={handleSubmit} noValidate>
              <Alert variant="secondary">
                {" "}
                <InputGroup>
                  <Form.Control
                    placeholder="Enter IP Address/Range to create a new scan profile..."
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
          </Col>
        </Row>
      </Container>
      {profileCards.length > 0 && ( // Display the latest scans only if there are any}
        <Container className="mt-1">
          <Row>
            <Col>
              <h3>
                Latest Scans{" "}
                <div className="inline-small">
                  [ <a href="/profiles">View All</a>]
                </div>
              </h3>
            </Col>
          </Row>
          <Row>{profileCards}</Row>
        </Container>
      )}{" "}
    </>
  );
};

export default Home;
