import * as react_jsx_runtime from 'react/jsx-runtime';

type DashboardRange = "week" | "month" | "year";
type DashboardMode = "zayka" | "sunno";
interface FeedbackDashboardProps {
    backendUrl: string;
    mode: DashboardMode;
    restaurantId: number;
    timeRange: DashboardRange;
    onTimeRangeChange: (range: string) => void;
}
declare function FeedbackDashboard({ backendUrl, mode, restaurantId, timeRange, onTimeRangeChange, }: FeedbackDashboardProps): react_jsx_runtime.JSX.Element;

export { FeedbackDashboard };
