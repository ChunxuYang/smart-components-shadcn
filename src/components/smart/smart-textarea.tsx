"use client";
import { useCompletion } from "ai/react";
import * as React from "react";
import {
  useDebounceCallback,
  useEventListener,
  useResizeObserver,
} from "usehooks-ts";

import { cn } from "@/lib/utils";

export interface SmartTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const SmartTextarea = ({ className, ...props }: SmartTextareaProps) => {
  const { completion, input, setInput, handleSubmit, stop } = useCompletion();

  const [suggestion, setSuggestion] = React.useState("");

  const originalTextArea = React.useRef<HTMLTextAreaElement>(null);
  const suggestionTextArea = React.useRef<HTMLTextAreaElement>(null);

  const fetchSuggestion = async (text: string) => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(" is awesome!");
      }, 1000);
    });
  };

  const handleChange = React.useCallback(
    (value: string) => {
      // if the newly inputted text starts with the original input, and the difference is the start of the suggestion
      const isFollowingSuggestion =
        value.startsWith(input) &&
        value !== input &&
        suggestion.startsWith(value.slice(input.length));

      if (isFollowingSuggestion) {
        setInput(value);
        setSuggestion(suggestion.slice(value.length - input.length));
        return;
      }

      setInput(value);
      setSuggestion("");

      if (value.length > 0) {
        // const suggestion = await fetchSuggestion(value);

        setSuggestion("123123");
      }
    },
    [input, setInput, suggestion]
  );

  useEventListener(
    "input",
    (e) => {
      const originalTextArea = e.target as HTMLTextAreaElement;
      const newValue = originalTextArea.value;

      const isFollowingSuggestion =
        newValue.startsWith(input) &&
        newValue !== input &&
        suggestion.startsWith(newValue.slice(input.length));

      if (isFollowingSuggestion) {
        setInput(newValue);
        setSuggestion(suggestion.slice(newValue.length - input.length));
        return;
      }

      setInput(originalTextArea.value);
    },
    originalTextArea
  );

  useEventListener(
    "keydown",
    (e) => {
      if (e.key === "Tab" && suggestion) {
        e.preventDefault();
        if (originalTextArea.current) {
          originalTextArea.current.value = input + suggestion;
        }
        setSuggestion("");
      }
    },
    originalTextArea
  );

  useEventListener(
    "scroll",
    (e) => {
      if (suggestionTextArea.current) {
        suggestionTextArea.current.scrollTo({
          top: originalTextArea.current?.scrollTop || 0,
          left: originalTextArea.current?.scrollLeft || 0,
        });
      }
    },
    originalTextArea
  );

  const { width, height } = useResizeObserver({
    ref: originalTextArea,
    box: "border-box",
  });

  return (
    <div className="relative flex">
      <textarea
        ref={suggestionTextArea}
        className={cn(
          "rounded-md border border-input bg-transparent px-3 py-2 text-sm opacity-50",
          className,
          "absolute inset-0 pointer-events-none"
        )}
        value={`${input}${suggestion}`}
        disabled
        readOnly
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={originalTextArea}
        {...props}
      />
    </div>
  );
};

SmartTextarea.displayName = "Textarea";

export { SmartTextarea };
