import MaterialCalculator from "@/components/MaterialCalculator";
import { Breadcrumbs, Related } from "@/components/Content";
import { calculatorCopy, type Calculator } from "@/lib/calculators";

export default function MaterialCalculatorPage({ calculator, kind }: { calculator: Calculator; kind: "mulch" | "concrete" }) {
  const mulch = kind === "mulch";
  const planningTip = calculatorCopy[calculator.slug]?.planningTip ?? (mulch ? "A 2 to 4 inch layer is common for many garden beds. Check the product label for bag coverage, and account for slopes, curves, and settling when ordering." : "For a slab, include a modest allowance for uneven ground and spillage. Suppliers commonly sell ready-mix by cubic yard; bags are useful for smaller jobs.");
  return <article className="shell page calculator-page"><Breadcrumbs calculator={calculator}/><p className="kicker">OUTDOOR PROJECTS</p><h1>{calculator.title}</h1><p className="lede">{calculator.description}</p><MaterialCalculator kind={kind}/><section className="article-content"><h2>How to estimate {mulch ? "mulch" : "concrete"}</h2><p>{calculator.explanation}</p><h2>Example</h2><p>{calculator.example}</p><h2>Planning tip</h2><p>{planningTip}</p></section><Related calculator={calculator}/></article>;
}
