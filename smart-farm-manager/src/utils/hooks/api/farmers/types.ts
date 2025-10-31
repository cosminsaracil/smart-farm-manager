export type Farmer = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "worker";
  __v?: number;
};

export type FarmerPayload = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "worker";
};
