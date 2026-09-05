import type { MetadataRoute } from "next";
import { calculators, categories } from "@/lib/calculators";
export default function sitemap(): MetadataRoute.Sitemap { const base="https://numerocalculators.com"; return ["","/calculators","/about","/privacy","/terms","/disclaimer","/contact",...Object.keys(categories).map((category)=>`/${category}`),...calculators.map((calculator)=>`/${calculator.ai?"ai-calculators":"calculators"}/${calculator.slug}`)].map((url)=>({url:`${base}${url}`,lastModified:new Date("2026-09-05")})); }
