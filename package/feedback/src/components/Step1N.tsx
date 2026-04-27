import type { Step1NProps } from "../types/internal";
import Navbar from "./common/Navbar";
import NegativeStep from "./NegativeStep";

const Step1N = ({ restaurant, onSubmit, maxDepth }: Step1NProps) => {
  return (
    <div>
      <Navbar restaurant={restaurant} />
      <NegativeStep onSubmit={onSubmit} maxDepth={maxDepth} />
    </div>
  );
};

export default Step1N;
