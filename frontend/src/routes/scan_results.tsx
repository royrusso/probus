import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
  Alert,
  Table as BTable,
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  ListGroup,
  Offcanvas,
  OverlayTrigger,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import Tooltip from "react-bootstrap/Tooltip";
import { IconContext } from "react-icons";
import { FaListUl, FaRegEdit, FaSortDown, FaSortUp } from "react-icons/fa";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { IoRefresh } from "react-icons/io5";
import { LuView } from "react-icons/lu";
import { useParams } from "react-router-dom";
import {
  fetchLatestScanEvent,
  fetchProfile,
  scanProfile,
} from "../services/Client";
import { Addresses, Host, Hosts, Ports, Profile } from "../types/probus";
import formatDateTime, {
  convertMicrosecondsToMilliseconds,
} from "../utils/Tools";

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

  const [showHostDetails, setShowHostDetails] = useState(false);
  const handleClose = () => setShowHostDetails(false);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  const handleShowHostDetails = (host: Host) => {
    setSelectedHost(host);
    setShowHostDetails(true);
  };

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

  const renderPortsCell = (ports: Ports) => {
    // only render 3 ports, and then show ellipsis if there are more
    let all_ports = ports.map((port) => port.port_number).join(", ");
    let ports_subset = ports
      .slice(0, 3)
      .map((port) => port.port_number)
      .join(", ");
    if (ports.length > 3) {
      ports_subset += ", ...";
    }
    return (
      <>
        <OverlayTrigger overlay={<Tooltip>{all_ports}</Tooltip>}>
          <div>{ports_subset}</div>
        </OverlayTrigger>
      </>
    );
  };

  const renderAddressCell = (addresses: Addresses) => {
    let visible_address = "unknown";

    const ipv4 = addresses.find((addr) => addr.address_type === "ipv4");
    const ipv6 = addresses.find((addr) => addr.address_type === "ipv6");
    const mac = addresses.find((addr) => addr.address_type === "mac");

    if (ipv4) {
      visible_address = ipv4.address;
    } else if (ipv6) {
      visible_address = ipv6.address;
    } else if (mac) {
      visible_address = mac.address;
    }

    if (addresses.length <= 1) {
      return visible_address;
    }

    return (
      <>
        <OverlayTrigger
          overlay={
            <Tooltip>
              {addresses.map((addr) => addr.address).join(", ")}
            </Tooltip>
          }
        >
          <div>{visible_address}</div>
        </OverlayTrigger>
      </>
    );
  };

  const calculateScanTimeInSeconds = (start_time: string, end_time: string) => {
    const start = new Date(start_time);
    const end = new Date(end_time);
    return (end.getTime() - start.getTime()) / 1000;
  };

  const columnHelper = createColumnHelper<Hosts>();
  const columns = [
    columnHelper.accessor("host_id", {
      header: "",
      enableSorting: false,
      cell: (row: any) => {
        return (
          <>
            <div className="d-flex text-center justify-content-center">
              <OverlayTrigger overlay={<Tooltip>Host Details</Tooltip>}>
                <Button
                  className=""
                  size="sm"
                  onClick={() =>
                    handleShowHostDetails(row.row.original as unknown as Host)
                  }
                >
                  <LuView />
                </Button>
              </OverlayTrigger>
            </div>
          </>
        );
      },
    }),
    columnHelper.accessor("addresses", {
      header: "Address",
      cell: (row: any) => renderAddressCell(row.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor("hostnames", {
      header: "Host Name",
      cell: (row: any) =>
        row
          .getValue()
          .map((hn: any) => hn.host_name)
          .join(", "),
      enableSorting: true,
    }),
    columnHelper.accessor("ports", {
      header: "Ports",
      cell: (row: any) => renderPortsCell(row.getValue()),
      enableSorting: true,
    }),
    columnHelper.accessor("latency", {
      header: "Latency",
      cell: (row: any) =>
        convertMicrosecondsToMilliseconds(row.getValue()) + " ms",
      enableSorting: true,
    }),
    {
      id: "scan_time",
      header: "Scan Time",
      cell: (prop: any) => {
        const scanTime = calculateScanTimeInSeconds(
          prop.row.original.start_time,
          prop.row.original.end_time
        );
        return scanTime + "s";
      },
    },
  ];

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const hostsTable = useReactTable({
    data: scanResults?.hosts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    enableSortingRemoval: false, // disable the ability to remove sorting on columns
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(), //load client-side pagination code
    state: {
      pagination,
    },
    initialState: {
      sorting: [
        {
          id: "addresses",
          desc: true,
        },
      ],
    },
  });

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
              <Col className="mt-3">
                <h3>Scan Results</h3>

                <div className="mt-1">
                  {scanResults?.hosts ? (
                    <BTable striped bordered hover responsive>
                      <thead>
                        {hostsTable.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                colSpan={header.colSpan}
                                className={
                                  "text-lg " +
                                  (header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : "cursor-help")
                                }
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                                {{
                                  asc: (
                                    <IconContext.Provider
                                      value={{
                                        className: "react-icon-button",
                                      }}
                                    >
                                      <FaSortUp />
                                    </IconContext.Provider>
                                  ),
                                  desc: (
                                    <IconContext.Provider
                                      value={{
                                        className: "react-icon-button",
                                      }}
                                    >
                                      <FaSortDown />
                                    </IconContext.Provider>
                                  ),
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody>
                        {hostsTable.getRowModel().rows.map((row) => (
                          <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="align-middle">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </BTable>
                  ) : (
                    <div className="text-muted">No hosts found</div>
                  )}
                </div>
              </Col>
            )}
          </Row>
          {scanResults?.hosts ? (
            <Row>
              <Col>
                <p>
                  Page {hostsTable.getState().pagination.pageIndex + 1} of{" "}
                  {hostsTable.getPageCount()}. Total {hostsTable.getRowCount()}{" "}
                  Hosts.
                </p>
              </Col>
              <Col className="text-end">
                <ButtonGroup>
                  <Button
                    onClick={() => hostsTable.previousPage()}
                    disabled={!hostsTable.getCanPreviousPage()}
                  >
                    <IconContext.Provider
                      value={{ className: "react-icon-button" }}
                    >
                      <GrCaretPrevious />
                    </IconContext.Provider>
                  </Button>
                  <Button
                    onClick={() => hostsTable.nextPage()}
                    disabled={!hostsTable.getCanNextPage()}
                  >
                    <IconContext.Provider
                      value={{ className: "react-icon-button" }}
                    >
                      <GrCaretNext />
                    </IconContext.Provider>
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          ) : null}
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
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          bg="success"
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
      <Offcanvas show={showHostDetails} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Host Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {selectedHost ? (
            <>
              <Card className="mt-3" border="info">
                <Card.Header>Addresses</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {selectedHost.addresses.map((addr) => (
                      <ListGroup.Item key={addr.address_id}>
                        {addr.address} ({addr.address_type}) - {addr.vendor}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mt-3" border="info">
                <Card.Header>Hostnames</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {selectedHost.hostnames.map((hn) => (
                      <ListGroup.Item key={hn.hostname_id}>
                        {hn.host_name} ({hn.host_type})
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="mt-3" border="info">
                <Card.Header>Ports</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    {selectedHost.ports.map((port) => (
                      <ListGroup.Item key={port.port_id}>
                        {port.port_number} ({port.protocol}): {port.state} -{" "}
                        {port.service}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card border="dark" className="mt-3">
                <Card.Body className="text-center small">
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      Scan Start: {formatDateTime(selectedHost.start_time)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Scan End: {formatDateTime(selectedHost.end_time)}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      Latency:{" "}
                      {convertMicrosecondsToMilliseconds(
                        selectedHost.latency ?? 0
                      )}{" "}
                      ms
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </>
          ) : (
            <div>Host details not found</div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ScanResults;
