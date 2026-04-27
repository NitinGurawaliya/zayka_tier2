import type { FeedbackTreeNode } from "../types/internal";

export const NEGATIVE_FEEDBACK_TREE: FeedbackTreeNode[] = [
  {
    id: "food-quality",
    label: "Food quality",
    children: [
      {
        id: "food-taste",
        label: "Taste issue",
        children: [
          { id: "food-too-salty", label: "Too salty" },
          { id: "food-too-spicy", label: "Too spicy" },
          { id: "food-bland", label: "Bland taste" },
        ],
      },
      {
        id: "food-freshness",
        label: "Freshness",
        children: [
          { id: "food-not-fresh", label: "Not fresh" },
          { id: "food-cold", label: "Served cold" },
          { id: "food-overcooked", label: "Overcooked" },
        ],
      },
    ],
  },
  {
    id: "service-speed",
    label: "Service speed",
    children: [
      {
        id: "wait-time",
        label: "Long wait time",
        children: [
          { id: "wait-order", label: "Order took too long" },
          { id: "wait-serving", label: "Serving was delayed" },
          { id: "wait-bill", label: "Bill took too long" },
        ],
      },
      {
        id: "service-coordination",
        label: "Coordination issue",
        children: [
          { id: "coordination-missed-item", label: "Items were missed" },
          { id: "coordination-wrong-order", label: "Wrong order served" },
        ],
      },
    ],
  },
  {
    id: "staff-behavior",
    label: "Staff behavior",
    children: [
      {
        id: "staff-attitude",
        label: "Unfriendly attitude",
        children: [
          { id: "staff-rude", label: "Rude behavior" },
          { id: "staff-not-listening", label: "Did not listen properly" },
        ],
      },
      {
        id: "staff-support",
        label: "Support issue",
        children: [
          { id: "staff-no-help", label: "No help when asked" },
          { id: "staff-slow-resolution", label: "Issue not resolved quickly" },
        ],
      },
    ],
  },
  {
    id: "cleanliness",
    label: "Cleanliness",
    children: [
      {
        id: "table-cleanliness",
        label: "Table area",
        children: [
          { id: "table-dirty", label: "Table was dirty" },
          { id: "utensils-dirty", label: "Utensils were not clean" },
        ],
      },
      {
        id: "washroom-cleanliness",
        label: "Washroom",
        children: [
          { id: "washroom-dirty", label: "Washroom was dirty" },
          { id: "washroom-no-supplies", label: "No basic supplies" },
        ],
      },
    ],
  },
  {
    id: "ambience",
    label: "Ambience",
    children: [
      {
        id: "music-noise",
        label: "Music/Noise",
        children: [
          { id: "music-too-loud", label: "Music too loud" },
          { id: "environment-noisy", label: "Environment too noisy" },
        ],
      },
      {
        id: "seating-comfort",
        label: "Seating comfort",
        children: [
          { id: "seating-uncomfortable", label: "Uncomfortable seating" },
          { id: "space-cramped", label: "Space felt cramped" },
        ],
      },
    ],
  },
  {
    id: "billing-value",
    label: "Billing & value",
    children: [
      {
        id: "billing-issue",
        label: "Billing problem",
        children: [
          { id: "billing-extra-charge", label: "Unexpected extra charge" },
          { id: "billing-error", label: "Bill had mistakes" },
        ],
      },
      {
        id: "value-for-money",
        label: "Value for money",
        children: [
          { id: "value-price-high", label: "Price felt too high" },
          { id: "value-portion-small", label: "Portion size too small" },
        ],
      },
    ],
  },
];
