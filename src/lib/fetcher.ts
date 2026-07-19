import { AUTH_TOKEN_KEY } from "../constants/auth";

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

if (!API_URL) {
  throw new Error(
    "VITE_API_URL is missing. Add it to the .env.local file.",
  );
}

type ValidationErrors = Record<string, string[]>;

type ErrorResponse = {
  message?: string;
  errors?: ValidationErrors;
};

export class ApiError extends Error {
  status: number;
  errors?: ValidationErrors;

  constructor(
    message: string,
    status: number,
    errors?: ValidationErrors,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type FetcherOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  token?: string | null;
};

function createUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_URL}${normalizedPath}`;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  return text || null;
}

export async function fetcher<T>(
  path: string,
  options: FetcherOptions = {},
): Promise<T> {
  const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  const token = options.token ?? storedToken;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(createUrl(path), {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined,
  });

  const responseData = await parseResponse(response);

  if (!response.ok) {
    const errorData =
      typeof responseData === "object" && responseData !== null
        ? (responseData as ErrorResponse)
        : undefined;

    throw new ApiError(
      errorData?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorData?.errors,
    );
  }

  return responseData as T;
}

export function apiGet<T>(
  path: string,
  options?: Omit<FetcherOptions, "method" | "body">,
): Promise<T> {
  return fetcher<T>(path, {
    ...options,
    method: "GET",
  });
}

export function apiPost<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
  options?: Omit<FetcherOptions, "method" | "body">,
): Promise<TResponse> {
  return fetcher<TResponse>(path, {
    ...options,
    method: "POST",
    body,
  });
}

export function apiPut<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
  options?: Omit<FetcherOptions, "method" | "body">,
): Promise<TResponse> {
  return fetcher<TResponse>(path, {
    ...options,
    method: "PUT",
    body,
  });
}

export function apiDelete<T>(
  path: string,
  options?: Omit<FetcherOptions, "method" | "body">,
): Promise<T> {
  return fetcher<T>(path, {
    ...options,
    method: "DELETE",
  });
}