import { useEffect, useState } from "react";
import FormModal from "@/components/OptFormModal";

interface RegistrationPopupProps {
  restaurantId?: number;
  enabled?: boolean;
}

export default function RegistrationPopup({ restaurantId, enabled = true }: RegistrationPopupProps) {
  const [show, setShow] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setShow(false);
      setIsChecking(false);
      return;
    }

    let isMounted = true;
    const checkRegistered = async () => {
      try {
        setIsChecking(true);
        const res = await fetch("/api/user/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });
        if (!isMounted) return;
        if (!res.ok) {
          setShow(true);
          return;
        }
        const data = await res.json();
        const hasCustomer = Boolean(data?.customer?.mobile);
        setShow(!hasCustomer);
      } catch {
        if (!isMounted) return;
        setShow(true);
      } finally {
        if (!isMounted) return;
        setIsChecking(false);
      }
    };

    checkRegistered();

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  // When FormModal closes, do not show again
  const handleClose = (open: boolean) => {
    setShow(open);
  };

  if (!enabled || isChecking || !show) return null;

  return (
    <FormModal restaurantId={restaurantId} open={show} setOpen={handleClose} />
  );
} 