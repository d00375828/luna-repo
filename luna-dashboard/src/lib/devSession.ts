const envFlag = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH;
export const DEV_BYPASS = envFlag === "false" ? false : true;

export type DevUser = {
  email: string;
  name: string;
};

export const DEV_USER: DevUser = {
  email: "test@test",
  name: "PM Admin (Dev Mode)",
};
