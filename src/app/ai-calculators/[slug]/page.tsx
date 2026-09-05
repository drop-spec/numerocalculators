import { notFound } from "next/navigation"; import type { Metadata } from "next"; import { calculators, calculatorBySlug } from "@/lib/calculators"; import { CalculatorArticle } from "@/app/calculators/[slug]/page";
export function generateStaticParams(){return calculators.filter(c=>c.ai).map(c=>({slug:c.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const c=calculatorBySlug((await params).slug);return c?{title:c.title,description:c.description,alternates:{canonical:`/ai-calculators/${c.slug}`}}:{}}
export default async function AICalculatorPage({params}:{params:Promise<{slug:string}>}){const c=calculatorBySlug((await params).slug);if(!c||!c.ai)notFound();return <CalculatorArticle calculator={c}/>}
