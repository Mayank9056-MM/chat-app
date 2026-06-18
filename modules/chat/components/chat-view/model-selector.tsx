"use client";
import { useState } from "react";
import { Check, ChevronDown, Info, Search, Sparkles, X } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { AIModel } from "@/types/ai-model";

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

  const selectedModel = models?.find((m) => m.id === selectedModelId);

  const formatContextLength = (length: number) => {
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length?.toString();
  };

  const isFreeModel = (model: AIModel) =>
    model?.pricing?.prompt === "0" &&
    model?.pricing?.completion === "0" &&
    model?.pricing?.request === "0";

  const openModelDetails = (model: AIModel, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForDetails(model);
    setDetailsOpen(true);
  };

  const filteredModels = models?.filter((model) => {
    const query = searchQuery.toLowerCase();
    return (
      model.name.toLowerCase().includes(query) ||
      model.description.toLowerCase().includes(query) ||
      model.id.toLowerCase().includes(query) ||
      model.architecture.modality.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "h-7 gap-1.5 px-2 rounded-lg text-xs font-medium",
              "bg-white/[0.04] hover:bg-white/[0.08]",
              "border border-white/[0.07] hover:border-white/[0.12]",
              "text-zinc-400 hover:text-zinc-200",
              "transition-all duration-150",
              open && "bg-white/[0.08] border-white/[0.12] text-zinc-200",
              className,
            )}
          >
            <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
            <span className="truncate max-w-[160px]">
              {selectedModel?.name ?? "Select model"}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 shrink-0 text-zinc-600 transition-transform duration-150",
                open && "rotate-180",
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[420px] p-0 bg-zinc-900 border-white/[0.08] shadow-2xl shadow-black/60 rounded-xl"
          align="start"
        >
          {/* Search */}
          <div className="p-2.5 border-b border-white/[0.06]">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600" />
              <Input
                placeholder="Search models…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  h-8 pl-8 pr-7 text-xs rounded-lg
                  bg-white/[0.04] border-white/[0.07]
                  text-zinc-300 placeholder:text-zinc-600
                  focus-visible:ring-1 focus-visible:ring-indigo-500/50 focus-visible:border-indigo-500/30
                "
                autoFocus
              />
              {searchQuery && (
                <button
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <ScrollArea className="h-[360px]">
            <div className="p-2">
              {/* Section header */}
              <div className="px-2 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Available · {filteredModels?.length ?? 0}
              </div>

              {filteredModels?.length === 0 ? (
                <div className="py-10 text-center text-xs text-zinc-600">
                  No models match &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                <div className="space-y-0.5">
                  {filteredModels?.map((model) => (
                    <div
                      key={model.id}
                      className={cn(
                        "relative flex cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2.5 text-sm transition-colors duration-100",
                        "hover:bg-white/[0.06]",
                        selectedModelId === model.id
                          ? "bg-indigo-500/10 hover:bg-indigo-500/15"
                          : "",
                      )}
                      onClick={() => {
                        onModelSelect(model.id);
                        setOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      {/* Check */}
                      <div className="flex h-5 items-center mt-0.5 flex-shrink-0">
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 text-indigo-400 transition-opacity",
                            selectedModelId === model.id ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={cn(
                              "font-medium text-xs leading-none",
                              selectedModelId === model.id
                                ? "text-indigo-300"
                                : "text-zinc-200",
                            )}
                          >
                            {model.name}
                          </span>
                          {isFreeModel(model) && (
                            <Badge className="h-3.5 px-1 text-[9px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20 border rounded-sm font-semibold">
                              FREE
                            </Badge>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-500 line-clamp-1 leading-relaxed">
                          {model.description}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-700">
                          <span>{formatContextLength(model.context_length)} ctx</span>
                          <span className="text-zinc-800">·</span>
                          <span className="capitalize">
                            {model?.architecture?.modality?.replace("->", "→") ?? "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Info button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 shrink-0 rounded-md text-zinc-700 hover:text-zinc-300 hover:bg-white/[0.08] opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => openModelDetails(model, e)}
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Model details dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg bg-zinc-900 border-white/[0.08] text-zinc-200 shadow-2xl shadow-black/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              {selectedForDetails?.name}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              Model capabilities and pricing
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[420px] pr-4">
            {selectedForDetails && (
              <div className="space-y-5">

                {/* Description */}
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {selectedForDetails.description}
                </p>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Context length", value: `${formatContextLength(selectedForDetails.context_length)} tokens` },
                    { label: "Max completion", value: `${formatContextLength(selectedForDetails.top_provider.max_completion_tokens)} tokens` },
                    { label: "Modality", value: selectedForDetails.architecture.modality.replace("->", " → ") },
                    { label: "Tokenizer", value: selectedForDetails.architecture.tokenizer },
                  ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-1">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs font-medium text-zinc-200 capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Modalities */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Modalities</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-zinc-600">Input</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedForDetails.architecture.input_modalities.map((m) => (
                          <Badge key={m} className="text-[10px] bg-white/[0.05] text-zinc-400 border-white/[0.08] border rounded-md px-1.5">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-zinc-600">Output</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedForDetails.architecture.output_modalities.map((m) => (
                          <Badge key={m} className="text-[10px] bg-white/[0.05] text-zinc-400 border-white/[0.08] border rounded-md px-1.5">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Pricing</p>
                  {isFreeModel(selectedForDetails) ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">FREE</Badge>
                      <p className="text-xs text-zinc-500">This model is completely free to use</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedForDetails.pricing).map(([key, value]) => {
                        if (value === "0") return null;
                        return (
                          <div key={key} className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 space-y-1">
                            <p className="text-[10px] text-zinc-600 uppercase tracking-wide capitalize">{key.replace("_", " ")}</p>
                            <p className="text-xs font-medium text-zinc-200">${value}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Provider */}
                <div className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                  <span className="text-xs text-zinc-500">Content moderation</span>
                  <Badge
                    className={cn(
                      "text-[10px] border rounded-md px-1.5",
                      selectedForDetails.top_provider.is_moderated
                        ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/20"
                        : "bg-white/[0.05] text-zinc-500 border-white/[0.08]",
                    )}
                  >
                    {selectedForDetails.top_provider.is_moderated ? "Enabled" : "Disabled"}
                  </Badge>
                </div>

                {/* Model ID */}
                <div className="space-y-1.5">
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wide">Model ID</p>
                  <code className="block text-[11px] bg-black/30 border border-white/[0.06] text-zinc-400 px-3 py-2 rounded-lg break-all">
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