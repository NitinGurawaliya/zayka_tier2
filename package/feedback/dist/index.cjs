"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  FeedbackWidget: () => FeedbackWidget,
  createFeedbackClient: () => createFeedbackClient
});
module.exports = __toCommonJS(index_exports);

// src/widget/FeedbackWidget.tsx
var import_react7 = require("react");

// src/api/defaultHttpClient.ts
var import_axios = __toESM(require("axios"), 1);
var defaultHttpClient = async (request) => {
  const response = await (0, import_axios.default)({
    method: request.method,
    url: request.url,
    data: request.data,
    headers: request.headers
  });
  return {
    data: response.data,
    status: response.status
  };
};

// src/api/createFeedbackClient.ts
var createFeedbackClient = ({
  baseUrl,
  httpClient = defaultHttpClient
}) => {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  return {
    submitFeedback: async (restaurantId, payload) => {
      const response = await httpClient({
        method: "POST",
        url: `${normalizedBaseUrl}/feedback/${restaurantId}`,
        data: payload
      });
      return {
        feedbackId: response.data?.feedbackId ?? null
      };
    },
    updateFeedback: async (feedbackId, payload) => {
      await httpClient({
        method: "PATCH",
        url: `${normalizedBaseUrl}/feedback/${feedbackId}`,
        data: payload
      });
    },
    getRestaurantDetails: async (restaurantId) => {
      const response = await httpClient({
        method: "GET",
        url: `${normalizedBaseUrl}/restaurant/details/${restaurantId}`
      });
      return {
        id: restaurantId,
        name: response.data?.info?.restaurantName,
        logo: response.data?.info?.logo,
        location: response.data?.info?.location,
        googlePlacedId: response.data?.info?.googlePlacedId ?? null
      };
    }
  };
};

// src/components/FeedbackFlow.tsx
var import_react6 = require("react");

// src/utils/transitions.ts
var STEP_TRANSITION_MS = 220;
var NODE_TRANSITION_MS = 200;

// src/widget/FeedbackProvider.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var FeedbackContext = (0, import_react.createContext)(null);
function FeedbackProvider({
  client,
  mode,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackContext.Provider, { value: { client, mode }, children });
}
function useFeedbackContext() {
  const context = (0, import_react.useContext)(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbackContext must be used within FeedbackProvider.");
  }
  return context;
}

// src/components/common/Navbar.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
var Navbar = ({ restaurant }) => {
  const restaurantName = restaurant?.name ?? "Restaurant";
  const restaurantLocation = restaurant?.location ?? "";
  const restaurantLogo = restaurant?.logo ?? "https://res.cloudinary.com/dixjcb4on/image/upload/v1741629142/dishes_image/hillPoint_logo.png";
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("nav", { className: "bg-white w-full border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center justify-between px-2 py-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "h-14 w-14 rounded-full overflow-hidden bg-green-500 flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
        "img",
        {
          src: restaurantLogo,
          className: "h-full w-full object-cover",
          alt: `${restaurantName} logo`
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "leading-tight", children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-sm font-semibold text-gray-900", children: restaurantName }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("p", { className: "text-xs text-gray-500", children: restaurantLocation })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "text-xs text-gray-400", children: "by Zayka" })
  ] }) });
};
var Navbar_default = Navbar;

// src/components/common/Rating.tsx
var import_react2 = require("react");

// src/constants/feedbackOptions.ts
var feedbackOptions = [
  {
    label: "Excellent",
    rating: 5,
    imageUrl: "https://res.cloudinary.com/dixjcb4on/image/upload/v1776754109/dishes_image/reason_excellent.png"
  },
  {
    label: "Good",
    rating: 4,
    imageUrl: "https://res.cloudinary.com/dixjcb4on/image/upload/v1776754109/dishes_image/reason_good.png"
  },
  {
    label: "Average",
    rating: 3,
    imageUrl: "https://res.cloudinary.com/dixjcb4on/image/upload/v1776754108/dishes_image/reason_average.png"
  },
  {
    label: "Poor",
    rating: 2,
    imageUrl: "https://res.cloudinary.com/dixjcb4on/image/upload/v1776754108/dishes_image/reason_poor.png"
  },
  {
    label: "Very Poor",
    rating: 1,
    imageUrl: "https://res.cloudinary.com/dixjcb4on/image/upload/v1776754108/dishes_image/reason_very_poor.png"
  }
];

