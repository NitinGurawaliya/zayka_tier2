"use client";

import type React from "react";
import { useMemo, useState } from "react";
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
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const title = useMemo(() => {
    return "Give us your feedback";
  }, [restaurantName]);

  const submit = async () => {
    if (!rating) {
      setError("Please select a rating.");
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
          stars: rating,
          message: message.trim() ? message.trim() : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.msg || "Could not submit feedback.");
      }

      setSuccess("Thanks! Your feedback has been submitted.");
      setRating(0);
      setMessage("");
      setTimeout(() => setOpen(false), 800);
    } catch (e: any) {
      setError(e?.message || "Could not submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { value: 1, emoji: "😭", label: "Dissatisfied" },
    { value: 2, emoji: "😟", label: "" },
    { value: 3, emoji: "😐", label: "" },
    { value: 4, emoji: "😊", label: "" },
    { value: 5, emoji: "🤩", label: "Satisfied" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            What was your experience while using product?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {options.map((o) => {
              const selected = rating === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setRating(o.value)}
                  className={[
                    "h-16 rounded-xl flex items-center justify-center bg-gray-50 border transition",
                    selected ? "border-blue-500 ring-2 ring-blue-200 bg-white" : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                  aria-label={`rating-${o.value}`}
                >
                  <span className="text-3xl">{o.emoji}</span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 px-1">
            <span>Dissatisfied</span>
            <span>Satisfied</span>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-900">
              Write your feedback <span className="text-gray-500 font-normal">(optional)</span>
            </div>
            <Textarea
              placeholder="Please write here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[140px]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
        </div>

        <DialogFooter>
          <Button onClick={submit} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

