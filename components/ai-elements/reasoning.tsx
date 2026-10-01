"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Streamdown } from "streamdown";

import { Shimmer } from "./shimmer";

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const resolvedDefaultOpen = defaultOpen ?? isStreaming;
    // Track if defaultOpen was explicitly set to false (to prevent auto-open)
    const isExplicitlyClosed = defaultOpen === false;

    const [isOpen, setIsOpen] = useControllableState<boolean>({
      defaultProp: resolvedDefaultOpen,
      onChange: onOpenChange,
      prop: open,
    });
    const [duration, setDuration] = useControllableState<number | undefined>({
      defaultProp: undefined,
      prop: durationProp,
    });

    const hasEverStreamedRef = useRef(isStreaming);
    const [hasAutoClosed, setHasAutoClosed] = useState(false);
    const startTimeRef = useRef<number | null>(null);

    // Track when streaming starts and compute duration
    useEffect(() => {
      if (isStreaming) {
        hasEverStreamedRef.current = true;
        if (startTimeRef.current === null) {
          startTimeRef.current = Date.now();
        }
      } else if (startTimeRef.current !== null) {
        setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
        startTimeRef.current = null;
      }
    }, [isStreaming, setDuration]);

    // Auto-open when streaming starts (unless explicitly closed)
    useEffect(() => {
      if (isStreaming && !isOpen && !isExplicitlyClosed) {
        setIsOpen(true);
      }
    }, [isStreaming, isOpen, setIsOpen, isExplicitlyClosed]);

    // Auto-close when streaming ends (once only, and only if it ever streamed)
    useEffect(() => {
      if (
        hasEverStreamedRef.current &&
        !isStreaming &&
        isOpen &&
        !hasAutoClosed
      ) {
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);

        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = useCallback(
      (newOpen: boolean) => {
        setIsOpen(newOpen);
      },
      [setIsOpen]
    );

    const contextValue = useMemo(
      () => ({ duration, isOpen, isStreaming, setIsOpen }),
      [duration, isOpen, isStreaming, setIsOpen]
    );

    return (
      <ReasoningContext.Provider value={contextValue}>
        <Collapsible
          className={cn("not-prose mb-4", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
> & {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
};

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) {
    return <Shimmer duration={1}>Thinking...</Shimmer>;
  }
  if (duration === undefined) {
    return <span>Thought for a few seconds</span>;
  }
  return <span>Thought for {duration} seconds</span>;
};

export const ReasoningTrigger = memo(
  ({
    className,
    children,
    getThinkingMessage = defaultGetThinkingMessage,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, isOpen, duration } = useReasoning();

    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2.5 text-muted-foreground text-xs font-mono transition-colors hover:text-foreground select-none cursor-pointer py-1 px-1",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <BrainIcon className={cn("size-3.5 shrink-0", isStreaming && "text-primary animate-pulse")} />
            <span className="flex-1 text-left truncate">
              {getThinkingMessage(isStreaming, duration)}
            </span>
            <ChevronDownIcon
              className={cn(
                "size-3.5 shrink-0 text-muted-foreground/70 transition-transform duration-200",
                isOpen ? "rotate-180" : "rotate-0"
              )}
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

const streamdownPlugins = { cjk, code, math, mermaid };

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => (
    <CollapsibleContent
      className={cn(
        "mt-2.5 pt-3 border-t border-border/50 text-xs font-mono leading-relaxed text-muted-foreground/90 outline-none overflow-hidden",
        "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=closed]:animate-out data-[state=open]:animate-in",
        // Explicit list styles with generous indent & marker placement
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ul]:space-y-1.5 [&_ul_ul]:pl-5 [&_ul_ul]:my-1",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_ol]:space-y-1.5 [&_ol_ol]:pl-5 [&_ol_ol]:my-1",
        "[&_li]:pl-1.5 [&_li]:leading-relaxed [&_li::marker]:text-muted-foreground/70",
        // Paragraphs & headings
        "[&_p]:my-2 [&_p]:leading-relaxed [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
        "[&_h1]:text-sm [&_h1]:font-semibold [&_h1]:my-2 [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:my-1.5",
        // Preformatted code & inline code inside reasoning
        "[&_pre]:my-2 [&_pre]:p-2.5 [&_pre]:rounded-md [&_pre]:bg-secondary/60 [&_pre]:overflow-x-auto",
        "[&_code]:text-[11px] [&_code]:font-mono [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted/70",
        "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:my-2",
        className
      )}
      {...props}
    >
      <div className="pl-1.5 sm:pl-2 pr-1">
        <Streamdown plugins={streamdownPlugins}>{children}</Streamdown>
      </div>
    </CollapsibleContent>
  )
);

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
