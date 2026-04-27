import type {
  FeedbackClient,
  SubmitFeedbackPayload,
  SubmitFeedbackResponse,
  UpdateFeedbackPayload,
} from "../types/public";

export type HttpMethod = "GET" | "POST" | "PATCH";

export interface HttpClientRequest {
  method: HttpMethod;
  url: string;
  data?: unknown;
  headers?: Record<string, string>;
}

export interface HttpClientResponse<T = unknown> {
  data: T;
  status: number;
}

export type HttpClient = <T = unknown>(
  request: HttpClientRequest
) => Promise<HttpClientResponse<T>>;

export interface CreateFeedbackClientOptions {
  baseUrl: string;
  httpClient?: HttpClient;
}

export type SubmitFeedback = (
  restaurantId: string,
  payload: SubmitFeedbackPayload
) => Promise<SubmitFeedbackResponse>;

export type UpdateFeedback = (
  feedbackId: string,
  payload: UpdateFeedbackPayload
) => Promise<void>;

export type BuildFeedbackClient = (
  options: CreateFeedbackClientOptions
) => FeedbackClient;
