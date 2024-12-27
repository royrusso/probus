import * as t from "io-ts";

export const Profile = t.type({
  profile_id: t.string,
  profile_name: t.string,
  ip_range: t.string,
  last_scan: t.union([t.string, t.undefined]),
  created_at: t.string,
  updated_at: t.string,
});

export type Profile = t.TypeOf<typeof Profile>;

export const Profiles = t.array(Profile);
export type Profiles = t.TypeOf<typeof Profiles>;

export const Address = t.type({
  address_id: t.string,
  host_id: t.string,
  address: t.string,
  address_type: t.string,
  vendor: t.union([t.string, t.undefined]),
  created_at: t.string,
});
export type Address = t.TypeOf<typeof Address>;
export const Addresses = t.array(Address);
export type Addresses = t.TypeOf<typeof Addresses>;

export const HostName = t.type({
  hostname_id: t.string,
  host_id: t.string,
  host_name: t.string,
  host_type: t.union([t.string, t.undefined]),
  created_at: t.string,
});
export type HostName = t.TypeOf<typeof HostName>;
export const HostNames = t.array(HostName);
export type HostNames = t.TypeOf<typeof HostNames>;

export const Port = t.type({
  port_id: t.string,
  host_id: t.string,
  port_number: t.number,
  protocol: t.string,
  state: t.string,
  service: t.union([t.string, t.undefined]),
  reason: t.union([t.string, t.undefined]),
  created_at: t.string,
});
export type Port = t.TypeOf<typeof Port>;
export const Ports = t.array(Port);
export type Ports = t.TypeOf<typeof Ports>;

export const Host = t.type({
  host_id: t.string,
  scan_id: t.string,
  latency: t.union([t.number, t.undefined]),
  state: t.string,
  reason: t.union([t.string, t.undefined]),
  start_time: t.string,
  end_time: t.string,
  created_at: t.string,
  addresses: Addresses,
  hostnames: HostNames,
  ports: Ports,
});
export type Host = t.TypeOf<typeof Host>;
export const Hosts = t.array(Host);
export type Hosts = t.TypeOf<typeof Hosts>;

export const ScanEvent = t.type({
  scan_id: t.string,
  profile_id: t.string,
  scan_command: t.string,
  scan_started: t.string,
  scan_end: t.string,
  scan_status: t.string,
  scan_summary: t.union([t.string, t.undefined]),
  hosts: Hosts,
});

export type ScanEvent = t.TypeOf<typeof ScanEvent>;
export const ScanEvents = t.array(ScanEvent);
export type ScanEvents = t.TypeOf<typeof ScanEvents>;
