import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  ButtonGroup,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { IconContext } from "react-icons";
import { FaListUl, FaRegEdit } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { useParams } from "react-router-dom";
import {
  fetchLatestScanEvent,
  fetchProfile,
  scanProfile,
} from "../services/Client";
import { Profile } from "../types/probus";
import formatDateTime from "../utils/Tools";

const LatestScan = ({ profile }: { profile: Profile }) => {
  return (
    <div className="text-muted">
      <small>
        Latest Scan:{" "}
        {profile.last_scan ? formatDateTime(profile.last_scan) : "N/A"}
      </small>
    </div>
  );
};

const ReRunSpinner = () => {
  return (
    <span
      className="spinner-border spinner-border-sm"
      role="status"
      aria-hidden="true"
      id="rerun_spinner"
    ></span>
  );
};

const defaultReRunButtonContent = () => {
  return (
    <>
      <IconContext.Provider value={{ className: "react-icon-button" }}>
        <IoRefresh />
      </IconContext.Provider>
    </>
  );
};

const ScanResults = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scanResults, setScanResults] = useState<any | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [rerunButtonContent, setReRunButtonContent] = useState(
    defaultReRunButtonContent
  );

  const { profile_id } = useParams();

  if (!profile_id) {
    console.error("Profile ID is missing!");
    return;
  }

  useEffect(() => {
    fetchProfile(profile_id).then((resp) => {
      console.log("Profile Data: ", resp);
      setProfile(resp);

      if (resp.last_scan) {
        fetchLatestScanEvent(profile_id).then((resp) => {
          console.log("Latest Scan Event: ", resp);
          setScanResults(resp);
        });
      }
    });
  }, []);

  const rerunScan = () => {
    setShowToast(true);

    // disable the rerun button and replace it with a spinner
    const rerunButton = document.getElementById("rerun-scan");
    if (rerunButton) {
      rerunButton.setAttribute("disabled", "true");
      setReRunButtonContent(() => {
        return <ReRunSpinner />;
      });
    }

    scanProfile(profile_id)
      .then((resp) => {
        console.log("Profile Result: ", resp);

        setShowToast(false);
        rerunButton?.removeAttribute("disabled");
        setReRunButtonContent(defaultReRunButtonContent);

        setProfile({ ...resp });

        fetchLatestScanEvent(profile_id).then((resp) => {
          console.log("Latest Scan Event: ", resp);
          setScanResults(resp);
        });
      })
      .catch((err) => {
        console.error("Error while scanning profile: ", err);
        setShowToast(false);
        rerunButton?.removeAttribute("disabled");
        setReRunButtonContent(defaultReRunButtonContent);
      });
  };

  return (
    <>
      {profile ? (
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>{profile.profile_name}</h1>
            </Col>
            <Col className="text-end">
              <ButtonGroup>
                <OverlayTrigger
                  overlay={<Tooltip>Re-run this Profile</Tooltip>}
                >
                  <Button onClick={rerunScan} id="rerun-scan">
                    {rerunButtonContent}
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>Edit this Profile</Tooltip>}>
                  <Button>
                    <IconContext.Provider
                      value={{ className: "react-icon-button" }}
                    >
                      <FaRegEdit />
                    </IconContext.Provider>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>View Scan History</Tooltip>}>
                  <Button>
                    <IconContext.Provider
                      value={{ className: "react-icon-button" }}
                    >
                      <FaListUl />
                    </IconContext.Provider>
                  </Button>
                </OverlayTrigger>
              </ButtonGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="text-muted">
                <small>{profile.ip_range}</small>
              </div>
            </Col>
            <Col className="text-end">
              <LatestScan profile={profile} />
            </Col>
          </Row>
          <Row>
            {profile.last_scan === null ? (
              <Col className="mt-5">
                <Alert variant="warning">
                  <div className="text-center">
                    <h5>No scan results available</h5>
                    <div className="text-muted">
                      You may trigger a scan of the network. This page will
                      refresh automatically when the scan is complete.
                    </div>
                    <div className="text-muted small">
                      This process may take a few minutes to complete.
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => rerunScan()}
                    >
                      Scan Network
                    </Button>
                  </div>
                </Alert>
              </Col>
            ) : (
              <Col>
                <h3>Scan Results</h3>
              </Col>
            )}
          </Row>
        </Container>
      ) : (
        <Container
          fluid
          className="vh-100 d-flex justify-content-center align-items-center"
        >
          <Row className="w-50">
            <Col className="mb-5 text-center">
              <div className="text-warning">Error. Profile not found.</div>
            </Col>
          </Row>
        </Container>
      )}
      <ToastContainer
        className="p-3"
        position="middle-center"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg="dark"
          delay={15000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Scan Running in the background</strong>
          </Toast.Header>
          <Toast.Body>
            <p>
              You may navigate away from this page and return later to view the
              results.
            </p>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default ScanResults;