// src/components/common/Rating.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var fallbackRatingIcon = (rating) => {
  const fallbackMap = {
    5: "\u{1F929}",
    4: "\u{1F642}",
    3: "\u{1F610}",
    2: "\u{1F641}",
    1: "\u{1F61E}"
  };
  return fallbackMap[rating] ?? "\u2B50";
};
var Rating = ({ onSubmit }) => {
  const [selectedRating, setSelectedRating] = (0, import_react2.useState)(null);
  const [failedImages, setFailedImages] = (0, import_react2.useState)({});
  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    onSubmit?.({ rating });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "h-full flex flex-col bg-white max-w-md lg:max-w-3xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex-1 overflow-y-auto px-5 pt-8 pb-24 space-y-10", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-center space-y-0", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h2", { className: "text-xl font-semibold text-gray-700", children: "How was your experience with us" }) }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "space-y-2", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex flex-col items-center gap-6 pt-2 lg:flex-row lg:justify-center lg:gap-6", children: feedbackOptions.map((item) => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "button",
      {
        type: "button",
        onClick: () => handleRatingSelect(item.rating),
        className: "flex w-24 flex-col items-center gap-2",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: `transition duration-200 ${selectedRating === item.rating ? "scale-110" : ""}`,
              children: failedImages[item.rating] ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "h-14 w-14 flex items-center justify-center text-3xl", children: fallbackRatingIcon(item.rating) }) : /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "img",
                {
                  src: item.imageUrl,
                  alt: item.label,
                  className: "h-14 w-14 object-contain",
                  onError: () => {
                    setFailedImages((previous) => ({
                      ...previous,
                      [item.rating]: true
                    }));
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "text-center text-[11px] leading-tight text-gray-600", children: item.label })
        ]
      },
      item.rating
    )) }) })
  ] }) });
};
var Rating_default = Rating;

// src/components/Step1.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
var Step1 = ({ restaurant, onSubmit }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Navbar_default, { restaurant }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Rating_default, { restaurant: restaurant ?? null, onSubmit })
  ] });
};

// src/components/NegativeStep.tsx
var import_react3 = require("react");

// src/constants/negativeFeedbackTree.ts
var NEGATIVE_FEEDBACK_TREE = [
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
          { id: "food-bland", label: "Bland taste" }
        ]
      },
      {
        id: "food-freshness",
        label: "Freshness",
        children: [
          { id: "food-not-fresh", label: "Not fresh" },
          { id: "food-cold", label: "Served cold" },
          { id: "food-overcooked", label: "Overcooked" }
        ]
      }
    ]
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
          { id: "wait-bill", label: "Bill took too long" }
        ]
      },
      {
        id: "service-coordination",
        label: "Coordination issue",
        children: [
          { id: "coordination-missed-item", label: "Items were missed" },
          { id: "coordination-wrong-order", label: "Wrong order served" }
        ]
      }
    ]
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
          { id: "staff-not-listening", label: "Did not listen properly" }
        ]
      },
      {
        id: "staff-support",
        label: "Support issue",
        children: [
          { id: "staff-no-help", label: "No help when asked" },
          { id: "staff-slow-resolution", label: "Issue not resolved quickly" }
        ]
      }
    ]
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
          { id: "utensils-dirty", label: "Utensils were not clean" }
        ]
      },
      {
        id: "washroom-cleanliness",
        label: "Washroom",
        children: [
          { id: "washroom-dirty", label: "Washroom was dirty" },
          { id: "washroom-no-supplies", label: "No basic supplies" }
        ]
      }
    ]
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
          { id: "environment-noisy", label: "Environment too noisy" }
        ]
      },
      {
        id: "seating-comfort",
        label: "Seating comfort",
        children: [
          { id: "seating-uncomfortable", label: "Uncomfortable seating" },
          { id: "space-cramped", label: "Space felt cramped" }
        ]
      }
    ]
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
          { id: "billing-error", label: "Bill had mistakes" }
        ]
      },
      {
        id: "value-for-money",
        label: "Value for money",
        children: [
          { id: "value-price-high", label: "Price felt too high" },
          { id: "value-portion-small", label: "Portion size too small" }
        ]
      }
    ]
  }
];

