export const DEV_BYPASS =
  process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";

export type DevUser = {
  email: string;
  name: string;
};

export const DEV_USER: DevUser = {
  email: "test@test",
  name: "PM Admin (Dev Mode)",
};
