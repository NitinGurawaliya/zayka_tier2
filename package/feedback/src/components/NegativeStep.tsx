"use client";

import { useEffect, useRef, useState } from "react";
import { NEGATIVE_FEEDBACK_TREE } from "../constants/negativeFeedbackTree";
import type { FeedbackTreeNode, NegativeStepProps } from "../types/internal";
import { NODE_TRANSITION_MS } from "../utils/transitions";
import NegativeOptionsList from "./negative/NegativeOptionsList";
import NegativeStepHeader from "./negative/NegativeStepHeader";

const NegativeStep = ({ onSubmit, maxDepth = 3 }: NegativeStepProps) => {
  const [currentNodes, setCurrentNodes] =
    useState<FeedbackTreeNode[]>(NEGATIVE_FEEDBACK_TREE);
  const [renderedNodes, setRenderedNodes] =
    useState<FeedbackTreeNode[]>(NEGATIVE_FEEDBACK_TREE);
  const [transitionState, setTransitionState] = useState<"in" | "out">("in");
  const [selectedNodes, setSelectedNodes] = useState<FeedbackTreeNode[]>([]);
  const nodesTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
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

  const handleNodeSelect = (node: FeedbackTreeNode) => {
    const nextSelected = [...selectedNodes, node];
    setSelectedNodes(nextSelected);

    if (node.children && node.children.length > 0 && nextSelected.length < maxDepth) {
      setCurrentNodes(node.children);
      return;
    }

    onSubmit?.({
      selectedPointIds: nextSelected.map((selectedNode) => selectedNode.id),
      selectedPoints: nextSelected.map((selectedNode) => selectedNode.label),
    });
  };

  return (
    <div className="flex flex-col bg-white max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-28 space-y-8">
        <NegativeStepHeader />
        <div
          className={`transition-all duration-260 ease-in-out ${
            transitionState === "in"
              ? "opacity-100 translate-y-0 scale-100 blur-0"
              : "opacity-0 translate-y-2 scale-[0.985] blur-[1.5px] pointer-events-none"
          }`}
        >
          <NegativeOptionsList options={renderedNodes} onSelect={handleNodeSelect} />
        </div>
      </div>
    </div>
  );
};

export default NegativeStep;
