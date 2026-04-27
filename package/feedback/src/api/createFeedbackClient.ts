import type { BuildFeedbackClient } from "./contracts";
import { defaultHttpClient } from "./defaultHttpClient";

export const createFeedbackClient: BuildFeedbackClient = ({
  baseUrl,
  httpClient = defaultHttpClient,
}) => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  return {
    submitFeedback: async (restaurantId, payload) => {
      const response = await httpClient<{ feedbackId?: string | number | null }>({
        method: "POST",
        url: `${normalizedBaseUrl}/feedback/${restaurantId}`,
        data: payload,
      });

      return {
        feedbackId: response.data?.feedbackId ?? null,
      };
    },

    updateFeedback: async (feedbackId, payload) => {
      await httpClient({
        method: "PATCH",
        url: `${normalizedBaseUrl}/feedback/${feedbackId}`,
        data: payload,
      });
    },

    getRestaurantDetails: async (restaurantId) => {
      const response = await httpClient<{
        info?: {
          restaurantName?: string;
          logo?: string;
          location?: string;
          googlePlacedId?: string | null;
        };
      }>({
        method: "GET",
        url: `${normalizedBaseUrl}/restaurant/details/${restaurantId}`,
      });

      return {
        id: restaurantId,
        name: response.data?.info?.restaurantName,
        logo: response.data?.info?.logo,
        location: response.data?.info?.location,
        googlePlacedId: response.data?.info?.googlePlacedId ?? null,
      };
    },
  };
};
