import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.query) {
      return NextResponse.json({ error: "Query is missing" }, { status: 400 });
    }

    const response = await fetch("http://127.0.0.1:5000/get_advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: body.query }),
    });

    if (!response.ok) {
      throw new Error(`Flask server error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { response: "AI service is not available. Please try again later." },
      { status: 500 }
    );
  }
}
