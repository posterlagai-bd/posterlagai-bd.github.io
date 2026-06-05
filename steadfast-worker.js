// ============================================================
//  Steadfast Proxy Worker
//  Deploy this on Cloudflare Workers (free tier)
//  It forwards requests from your HTML app to Steadfast API
// ============================================================

const STEADFAST_API_KEY    = "xfumw1yla61ttkhp1qbvh19tcqbha2li";
const STEADFAST_SECRET_KEY = "gohj6h5f01asbvbll9mteudx";
const STEADFAST_API_URL    = "https://portal.steadfast.com.bd/api/v1/create_order";

export default {
  async fetch(request) {

    // ── Allow CORS so your HTML file can call this Worker ──
    const corsHeaders = {
      "Access-Control-Allow-Origin":  "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight (browser sends this before the real request)
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Only POST allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      // Read the order data sent from your HTML app
      const body = await request.json();

      // Forward it to Steadfast with the real API keys
      const sfResponse = await fetch(STEADFAST_API_URL, {
        method: "POST",
        headers: {
          "Api-Key":      STEADFAST_API_KEY,
          "Secret-Key":   STEADFAST_SECRET_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await sfResponse.json();

      return new Response(JSON.stringify(data), {
        status: sfResponse.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};
