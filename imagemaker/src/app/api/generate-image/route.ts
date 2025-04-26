import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.REPLICATE_API_TOKEN;
    if (!apiKey) {
      return NextResponse.json(
        { error: "REPLICATE_API_TOKEN is not set" },
        { status: 500 }
      );
    }

    // NVIDIA SANA-Sprint model
    const modelVersion = "6ed1ce77cdc8db65550e76d5ab82556d0cb31ac8ab3c4947b168a0bda7b962e4";
    const modelInputs = {
      prompt,
      negative_prompt: "low quality, blurry, distorted",
      num_outputs: 1,
      num_inference_steps: 25,
      guidance_scale: 7.5,
      width: 1024,
      height: 1024,
    };

    console.log(`Generating image with prompt: "${prompt}" using SANA-Sprint model`);

    // Call Replicate API
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        version: modelVersion,
        input: modelInputs,
      }),
    });

    const responseBody = await response.text();
    console.log("Replicate API response:", responseBody);

    if (!response.ok) {
      // Try to parse error details, fall back to text if not JSON
      const errorDetails = safeParseJSON(responseBody) || { message: responseBody };
      
      return NextResponse.json(
        { error: "Error from Replicate API", details: errorDetails },
        { status: response.status }
      );
    }

    // Parse the successful response
    const prediction = safeParseJSON(responseBody);
    if (!prediction) {
      return NextResponse.json(
        { error: "Failed to parse Replicate API response" },
        { status: 500 }
      );
    }

    console.log("Prediction created:", prediction.id);
    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Prediction ID is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.REPLICATE_API_TOKEN;
  if (!apiKey) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not set" },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching prediction status for ID: ${id}`);
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const responseBody = await response.text();
    console.log(`Prediction status response for ID ${id}:`, responseBody);

    if (!response.ok) {
      // Try to parse error details, fall back to text if not JSON
      const errorDetails = safeParseJSON(responseBody) || { message: responseBody };
      
      return NextResponse.json(
        { error: "Error fetching prediction", details: errorDetails },
        { status: response.status }
      );
    }

    // Parse the successful response
    const prediction = safeParseJSON(responseBody);
    if (!prediction) {
      return NextResponse.json(
        { error: "Failed to parse Replicate API response" },
        { status: 500 }
      );
    }

    // Log the output if it exists to help with debugging
    if (prediction.output && Array.isArray(prediction.output) && prediction.output.length > 0) {
      console.log(`Image URL for prediction ${id}:`, prediction.output[0]);
    }

    return NextResponse.json(prediction);
  } catch (error) {
    console.error("Error fetching prediction:", error);
    return NextResponse.json(
      { error: "Failed to fetch prediction", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Helper function to safely parse JSON without throwing
function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
} 