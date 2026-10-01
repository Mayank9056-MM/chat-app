"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Cpu, Info, Layers, Search, Sparkles, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { AIModel } from "@/types/ai-model";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  models: AIModel[] | undefined;
  selectedModelId?: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}

export function ModelSelector({
  models,
  selectedModelId,
  onModelSelect,
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState<AIModel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedModel = useMemo(
    () => models?.find((m) => m.id === selectedModelId),
    [models, selectedModelId]
  );

  const formatContextLength = (length: number) => {
    if (!length) return "N/A";
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  const isFreeModel = (model: AIModel) =>
    model?.pricing?.prompt === "0" &&
    model?.pricing?.completion === "0" &&
    model?.pricing?.request === "0";

  const isMultimodal = (model: AIModel) =>
    model?.architecture?.input_modalities?.includes("image") ||
    model?.architecture?.modality?.toLowerCase().includes("image") ||
    model?.architecture?.modality?.toLowerCase().includes("multimodal");

  const openModelDetails = (model: AIModel, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForDetails(model);
    setDetailsOpen(true);
  };

  const filteredModels = useMemo(() => {
    if (!models) return [];
    if (!searchQuery.trim()) return models;

    const query = searchQuery.toLowerCase();
    return models.filter((model) => {
      return (
        model.name.toLowerCase().includes(query) ||
        model.description.toLowerCase().includes(query) ||
        model.id.toLowerCase().includes(query) ||
        model.architecture.modality.toLowerCase().includes(query)
      );
    });
  }, [models, searchQuery]);

  // Group by Context Size & Capabilities (Large Context, Extended, Standard)
  const groupedModels = useMemo(() => {
    const groups: {
      id: string;
      label: string;
      icon: React.ReactNode;
      models: AIModel[];
    }[] = [
      {
        id: "large",
        label: "Large Context (≥ 128K)",
        icon: <Layers className="h-3 w-3 text-cyan-500 dark:text-cyan-400" />,
        models: [],
      },
      {
        id: "extended",
        label: "Extended Context (32K – 128K)",
        icon: <Zap className="h-3 w-3 text-violet-500 dark:text-violet-400" />,
        models: [],
      },
      {
        id: "standard",
        label: "Standard Context (< 32K)",
        icon: <Cpu className="h-3 w-3 text-muted-foreground" />,
        models: [],
      },
    ];

    for (const model of filteredModels) {
      const ctx = model.context_length || 0;
      if (ctx >= 131072) {
        groups[0].models.push(model);
      } else if (ctx >= 32768) {
        groups[1].models.push(model);
      } else {
        groups[2].models.push(model);
      }
    }

    return groups.filter((g) => g.models.length > 0);
  }, [filteredModels]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            className={cn(
              "h-7 gap-1.5 px-2 rounded-md text-xs font-mono font-medium",
              "bg-secondary hover:bg-muted",
              "border border-border hover:border-violet-500/40",
              "text-foreground",
              "transition-all duration-150",
              "max-w-[190px] sm:max-w-none shadow-xs",
              open && "bg-muted border-violet-500/50",
              className,
            )}
          >
            <Sparkles className="h-3 w-3 text-violet-500 dark:text-violet-400 shrink-0" />
            <span className="truncate max-w-[130px] sm:max-w-[170px]">
              {selectedModel?.name || "Select model"}
            </span>
            {selectedModel && (
              <span className="text-[10px] text-muted-foreground hidden sm:inline">
                ({formatContextLength(selectedModel.context_length)})
              </span>
            )}
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className={cn(
            "w-[calc(100vw-2rem)] sm:w-[440px]",
            "p-0 bg-popover border-border text-popover-foreground",
            "shadow-2xl rounded-xl",
          )}
          align="start"
          avoidCollisions
          collisionPadding={16}
        >
          {/* ── Search Bar ── */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Filter by capability, name, or context..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 pl-8 pr-7 text-xs rounded-md bg-secondary border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-violet-500"
                autoFocus
                aria-label="Filter models"
              />
              {searchQuery && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* ── Grouped Model List ── */}
          <ScrollArea className="h-[300px] sm:h-[350px]">
            <div className="p-2 space-y-3" role="listbox" aria-label="Available AI models">
              {filteredModels.length === 0 ? (
                <div className="py-10 text-center text-xs text-muted-foreground font-mono">
                  No models match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                groupedModels.map((group) => (
                  <div key={group.id} className="space-y-1">
                    {/* Category Header */}
                    <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
                      {group.icon}
                      <span>{group.label}</span>
                      <span className="text-muted-foreground/60">({group.models.length})</span>
                    </div>

                    {/* Model Items */}
                    <div className="space-y-0.5">
                      {group.models.map((model) => {
                        const isSelected = selectedModelId === model.id;

                        return (
                          <div
                            key={model.id}
                            role="option"
                            aria-selected={isSelected}
                            className={cn(
                              "group relative flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-100",
                              "hover:bg-muted",
                              isSelected
                                ? "bg-violet-500/10 border border-violet-500/30 text-violet-700 dark:text-violet-300"
                                : "border border-transparent",
                            )}
                            onClick={() => {
                              onModelSelect(model.id);
                              setOpen(false);
                              setSearchQuery("");
                            }}
                          >
                            {/* Check indicator */}
                            <div className="flex h-4 items-center mt-0.5 shrink-0">
                              <Check
                                className={cn(
                                  "h-3.5 w-3.5 text-violet-600 dark:text-violet-400 transition-opacity",
                                  isSelected ? "opacity-100" : "opacity-0",
                                )}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={cn(
                                    "font-mono text-xs font-medium leading-none",
                                    isSelected ? "text-violet-700 dark:text-violet-300" : "text-foreground",
                                  )}
                                >
                                  {model.name}
                                </span>

                                {isFreeModel(model) && (
                                  <Badge className="h-3.5 px-1 text-[9px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 border rounded font-mono">
                                    FREE
                                  </Badge>
                                )}

                                {isMultimodal(model) && (
                                  <Badge className="h-3.5 px-1 text-[9px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 border rounded font-mono">
                                    VISION
                                  </Badge>
                                )}
                              </div>

                              <p className="text-[11px] text-muted-foreground line-clamp-1 leading-relaxed">
                                {model.description}
                              </p>

                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                <span>{formatContextLength(model.context_length)} tokens</span>
                                <span>·</span>
                                <span>{model.architecture?.modality || "text"}</span>
                              </div>
                            </div>

                            {/* Info Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 shrink-0 rounded text-muted-foreground hover:text-foreground hover:bg-secondary opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                              onClick={(e) => openModelDetails(model, e)}
                              aria-label={`View specs for ${model.name}`}
                            >
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* ── Model Specs Dialog ── */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent
          className={cn(
            "w-[calc(100vw-2rem)] max-w-lg",
            "bg-popover border-border text-popover-foreground",
            "shadow-2xl",
          )}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground font-mono text-sm">
              <Sparkles className="h-4 w-4 text-violet-500 dark:text-violet-400 shrink-0" />
              <span className="truncate">{selectedForDetails?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Technical specifications and capability parameters
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[340px] pr-3">
            {selectedForDetails && (
              <div className="space-y-4 pt-1">
                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedForDetails.description}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Context Window", value: `${formatContextLength(selectedForDetails.context_length)} tokens` },
                    { label: "Max Completion", value: `${formatContextLength(selectedForDetails.top_provider?.max_completion_tokens || 0)} tokens` },
                    { label: "Modality", value: selectedForDetails.architecture?.modality?.replace("->", " → ") || "text" },
                    { label: "Tokenizer", value: selectedForDetails.architecture?.tokenizer || "standard" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-md bg-secondary border border-border p-2.5 space-y-0.5">
                      <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">{item.label}</p>
                      <p className="text-xs font-mono font-medium text-foreground break-words">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing / Free Indicator */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Pricing Tier</p>
                  {isFreeModel(selectedForDetails) ? (
                    <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                      <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-xs font-mono">FREE</Badge>
                      <p className="text-xs text-muted-foreground">Zero token charge on OpenRouter</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-secondary border border-border p-2">
                        <p className="text-[10px] text-muted-foreground font-mono">Prompt</p>
                        <p className="text-xs font-mono text-foreground">${selectedForDetails.pricing?.prompt}/M</p>
                      </div>
                      <div className="rounded-md bg-secondary border border-border p-2">
                        <p className="text-[10px] text-muted-foreground font-mono">Completion</p>
                        <p className="text-xs font-mono text-foreground">${selectedForDetails.pricing?.completion}/M</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Technical Model Identifier */}
                <div className="space-y-1">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Model ID</p>
                  <code className="block text-[11px] font-mono bg-secondary border border-border text-violet-600 dark:text-violet-300 px-2.5 py-1.5 rounded-md break-all select-all">
                    {selectedForDetails.id}
                  </code>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ModelSelector;