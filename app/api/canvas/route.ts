import { NextResponse } from "next/server";

const CANVAS_BASE = process.env.CANVAS_BASE_URL ?? "https://canvas.instructure.com";
const CANVAS_TOKEN = process.env.CANVAS_API_TOKEN;
const CANVAS_COURSE = process.env.CANVAS_COURSE_ID;

// Server-side Canvas proxy — API token NEVER exposed to client
export async function GET(req: Request) {
  if (!CANVAS_TOKEN || !CANVAS_COURSE) {
    // Return empty gracefully if Canvas not configured
    return NextResponse.json({ assignments: [], configured: false });
  }

  try {
    const url = new URL(req.url);
    const endpoint = url.searchParams.get("endpoint") ?? "assignments";

    let canvasUrl = "";
    if (endpoint === "assignments") {
      canvasUrl = `${CANVAS_BASE}/api/v1/courses/${CANVAS_COURSE}/assignments?per_page=20&order_by=due_at&bucket=upcoming`;
    } else if (endpoint === "announcements") {
      canvasUrl = `${CANVAS_BASE}/api/v1/courses/${CANVAS_COURSE}/discussion_topics?only_announcements=true&per_page=5`;
    } else {
      return NextResponse.json({ error: "Unknown endpoint" }, { status: 400 });
    }

    const res = await fetch(canvasUrl, {
      headers: {
        Authorization: `Bearer ${CANVAS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Canvas API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ data, configured: true });
  } catch (e) {
    console.error("Canvas proxy error:", e);
    return NextResponse.json({ error: "Canvas API unavailable", configured: false });
  }
}
