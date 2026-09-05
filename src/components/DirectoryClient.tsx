"use client";
import { useState } from "react";
import Link from "next/link";
import type { Calculator } from "@/lib/calculators";
export default function DirectoryClient({ calculators, initialLimit }: { calculators: Calculator[]; initialLimit?: number }) {
  const [query, setQuery] = useState("");
  const matches = calculators.filter((calculator) => [calculator.title, calculator.description, calculator.category, ...calculator.keywords].join(" ").toLowerCase().includes(query.toLowerCase()));
  const visible = query ? matches : initialLimit ? matches.slice(0, initialLimit) : matches;
  const count = query ? `${matches.length} calculator${matches.length === 1 ? "" : "s"} found` : initialLimit ? `Showing ${visible.length} of ${calculators.length} calculators — search to find any tool.` : `${matches.length} calculator${matches.length === 1 ? "" : "s"}`;
  return <><label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all calculators, e.g. salary or percent" aria-label="Search all calculators" /></label><p className="count">{count}</p><div className="card-grid">{visible.map((calculator) => <Link className="tool-card" href={`/${calculator.ai ? "ai-calculators" : "calculators"}/${calculator.slug}`} key={calculator.slug}><span className="eyebrow">{calculator.ai ? "AI tool" : calculator.category.replace("-", " ")}</span><h3>{calculator.title}</h3><p>{calculator.description}</p><span className="card-link">Open calculator →</span></Link>)}</div>{query && visible.length === 0 && <p className="count">No match yet. Try “money”, “AI”, “time”, or “math”.</p>}</>;
}
