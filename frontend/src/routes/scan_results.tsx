import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  OverlayTrigger,
  Row,
} from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { IconContext } from "react-icons";
import { FaListUl, FaRegEdit } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { fetchProfile, scanProfile } from "../services/Client";
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

const ScanResults = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { profile_id } = useParams();

  if (!profile_id) {
    console.error("Profile ID is missing!");
    return;
  }

  useEffect(() => {
    fetchProfile(profile_id).then((resp) => {
      console.log("Profile Data: ", resp);
      setProfile(resp);
    });
  }, []);

  const [isScanning, setIsScanning] = useState(false);

  const rerunScan = () => {
    setIsScanning(true);

    // disable the rerun button
    const rerunButton = document.getElementById("rerun-scan");
    if (rerunButton) {
      rerunButton.setAttribute("disabled", "true");
    }

    scanProfile(profile_id).then((resp) => {
      console.log("Scan Result: ", resp);

      setIsScanning(false);
      rerunButton?.removeAttribute("disabled");

      setProfile({ ...resp });
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
                    {isScanning ? <ReRunSpinner /> : null}
                    <IconContext.Provider
                      value={{ className: "react-icon-button" }}
                    >
                      <IoRefresh />
                    </IconContext.Provider>
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
        </Container>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default ScanResults;
