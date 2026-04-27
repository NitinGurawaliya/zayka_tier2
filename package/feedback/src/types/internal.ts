import type { ChangeEvent } from "react";
import type {
  NegativeFeedbackSubmissionPayload,
  RestaurantDetails,
} from "./public";

export interface FeedbackTreeNode {
  id: string;
  label: string;
  children?: FeedbackTreeNode[];
}

export interface NavbarProps {
  restaurant?: RestaurantDetails | null;
}

export interface RatingProps {
  restaurant?: RestaurantDetails | null;
  onSubmit?: (payload: { rating: number }) => void;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  textarea?: boolean;
}

export interface Step1Props {
  restaurant?: RestaurantDetails | null;
  onSubmit?: (payload: { rating: number }) => void;
}

export interface Step1NProps {
  restaurant?: RestaurantDetails | null;
  maxDepth?: number;
  onSubmit?: (payload: NegativeFeedbackSubmissionPayload) => void;
}

export interface NegativeStepProps {
  maxDepth?: number;
  onSubmit?: (payload: NegativeFeedbackSubmissionPayload) => void;
}
