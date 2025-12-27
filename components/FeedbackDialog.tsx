"use client";

import type React from "react";
import { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface FeedbackDialogProps {
  restaurantId: number;
  restaurantName?: string;
  trigger?: React.ReactNode;
}

export default function FeedbackDialog({
  restaurantId,
  restaurantName,
  trigger,
}: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const title = useMemo(() => {
    if (!restaurantName) return "Feedback";
    return `${restaurantName} के लिए Feedback`;
  }, [restaurantName]);

  const submit = async () => {
    if (!stars) {
      setError("कृपया rating चुनें (1 से 5).");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/restaurant/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          stars,
          message: message.trim() ? message.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.msg || "Feedback submit नहीं हो पाया.");
      }

      setSuccess("धन्यवाद! आपका feedback submit हो गया।");
      setStars(0);
      setMessage("");
      setTimeout(() => setOpen(false), 800);
    } catch (e: any) {
      setError(e?.message || "Feedback submit नहीं हो पाया.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            अपनी rating और छोटा सा message शेयर करें।
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setStars(n)}
                className="p-1"
                aria-label={`${n} स्टार`}
              >
                <Star
                  className={
                    n <= stars
                      ? "h-6 w-6 fill-yellow-400 text-yellow-400"
                      : "h-6 w-6 text-gray-300"
                  }
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">{stars || 0}/5</span>
          </div>

          <Textarea
            placeholder="Message (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[110px]"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

