"use client";

import { useEffect, useRef, useState } from "react";
import type {
  NegativeFeedbackSubmissionPayload,
  RestaurantDetails,
  SubmitFeedbackPayload,
} from "../types/public";
import { STEP_TRANSITION_MS } from "../utils/transitions";
import { useFeedbackContext } from "../widget/FeedbackProvider";
import { Step1 } from "./Step1";
import Step1N from "./Step1N";
import ThankYouStep from "./ThankYouStep";

type CurrentStep = "step1" | "step1A" | "step1Top" | "thankyou";

interface FeedbackFlowProps {
  restaurantId: string;
  restaurant?: RestaurantDetails | null;
  onSubmitted?: (payload: SubmitFeedbackPayload) => void;
  onCompleted?: (feedbackId: string | null) => void;
  onError?: (error: unknown) => void;
}

const FeedbackFlow = ({
  restaurantId,
  restaurant,
  onSubmitted,
  onCompleted,
  onError,
}: FeedbackFlowProps) => {
  const { client, mode } = useFeedbackContext();
  const [currentStep, setCurrentStep] = useState<CurrentStep>("step1");
  const [renderedStep, setRenderedStep] = useState<CurrentStep>("step1");
  const [transitionState, setTransitionState] = useState<"in" | "out">("in");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (currentStep === renderedStep) return;

    setTransitionState("out");
    transitionTimeoutRef.current = setTimeout(() => {
      setRenderedStep(currentStep);
      setTransitionState("in");
    }, STEP_TRANSITION_MS);

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [currentStep, renderedStep]);

  const handleStep1Submit = ({ rating }: { rating: number }) => {
    setSelectedRating(rating);
    if (rating <= 3) {
      setCurrentStep("step1A");
      return;
    }
    setCurrentStep("step1Top");
  };

  const handleNegativeSubmit = async (payload: NegativeFeedbackSubmissionPayload) => {
    setCurrentStep("thankyou");

    const requestPayload: SubmitFeedbackPayload = {
      rating: selectedRating,
      selectedPoints: payload.selectedPoints,
      selectedPointIds: payload.selectedPointIds,
    };

    onSubmitted?.(requestPayload);

    try {
      const response = await client.submitFeedback(restaurantId, requestPayload);
      const resolvedFeedbackId = response.feedbackId ? String(response.feedbackId) : null;
      setFeedbackId(resolvedFeedbackId);
      onCompleted?.(resolvedFeedbackId);
    } catch (error) {
      onError?.(error);
    }
  };

  const containerClass = mode === "fullPage" ? "relative min-h-screen" : "relative";

  return (
    <div className={containerClass} data-restaurant-id={restaurant?.id ?? restaurantId}>
      <div
        className={`transition-all duration-280 ease-in-out ${
          transitionState === "in"
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 translate-y-2 scale-[0.985] blur-[1.5px] pointer-events-none"
        }`}
      >
        {renderedStep === "step1" && (
          <Step1 restaurant={restaurant} onSubmit={handleStep1Submit} />
        )}
        {renderedStep === "step1A" && (
          <Step1N restaurant={restaurant} onSubmit={handleNegativeSubmit} maxDepth={3} />
        )}
        {renderedStep === "step1Top" && (
          <Step1N restaurant={restaurant} onSubmit={handleNegativeSubmit} maxDepth={1} />
        )}
        {renderedStep === "thankyou" && (
          <ThankYouStep
            client={client}
            mode={mode}
            restaurant={restaurant}
            rating={selectedRating}
            feedbackId={feedbackId}
          />
        )}
      </div>
    </div>
  );
};

export default FeedbackFlow;
