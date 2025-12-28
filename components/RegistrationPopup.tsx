import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import FormModal from "@/components/OptFormModal";

interface RegistrationPopupProps {
  restaurantId?: number;
  enabled?: boolean;
}

export default function RegistrationPopup({ restaurantId, enabled = true }: RegistrationPopupProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShow(false);
      return;
    }
    // Check for user_token cookie
    const token = Cookies.get("user_token");
    setShow(!token);
  }, [enabled]);

  // When FormModal closes, do not show again
  const handleClose = (open: boolean) => {
    setShow(open);
  };

  if (!enabled || !show) return null;

  return (
    <FormModal restaurantId={restaurantId} open={show} setOpen={handleClose} />
  );
} 