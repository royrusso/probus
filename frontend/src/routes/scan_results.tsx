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
import { fetchProfile } from "../services/Client";
import { Profile } from "../types/probus";

const ScanResults = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { profile_id } = useParams();

  if (!profile_id) {
    console.error("Profile ID is missing!");
    // TODO
    return;
  }

  useEffect(() => {
    fetchProfile(profile_id).then((resp) => {
      console.log("Profile Data: ", resp.data);
      setProfile(resp.data);
    });
  }, []);

  // if (profile && profile.last_scan === null) {
  //   console.log("Last scan is undefined. Running First Scan!");
  // }

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
                  <Button>
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
              <small>Last Scan: {profile.last_scan}</small>
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
