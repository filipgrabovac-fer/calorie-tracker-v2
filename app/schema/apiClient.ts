import createClient from "openapi-fetch";
import { paths } from "./schema";

export const baseApiUrl = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

export const apiClientFetch = createClient<paths, "application/json">({
  baseUrl: baseApiUrl,
  querySerializer: {
    array: {
      style: "form",
      explode: false,
    },
  },
  credentials: "include",
});

type UntypedResponse = Promise<{ data: unknown; error: unknown }>;
type UntypedOpts = { params?: { query?: Record<string, unknown>; path?: Record<string, unknown> }; body?: unknown };

export const untypedApiClient = apiClientFetch as unknown as {
  GET: (url: string, opts?: UntypedOpts) => UntypedResponse;
  POST: (url: string, opts?: UntypedOpts) => UntypedResponse;
  PATCH: (url: string, opts?: UntypedOpts) => UntypedResponse;
  PUT: (url: string, opts?: UntypedOpts) => UntypedResponse;
  DELETE: (url: string, opts?: UntypedOpts) => UntypedResponse;
};