// src/components/negative/NegativeOptionsList.tsx
var import_lucide_react = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var TOP_LEVEL_ICON_MAP = {
  "food-quality": import_lucide_react.UtensilsCrossed,
  "service-speed": import_lucide_react.Clock3,
  "staff-behavior": import_lucide_react.Users,
  cleanliness: import_lucide_react.Sparkles,
  ambience: import_lucide_react.GlassWater,
  "billing-value": import_lucide_react.Banknote
};
var getNodeIcon = (nodeId) => {
  if (TOP_LEVEL_ICON_MAP[nodeId]) return TOP_LEVEL_ICON_MAP[nodeId];
  if (nodeId.includes("food")) return import_lucide_react.ChefHat;
  if (nodeId.includes("wait") || nodeId.includes("service")) return import_lucide_react.Clock3;
  if (nodeId.includes("staff")) return import_lucide_react.Users;
  if (nodeId.includes("clean") || nodeId.includes("washroom")) return import_lucide_react.Sparkles;
  if (nodeId.includes("billing") || nodeId.includes("value")) return import_lucide_react.Banknote;
  return import_lucide_react.BadgeAlert;
};
var OptionCard = ({
  node,
  onSelect
}) => {
  const Icon = getNodeIcon(node.id);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "button",
    {
      type: "button",
      onClick: () => onSelect(node),
      className: "group flex min-h-28 w-full flex-col items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center transition hover:-translate-y-0.5 hover:border-zinc-700",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-amber-400 transition group-hover:bg-zinc-700", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Icon, { size: 20, strokeWidth: 2 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "text-sm font-medium leading-snug text-zinc-100", children: node.label })
      ]
    }
  );
};
var NegativeOptionsList = ({ options, onSelect }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "grid grid-cols-2 gap-3 lg:gap-4 xl:gap-5", children: options.map((node) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(OptionCard, { node, onSelect }, node.id)) });
};
var NegativeOptionsList_default = NegativeOptionsList;

// src/components/negative/NegativeStepHeader.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var NegativeStepHeader = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "text-center space-y-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h2", { className: "text-xl font-semibold text-gray-900", children: "We're listening" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "text-sm text-gray-500 max-w-xs mx-auto leading-relaxed", children: "Please guide us to the exact issue so we can improve quickly." })
  ] });
};
var NegativeStepHeader_default = NegativeStepHeader;

