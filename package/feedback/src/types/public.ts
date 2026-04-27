import type { ReactNode } from "react";

export interface RestaurantDetails {
  id?: string | number;
  name?: string;
  logo?: string;
  location?: string;
  googlePlacedId?: string | null;
}

export interface NegativeFeedbackSubmissionPayload {
  selectedPointIds: string[];
  selectedPoints: string[];
}

export interface SubmitFeedbackPayload extends NegativeFeedbackSubmissionPayload {
  rating: number | null;
}

export interface SubmitFeedbackResponse {
  feedbackId?: string | number | null;
}

export interface UpdateFeedbackPayload {
  customerContact: string;
  status: "COMPLETE";
}

export interface FeedbackClient {
  submitFeedback: (
    restaurantId: string,
    payload: SubmitFeedbackPayload
  ) => Promise<SubmitFeedbackResponse>;
  updateFeedback: (
    feedbackId: string,
    payload: UpdateFeedbackPayload
  ) => Promise<void>;
  getRestaurantDetails?: (restaurantId: string) => Promise<RestaurantDetails | null>;
}

export interface FeedbackThemeTokens {
  containerClassName: string;
  cardClassName: string;
  textClassName: string;
}

export interface FeedbackWidgetProps {
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
