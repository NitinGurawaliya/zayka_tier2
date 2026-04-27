import * as react_jsx_runtime from 'react/jsx-runtime';
import { ReactNode } from 'react';

interface RestaurantDetails {
    id?: string | number;
    name?: string;
    logo?: string;
    location?: string;
    googlePlacedId?: string | null;
}
interface NegativeFeedbackSubmissionPayload {
    selectedPointIds: string[];
    selectedPoints: string[];
}
interface SubmitFeedbackPayload extends NegativeFeedbackSubmissionPayload {
    rating: number | null;
}
interface SubmitFeedbackResponse {
    feedbackId?: string | number | null;
}
interface UpdateFeedbackPayload {
    customerContact: string;
    status: "COMPLETE";
}
interface FeedbackClient {
    submitFeedback: (restaurantId: string, payload: SubmitFeedbackPayload) => Promise<SubmitFeedbackResponse>;
    updateFeedback: (feedbackId: string, payload: UpdateFeedbackPayload) => Promise<void>;
    getRestaurantDetails?: (restaurantId: string) => Promise<RestaurantDetails | null>;
}
interface FeedbackThemeTokens {
    containerClassName: string;
    cardClassName: string;
    textClassName: string;
}
interface FeedbackWidgetProps {
    restaurantId: string;
    client?: FeedbackClient;
    apiBaseUrl?: string;
    restaurant?: RestaurantDetails | null;
    mode?: "fullPage" | "embedded";
    theme?: Partial<FeedbackThemeTokens>;
    renderLoading?: ReactNode;
    onSubmitted?: (payload: SubmitFeedbackPayload) => void;
    onCompleted?: (feedbackId: string | null) => void;
    onError?: (error: unknown) => void;
}

declare function FeedbackWidget({ restaurantId, client, restaurant, mode, onSubmitted, onCompleted, onError, apiBaseUrl, }: FeedbackWidgetProps): react_jsx_runtime.JSX.Element;

type HttpMethod = "GET" | "POST" | "PATCH";
interface HttpClientRequest {
    method: HttpMethod;
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
}
interface HttpClientResponse<T = unknown> {
    data: T;
    status: number;
}
type HttpClient = <T = unknown>(request: HttpClientRequest) => Promise<HttpClientResponse<T>>;
interface CreateFeedbackClientOptions {
    baseUrl: string;
    httpClient?: HttpClient;
}
type BuildFeedbackClient = (options: CreateFeedbackClientOptions) => FeedbackClient;

declare const createFeedbackClient: BuildFeedbackClient;

export { type FeedbackClient, type FeedbackThemeTokens, FeedbackWidget, type FeedbackWidgetProps, type NegativeFeedbackSubmissionPayload, type RestaurantDetails, type SubmitFeedbackPayload, type SubmitFeedbackResponse, type UpdateFeedbackPayload, createFeedbackClient };