// src/components/NegativeStep.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var NegativeStep = ({ onSubmit, maxDepth = 3 }) => {
  const [currentNodes, setCurrentNodes] = (0, import_react3.useState)(NEGATIVE_FEEDBACK_TREE);
  const [renderedNodes, setRenderedNodes] = (0, import_react3.useState)(NEGATIVE_FEEDBACK_TREE);
  const [transitionState, setTransitionState] = (0, import_react3.useState)("in");
  const [selectedNodes, setSelectedNodes] = (0, import_react3.useState)([]);
  const nodesTransitionTimeoutRef = (0, import_react3.useRef)(
    null
  );
  (0, import_react3.useEffect)(() => {
    if (currentNodes === renderedNodes) return;
    setTransitionState("out");
    nodesTransitionTimeoutRef.current = setTimeout(() => {
      setRenderedNodes(currentNodes);
      setTransitionState("in");
    }, NODE_TRANSITION_MS);
    return () => {
      if (nodesTransitionTimeoutRef.current) {
        clearTimeout(nodesTransitionTimeoutRef.current);
      }
    };
  }, [currentNodes, renderedNodes]);
  const handleNodeSelect = (node) => {
    const nextSelected = [...selectedNodes, node];
    setSelectedNodes(nextSelected);
    if (node.children && node.children.length > 0 && nextSelected.length < maxDepth) {
      setCurrentNodes(node.children);
      return;
    }
    onSubmit?.({
      selectedPointIds: nextSelected.map((selectedNode) => selectedNode.id),
      selectedPoints: nextSelected.map((selectedNode) => selectedNode.label)
    });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { className: "flex flex-col bg-white max-w-3xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "flex-1 overflow-y-auto px-5 pt-8 pb-28 space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(NegativeStepHeader_default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "div",
      {
        className: `transition-all duration-260 ease-in-out ${transitionState === "in" ? "opacity-100 translate-y-0 scale-100 blur-0" : "opacity-0 translate-y-2 scale-[0.985] blur-[1.5px] pointer-events-none"}`,
        children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(NegativeOptionsList_default, { options: renderedNodes, onSelect: handleNodeSelect })
      }
    )
  ] }) });
};
var NegativeStep_default = NegativeStep;

// src/components/Step1N.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var Step1N = ({ restaurant, onSubmit, maxDepth }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Navbar_default, { restaurant }),
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(NegativeStep_default, { onSubmit, maxDepth })
  ] });
};
var Step1N_default = Step1N;

// src/components/ThankYouStep.tsx
var import_react5 = require("react");

// src/utils/reviewUrl.ts
function buildGoogleReviewUrl(placeId) {
  if (!placeId?.trim()) {
    return "";
  }
  return `https://search.google.com/local/writereview?placeid=${placeId}`;
}

// src/components/common/FeedbackBottomSheet.tsx
var import_react4 = require("react");
var import_jsx_runtime9 = require("react/jsx-runtime");
var FeedbackBottomSheet = ({
  isOpen,
  onDismiss,
  children,
  lockScroll = true
}) => {
  const [isMounted, setIsMounted] = (0, import_react4.useState)(isOpen);
  const [isVisible, setIsVisible] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    if (isOpen) {
      setIsMounted(true);
      const frameId = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frameId);
    }
    setIsVisible(false);
    const timeoutId = setTimeout(() => setIsMounted(false), 240);
    return () => clearTimeout(timeoutId);
  }, [isOpen]);
  (0, import_react4.useEffect)(() => {
    if (!isMounted || !lockScroll) return;
    const { overflow: bodyOverflow } = document.body.style;
    const { overflow: htmlOverflow } = document.documentElement.style;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
    };
  }, [isMounted, lockScroll]);
  if (!isMounted) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className: "fixed inset-x-0 top-0 z-50 flex items-end justify-center overflow-hidden px-3 pt-3 sm:px-4 sm:pt-4",
      style: {
        height: "100svh",
        paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            type: "button",
            "aria-label": "Dismiss bottom sheet",
            onClick: onDismiss,
            className: `absolute inset-0 bg-black/45 transition-opacity duration-200 ${isVisible ? "opacity-100" : "opacity-0"}`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "div",
          {
            className: `relative w-full max-w-md max-h-[calc(100svh-0.75rem)] overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-240 sm:max-h-[calc(100svh-1rem)] ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`,
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
              "div",
              {
                className: "max-h-[calc(100svh-0.75rem)] overflow-y-auto overscroll-contain p-4 sm:max-h-[calc(100svh-1rem)] sm:p-5",
                style: {
                  WebkitOverflowScrolling: "touch",
                  paddingBottom: "max(env(safe-area-inset-bottom), 1rem)"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-200" }),
                  children
                ]
              }
            )
          }
        )
      ]
    }
  );
};
var FeedbackBottomSheet_default = FeedbackBottomSheet;

