import {
  BadgeAlert,
  Banknote,
  ChefHat,
  Clock3,
  GlassWater,
  Sparkles,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { FeedbackTreeNode } from "../../types/internal";

interface NegativeOptionsListProps {
  options: FeedbackTreeNode[];
  onSelect: (node: FeedbackTreeNode) => void;
}

const TOP_LEVEL_ICON_MAP: Record<string, LucideIcon> = {
  "food-quality": UtensilsCrossed,
  "service-speed": Clock3,
  "staff-behavior": Users,
  cleanliness: Sparkles,
  ambience: GlassWater,
  "billing-value": Banknote,
};

const getNodeIcon = (nodeId: string): LucideIcon => {
  if (TOP_LEVEL_ICON_MAP[nodeId]) return TOP_LEVEL_ICON_MAP[nodeId];
  if (nodeId.includes("food")) return ChefHat;
  if (nodeId.includes("wait") || nodeId.includes("service")) return Clock3;
  if (nodeId.includes("staff")) return Users;
  if (nodeId.includes("clean") || nodeId.includes("washroom")) return Sparkles;
  if (nodeId.includes("billing") || nodeId.includes("value")) return Banknote;
  return BadgeAlert;
};

const OptionCard = ({
  node,
  onSelect,
}: {
  node: FeedbackTreeNode;
  onSelect: (node: FeedbackTreeNode) => void;
}) => {
  const Icon = getNodeIcon(node.id);

  return (
    <button
      type="button"
      onClick={() => onSelect(node)}
      className="group flex min-h-28 w-full flex-col items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-4 text-center transition hover:-translate-y-0.5 hover:border-zinc-700"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800 text-amber-400 transition group-hover:bg-zinc-700">
        <Icon size={20} strokeWidth={2} />
      </span>
      <span className="text-sm font-medium leading-snug text-zinc-100">{node.label}</span>
    </button>
  );
};

const NegativeOptionsList = ({ options, onSelect }: NegativeOptionsListProps) => {
  return (
    <div className="grid grid-cols-2 gap-3 lg:gap-4 xl:gap-5">
      {options.map((node) => (
        <OptionCard key={node.id} node={node} onSelect={onSelect} />
      ))}
    </div>
  );
};

export default NegativeOptionsList;
