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
