export type User = {
  id: number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
  workspace?: "the-address" | "marq";
};

export type LoginResponse = {
  message?: string;

  // The backend may return one of these names.
  token?: string;
  access_token?: string;

  user: User;
};

export type ProfileResponse = User | {
  user: User;
};