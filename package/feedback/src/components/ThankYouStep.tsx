"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeedbackClient, RestaurantDetails } from "../types/public";
import { buildGoogleReviewUrl } from "../utils/reviewUrl";
import FeedbackBottomSheet from "./common/FeedbackBottomSheet";
import Input from "./common/Input";
import Navbar from "./common/Navbar";

interface ThankYouStepProps {
  client: FeedbackClient;
  mode: "fullPage" | "embedded";
  restaurant?: RestaurantDetails | null;
  rating: number | null;
  feedbackId: string | null;
}

type NegativeSheetState = "prompt" | "contact" | "sending" | "done" | "error";

const ThankYouStep = ({
  client,
  mode,
  restaurant,
  rating,
  feedbackId,
}: ThankYouStepProps) => {
  const isNegative = (rating ?? 0) <= 3;
  const isPositive = (rating ?? 0) >= 4;
  const hasGooglePlaceId = Boolean(restaurant?.googlePlacedId?.trim());
  const googleReviewUrl = useMemo(
    () => buildGoogleReviewUrl(restaurant?.googlePlacedId),
    [restaurant?.googlePlacedId]
  );

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [negativeSheetState, setNegativeSheetState] =
    useState<NegativeSheetState>("prompt");
  const [phone, setPhone] = useState("");
  const [contactError, setContactError] = useState("");
  const isPhoneValid = phone.trim() !== "";

  useEffect(() => {
    if ((isNegative || (isPositive && hasGooglePlaceId)) && !isSheetOpen) {
      const timeoutId = setTimeout(() => setIsSheetOpen(true), 500);
      return () => clearTimeout(timeoutId);
    }
  }, [hasGooglePlaceId, isNegative, isPositive, isSheetOpen]);

  const dismissSheet = () => {
    setIsSheetOpen(false);
  };

  const handleContactSubmit = async () => {
    if (!feedbackId || !isPhoneValid) {
      setContactError("Please enter your number.");
      return;
    }

    setContactError("");
    setNegativeSheetState("sending");

    try {
      await client.updateFeedback(feedbackId, {
        customerContact: phone.trim(),
        status: "COMPLETE",
      });
      setNegativeSheetState("done");
      setTimeout(() => setIsSheetOpen(false), 2000);
    } catch {
      setNegativeSheetState("error");
      setContactError("Something went wrong, try again");
    }
  };

  const renderNegativeSheetContent = () => {
    if (negativeSheetState === "prompt") {
      return (
        <div className="space-y-4">
          <p className="text-base font-semibold text-gray-900">
            Want the owner to follow up with you?
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setNegativeSheetState("contact")}
              className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
            >
              Yes, reach out to me
            </button>
            <button
              type="button"
              onClick={dismissSheet}
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
            >
              No thanks
            </button>
          </div>
        </div>
      );
    }

    if (negativeSheetState === "done") {
      return (
        <p className="text-sm font-medium text-gray-800">
          Done - the owner will reach out shortly
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <Input
          label="Your number"
          placeholder="+91 __________"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {contactError && <p className="text-sm text-red-600">{contactError}</p>}
        <button
          type="button"
          onClick={handleContactSubmit}
          disabled={!isPhoneValid || negativeSheetState === "sending"}
          className={`w-full rounded-xl px-4 py-3 text-sm font-medium text-white ${
            !isPhoneValid || negativeSheetState === "sending"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-900 hover:opacity-90"
          }`}
        >
          {negativeSheetState === "sending" ? "Sending..." : "Send"}
        </button>
      </div>
    );
  };

  const renderPositiveSheetContent = () => (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-base font-semibold text-gray-900">
          Enjoying {restaurant?.name ?? "our place"}?
        </p>
        <p className="text-sm text-gray-600">Help others discover us on Google</p>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!googleReviewUrl) return;
          window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
        }}
        className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white"
      >
        ⭐ Share on Google
      </button>
      <button
        type="button"
        onClick={dismissSheet}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
      >
        Maybe later
      </button>
    </div>
  );

  return (
    <div
      className={`bg-white max-w-md mx-auto ${
        mode === "fullPage" ? "min-h-screen" : "min-h-[480px]"
      }`}
    >
      <Navbar restaurant={restaurant} />
      <div className="px-5 pt-12 pb-10 text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">
          {isNegative ? "Thank you for your feedback" : "Thank you!"}
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {isNegative
            ? "We appreciate your honesty and will work on improving."
            : "So glad you had a great experience."}
        </p>
      </div>

      <FeedbackBottomSheet
        isOpen={isSheetOpen}
        onDismiss={dismissSheet}
        lockScroll={mode === "fullPage"}
      >
        {isNegative ? renderNegativeSheetContent() : renderPositiveSheetContent()}
      </FeedbackBottomSheet>
    </div>
  );
};

export default ThankYouStep;