// src/components/common/Input.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
var Input = ({
  label,
  placeholder,
  value,
  onChange,
  textarea = false
}) => {
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)("div", { className: "space-y-2", children: [
    label && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { className: "text-sm font-medium text-gray-800", children: label }),
    textarea ? /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "textarea",
      {
        value,
        onChange,
        placeholder,
        className: "w-full h-32 p-4 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "input",
      {
        value,
        onChange,
        placeholder,
        className: "w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300"
      }
    )
  ] });
};
var Input_default = Input;

// src/components/ThankYouStep.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var ThankYouStep = ({
  client,
  mode,
  restaurant,
  rating,
  feedbackId
}) => {
  const isNegative = (rating ?? 0) <= 3;
  const isPositive = (rating ?? 0) >= 4;
  const hasGooglePlaceId = Boolean(restaurant?.googlePlacedId?.trim());
  const googleReviewUrl = (0, import_react5.useMemo)(
    () => buildGoogleReviewUrl(restaurant?.googlePlacedId),
    [restaurant?.googlePlacedId]
  );
  const [isSheetOpen, setIsSheetOpen] = (0, import_react5.useState)(false);
  const [negativeSheetState, setNegativeSheetState] = (0, import_react5.useState)("prompt");
  const [phone, setPhone] = (0, import_react5.useState)("");
  const [contactError, setContactError] = (0, import_react5.useState)("");
  const isPhoneValid = phone.trim() !== "";
  (0, import_react5.useEffect)(() => {
    if ((isNegative || isPositive && hasGooglePlaceId) && !isSheetOpen) {
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
        status: "COMPLETE"
      });
      setNegativeSheetState("done");
      setTimeout(() => setIsSheetOpen(false), 2e3);
    } catch {
      setNegativeSheetState("error");
      setContactError("Something went wrong, try again");
    }
  };
  const renderNegativeSheetContent = () => {
    if (negativeSheetState === "prompt") {
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-base font-semibold text-gray-900", children: "Want the owner to follow up with you?" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              type: "button",
              onClick: () => setNegativeSheetState("contact"),
              className: "rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white",
              children: "Yes, reach out to me"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              type: "button",
              onClick: dismissSheet,
              className: "rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700",
              children: "No thanks"
            }
          )
        ] })
      ] });
    }
    if (negativeSheetState === "done") {
      return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm font-medium text-gray-800", children: "Done - the owner will reach out shortly" });
    }
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        Input_default,
        {
          label: "Your number",
          placeholder: "+91 __________",
          value: phone,
          onChange: (e) => setPhone(e.target.value)
        }
      ),
      contactError && /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-red-600", children: contactError }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
        "button",
        {
          type: "button",
          onClick: handleContactSubmit,
          disabled: !isPhoneValid || negativeSheetState === "sending",
          className: `w-full rounded-xl px-4 py-3 text-sm font-medium text-white ${!isPhoneValid || negativeSheetState === "sending" ? "bg-gray-300 cursor-not-allowed" : "bg-gray-900 hover:opacity-90"}`,
          children: negativeSheetState === "sending" ? "Sending..." : "Send"
        }
      )
    ] });
  };
  const renderPositiveSheetContent = () => /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "space-y-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("p", { className: "text-base font-semibold text-gray-900", children: [
        "Enjoying ",
        restaurant?.name ?? "our place",
        "?"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-gray-600", children: "Help others discover us on Google" })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        type: "button",
        onClick: () => {
          if (!googleReviewUrl) return;
          window.open(googleReviewUrl, "_blank", "noopener,noreferrer");
        },
        className: "w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white",
        children: "\u2B50 Share on Google"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        type: "button",
        onClick: dismissSheet,
        className: "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700",
        children: "Maybe later"
      }
    )
  ] });
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
    "div",
    {
      className: `bg-white max-w-md mx-auto ${mode === "fullPage" ? "min-h-screen" : "min-h-[480px]"}`,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Navbar_default, { restaurant }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "px-5 pt-12 pb-10 text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h2", { className: "text-2xl font-semibold text-gray-900", children: isNegative ? "Thank you for your feedback" : "Thank you!" }),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-sm text-gray-600 leading-relaxed", children: isNegative ? "We appreciate your honesty and will work on improving." : "So glad you had a great experience." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          FeedbackBottomSheet_default,
          {
            isOpen: isSheetOpen,
            onDismiss: dismissSheet,
            lockScroll: mode === "fullPage",
            children: isNegative ? renderNegativeSheetContent() : renderPositiveSheetContent()
          }
        )
      ]
    }
  );
};
var ThankYouStep_default = ThankYouStep;

