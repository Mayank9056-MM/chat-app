import { config } from "@/config/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${config.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { messsage: "Failed to fetch models" },
        { status: 500 },
      );
    }

    const data = await response.json();

    type Model = (typeof data.data)[number];

    const freeModels = data.data.filter((model: Model) => {
      const promptPrice = parseFloat(model.pricing?.prompt || "0");
      const completionPrice = parseFloat(model.pricing?.completion || "0");

      return promptPrice === 0 && completionPrice === 0;
    });

    const formattedModels = freeModels.map((model: Model) => ({
      id: model.id,
      name: model.id,
      description: model.description,
      context_length: model.context_length,
      architecture: model.architecture,
      pricing: model.pricing,
      top_provider: model.top_provider,
    }));

    return NextResponse.json({
      models: formattedModels,
    });
  } catch (error) {
    console.error("Error fetching models:", error);

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || "Failed to fetch models",
      },
      {
        status: 500,
      },
    );
  }
}
