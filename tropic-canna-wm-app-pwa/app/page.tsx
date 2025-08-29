
"use client";
import { useEffect, useState } from "react";

type Item = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category?: { slug?: string; name?: string };
  brand?: { name?: string };
  thc_percent?: number;
  cbd_percent?: number;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [menuName, setMenuName] = useState<string>("Menu");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch(`/api/menu?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`);
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Failed to load menu");
      setMenuName(j.menu?.name || "Menu");
      setCats(j.categories || []);
      setItems(j.items || []);
    } catch (e: any) {
      setError(e.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);
  useEffect(() => { const id = setTimeout(load, 250); return () => clearTimeout(id); }, [q, cat]);

  const listingUrl = process.env.NEXT_PUBLIC_LISTING_URL || process.env.LISTING_URL || "https://weedmaps.com/dispensaries/big-chief-collective-2-1";
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || process.env.BRAND_NAME || "Tropic Canna - Lawton";
  

  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: 24 }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <h1 style={{ marginRight: "auto" }}>{brandName}</h1>
        <input
          placeholder="Search products…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd", minWidth: 280 }}
        />
        <select value={cat} onChange={(e)=>setCat(e.target.value)} style={{ padding: 10, borderRadius: 8, border: "1px solid #ddd" }}>
          <option value="">All categories</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <a href={listingUrl} target="_blank" rel="noreferrer"
           style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid #ddd", textDecoration: "none" }}>
          Open on Weedmaps
        </a>
      </header>

      {error && (
        <div style={{ border: "1px solid #f0c", padding: 12, borderRadius: 8, marginBottom: 16 }}>
          <b>Heads up:</b> {error}. Check your <code>.env.local</code> values.<br/>
          You can still browse on Weedmaps:{" "}
          <a href={listingUrl} target="_blank" rel="noreferrer">Open listing</a>.
        </div>
      )}

      {loading ? <p>Loading…</p> : (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {items.map(p => (
            <article key={p.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <div style={{ height: 160, background: "#fafafa", borderRadius: 8 }} />
              )}
              <h3 style={{ fontSize: 16, margin: "8px 0 4px" }}>{p.name}</h3>
              <div style={{ fontSize: 12, opacity: 0.8 }}>{p.brand?.name || p.category?.slug}</div>
              <div style={{ marginTop: 8, fontWeight: 600 }}>${Number(p.price || 0).toFixed(2)}</div>
              <a href={listingUrl} target="_blank" rel="noreferrer"
                style={{ display:"inline-block", marginTop:10, padding:"10px 12px", borderRadius:8, border:"1px solid #ddd", textDecoration:"none" }}>
                View on Weedmaps
              </a>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