// src/components/FeedbackFlow.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var FeedbackFlow = ({
  restaurantId,
  restaurant,
  onSubmitted,
  onCompleted,
  onError
}) => {
  const { client, mode } = useFeedbackContext();
  const [currentStep, setCurrentStep] = (0, import_react6.useState)("step1");
  const [renderedStep, setRenderedStep] = (0, import_react6.useState)("step1");
  const [transitionState, setTransitionState] = (0, import_react6.useState)("in");
  const [selectedRating, setSelectedRating] = (0, import_react6.useState)(null);
  const [feedbackId, setFeedbackId] = (0, import_react6.useState)(null);
  const transitionTimeoutRef = (0, import_react6.useRef)(null);
  (0, import_react6.useEffect)(() => {
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
  const handleStep1Submit = ({ rating }) => {
    setSelectedRating(rating);
    if (rating <= 3) {
      setCurrentStep("step1A");
      return;
    }
    setCurrentStep("step1Top");
  };
  const handleNegativeSubmit = async (payload) => {
    setCurrentStep("thankyou");
    const requestPayload = {
      rating: selectedRating,
      selectedPoints: payload.selectedPoints,
      selectedPointIds: payload.selectedPointIds
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
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: containerClass, "data-restaurant-id": restaurant?.id ?? restaurantId, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
    "div",
    {
      className: `transition-all duration-280 ease-in-out ${transitionState === "in" ? "opacity-100 translate-y-0 scale-100 blur-0" : "opacity-0 translate-y-2 scale-[0.985] blur-[1.5px] pointer-events-none"}`,
      children: [
        renderedStep === "step1" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Step1, { restaurant, onSubmit: handleStep1Submit }),
        renderedStep === "step1A" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Step1N_default, { restaurant, onSubmit: handleNegativeSubmit, maxDepth: 3 }),
        renderedStep === "step1Top" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Step1N_default, { restaurant, onSubmit: handleNegativeSubmit, maxDepth: 1 }),
        renderedStep === "thankyou" && /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
          ThankYouStep_default,
          {
            client,
            mode,
            restaurant,
            rating: selectedRating,
            feedbackId
          }
        )
      ]
    }
  ) });
};
var FeedbackFlow_default = FeedbackFlow;

// src/widget/FeedbackWidget.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
function FeedbackWidget({
  restaurantId,
  client,
  restaurant = null,
  mode = "embedded",
  onSubmitted,
  onCompleted,
  onError,
  apiBaseUrl
}) {
  const resolvedClient = (0, import_react7.useMemo)(() => {
    if (client) {
      return client;
    }
    if (apiBaseUrl) {
      return createFeedbackClient({ baseUrl: apiBaseUrl });
    }
    throw new Error(
      "FeedbackWidget requires either `client` or `apiBaseUrl`."
    );
  }, [apiBaseUrl, client]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(FeedbackProvider, { client: resolvedClient, mode, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
    FeedbackFlow_default,
    {
      restaurantId,
      restaurant,
      onSubmitted,
      onCompleted,
      onError
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FeedbackWidget,
  createFeedbackClient
});
//# sourceMappingURL=index.cjs.map