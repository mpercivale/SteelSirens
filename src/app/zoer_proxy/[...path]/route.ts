import { NextRequest, NextResponse } from "next/server";

const POSTGREST_API_KEY = process.env.POSTGREST_API_KEY || "";
const NEXT_PUBLIC_ZOER_API = "https://api.zoer.ai";
const proxy_path = "zoer_proxy";
const REQUEST_TIMEOUT_MS = 15000;

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  const url = request.nextUrl;
  const pathSegments = url.pathname
    .replace(`/${proxy_path}`, "")
    .split("/")
    .filter(Boolean);

  if (!POSTGREST_API_KEY) {
    return NextResponse.json(
      { error: "Proxy misconfigured: POSTGREST_API_KEY is missing" },
      { status: 503 }
    );
  }

  try {
    const targetPath = "/" + pathSegments.join("/");

    const targetUrl = `${NEXT_PUBLIC_ZOER_API}${targetPath}${url.search}`;

    const headers = new Headers();

    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers.set("content-type", contentType);
    }

    const accept = request.headers.get("accept");
    if (accept) {
      headers.set("accept", accept);
    }

    headers.set("x-zoer-auth", `${POSTGREST_API_KEY}`);
    headers.set("Postgrest-API-Key", `${POSTGREST_API_KEY}`);
    headers.delete("Authorization");

    let body: BodyInit | undefined;
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      body = await request.arrayBuffer();
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      responseHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Proxy request failed", details: message },
      { status: 500 }
    );
  }
}
