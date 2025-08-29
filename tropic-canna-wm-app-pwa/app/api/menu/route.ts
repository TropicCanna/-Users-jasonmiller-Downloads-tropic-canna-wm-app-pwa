
import { NextResponse } from "next/server";

const REQUIRED_ENV = ["WEEDMAPS_API_BASE", "WEEDMAPS_API_VERSION", "WEEDMAPS_BEARER", "WEEDMAPS_MENU_ID"];
REQUIRED_ENV.forEach(k => {
  if (!process.env[k]) console.warn(`[wm] Missing env var: ${k}`);
});

const base = process.env.WEEDMAPS_API_BASE || "https://api-g.weedmaps.com";
const ver  = process.env.WEEDMAPS_API_VERSION || "2025-07";
const tok  = process.env.WEEDMAPS_BEARER || "";
const menu = process.env.WEEDMAPS_MENU_ID || "";

// Build a helper to call WM API
async function wm(path: string, init?: RequestInit) {
  const url = `${base}/wm/${ver}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "Authorization": `Bearer ${tok}`,
      "Accept": "application/json"
    },
    cache: "no-store"
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> "");
    throw new Error(`WM ${res.status} ${res.statusText}: ${text}`);
  }
  return res.json();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q   = url.searchParams.get("q") ?? "";
    const cat = url.searchParams.get("category") ?? "";

    if (!tok || !menu) {
      return NextResponse.json({ error: "Weedmaps API not configured. Set env vars." }, { status: 400 });
    }

    // Fetch menu meta (optional but useful)
    const menuMeta = await wm(`/partners/menus/${encodeURIComponent(menu)}`);

    // Fetch items
    // NOTE: Weedmaps supports filtering & sorting params; you can add them here as needed.
    const itemsRes = await wm(`/partners/menus/${encodeURIComponent(menu)}/items`);

    const rawItems = Array.isArray(itemsRes?.data) ? itemsRes.data : (itemsRes?.items ?? []);

    // Normalize and apply basic filters client-side (name + category slug)
    const items = rawItems.filter((it: any) => {
      const name = (it.name || it.product_name || "").toString();
      const categorySlug = it.category?.slug || it.category_slug || it.category;
      const available = (it.is_available !== false);
      const matchesQ = q ? name.toLowerCase().includes(q.toLowerCase()) : true;
      const matchesC = cat ? (categorySlug === cat) : true;
      return available && matchesQ && matchesC;
    }).map((it: any) => ({
      id: it.id || it.uuid || it.item_id,
      name: it.name || it.product_name || "Unnamed product",
      price: typeof it.price === "number" ? it.price : (it?.prices?.price ?? 0),
      image_url: it.image_url || it.image || it.images?.[0]?.url || "",
      brand: it.brand || { name: it.brand_name },
      thc_percent: it.thc_percent || it.thc || undefined,
      cbd_percent: it.cbd_percent || it.cbd || undefined,
      category: it.category || { slug: it.category_slug },
    }));

    const categories = Array.from(new Set(items.map((i: any) => i.category?.slug).filter(Boolean)));

    return NextResponse.json({
      menu: {
        id: menu,
        name: menuMeta?.data?.name || menuMeta?.name || process.env.BRAND_NAME || "Menu"
      },
      categories,
      items
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
