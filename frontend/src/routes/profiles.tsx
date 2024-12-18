import {
  Button,
  ButtonGroup,
  Col,
  Container,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Profile } from "../types/probus";

import { Table as BTable } from "react-bootstrap";
import { LuView } from "react-icons/lu";

import { flexRender } from "@tanstack/react-table";
import { IconContext } from "react-icons";
import { FaListUl, FaRegEdit, FaSortDown, FaSortUp } from "react-icons/fa";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { fetchProfileList } from "../services/Client";
import formatDateTime from "../utils/Tools";

const Profiles = () => {
  const navigate = useNavigate();
  const [profiles, setData] = useState<Profile[]>([]);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on load.

  const fetchData = async () => {
    try {
      const response = fetchProfileList();
      const resp = await response;
      setData(resp);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const columnHelper = createColumnHelper<Profile>();
  const columns = [
    columnHelper.accessor("profile_id", {
      header: "",
      enableSorting: false,
      cell: (profile) => {
        return (
          <>
            <ButtonGroup>
              <OverlayTrigger overlay={<Tooltip>View Latest Scan</Tooltip>}>
                <Button
                  onClick={() => navigate(`/results/${profile.getValue()}`)}
                >
                  <IconContext.Provider value={{}}>
                    <LuView />
                  </IconContext.Provider>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>Edit this Profile</Tooltip>}>
                <Button>
                  <IconContext.Provider value={{}}>
                    <FaRegEdit />
                  </IconContext.Provider>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip>View Scan History</Tooltip>}>
                <Button>
                  <IconContext.Provider value={{}}>
                    <FaListUl />
                  </IconContext.Provider>
                </Button>
              </OverlayTrigger>
            </ButtonGroup>
          </>
        );
      },
    }),

    columnHelper.accessor((row) => row.profile_name, {
      id: "profile_name",
      cell: (profile) => <i>{profile.getValue()}</i>,
      header: () => <span>Profile Name</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("ip_range", {
      cell: (profile) => profile.getValue(),
      header: () => <span>IP Range</span>,
    }),
    columnHelper.accessor("last_scan", {
      cell: (profile) => formatDateTime(profile.getValue() as string),
      header: () => <span>Last Scan</span>,
      enableSorting: true,
    }),
    columnHelper.accessor("created_at", {
      cell: (profile) => formatDateTime(profile.getValue()),
      header: () => <span>Created At</span>,
    }),
    columnHelper.accessor("updated_at", {
      cell: (profile) => formatDateTime(profile.getValue()),
      header: () => <span>Updated At</span>,
    }),
  ];
  const profilesTable = useReactTable({
    data: profiles,
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
          id: "last_scan",
          desc: true,
        },
      ],
    },
  });

  return (
    <>
      {/* if profiles !empty */}
      {profiles.length > 0 ? (
        <Container className="mt-5">
          <Row>
            <Col>
              <h2>Scan Profiles</h2>
            </Col>
            <Col className="text-end"></Col>
          </Row>
          <Row>
            <Col>
              <div className="p-2">
                <BTable striped bordered hover responsive>
                  <thead>
                    {profilesTable.getHeaderGroups().map((headerGroup) => (
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
                            }[header.column.getIsSorted() as string] ?? null}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {profilesTable.getRowModel().rows.map((row) => (
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
                  <tfoot>
                    {profilesTable.getFooterGroups().map((footerGroup) => (
                      <tr key={footerGroup.id}>
                        {footerGroup.headers.map((header) => (
                          <th key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.footer,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </tfoot>
                </BTable>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>
                Page {profilesTable.getState().pagination.pageIndex + 1} of{" "}
                {profilesTable.getPageCount()}. Total{" "}
                {profilesTable.getRowCount()} profiles.
                {/* {tableInstance.getState().pagination.pageSize} Per Page. */}
              </p>
            </Col>
            <Col className="text-end">
              <ButtonGroup>
                <Button
                  onClick={() => profilesTable.previousPage()}
                  disabled={!profilesTable.getCanPreviousPage()}
                >
                  <IconContext.Provider
                    value={{ className: "react-icon-button" }}
                  >
                    <GrCaretPrevious />
                  </IconContext.Provider>
                </Button>
                <Button
                  onClick={() => profilesTable.nextPage()}
                  disabled={!profilesTable.getCanNextPage()}
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
        </Container>
      ) : (
        <Container
          fluid
          className="vh-100 d-flex justify-content-center align-items-center"
        >
          <Row className="w-50">
            <Col className="mb-5 text-center">
              <div className="text-warning">
                No Profiles Found. Create one by starting a new scan{" "}
                <a href="/">here</a>.
              </div>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default Profiles;
