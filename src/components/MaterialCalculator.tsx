"use client";

import { useMemo, useState } from "react";
import styles from "./MaterialCalculator.module.css";

type Kind = "mulch" | "concrete";
type Values = { length: number; width: number; depth: number; bagSize: number; price: number; waste: number };

const defaults: Record<Kind, Values> = {
  mulch: { length: 20, width: 12, depth: 3, bagSize: 2, price: 0, waste: 0 },
  concrete: { length: 20, width: 10, depth: 4, bagSize: 0.45, price: 0, waste: 10 },
};

const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export default function MaterialCalculator({ kind }: { kind: Kind }) {
  const [values, setValues] = useState<Values>(defaults[kind]);
  const isMulch = kind === "mulch";
  const result = useMemo(() => {
    const volume = Math.max(0, values.length) * Math.max(0, values.width) * Math.max(0, values.depth) / 12;
    const withWaste = volume * (1 + Math.max(0, values.waste) / 100);
    const bags = values.bagSize > 0 ? Math.ceil(withWaste / values.bagSize) : 0;
    return { volume, withWaste, bags, yards: withWaste / 27 };
  }, [values]);

  const update = (field: keyof Values, value: string) => setValues((current) => ({ ...current, [field]: Number(value) || 0 }));
  const reset = () => setValues(defaults[kind]);
  const field = (id: keyof Values, label: string, unit: string, step = "1") => <label key={id}>{label}<div className="input-wrap"><input type="number" min="0" step={step} value={values[id]} onChange={(event) => update(id, event.target.value)} /><span>{unit}</span></div></label>;

  return <section className={`calculator ${styles.calculator}`} aria-label={`${isMulch ? "Mulch" : "Concrete"} calculator`}><div className="fields"><p className={styles.help}>Enter the inside dimensions of your {isMulch ? "garden bed" : "slab"}. Measurements are in feet and inches.</p>{field("length", "Length", "ft")}{field("width", "Width", "ft")}{field("depth", isMulch ? "Mulch depth" : "Slab depth", "in", "0.25")}{!isMulch && field("waste", "Extra material", "%")}{field("bagSize", isMulch ? "Bag coverage" : "Bag yield", isMulch ? "cu ft" : "cu ft / 60 lb bag", "0.01")}{field("price", "Price per bag (optional)", "$")}</div><div className="result" aria-live="polite"><p>{isMulch ? "Material to order" : "Concrete to order"}</p><strong>{number.format(result.yards)} yd³</strong><dl><div><dt>Volume {isMulch ? "needed" : "before extra"}</dt><dd>{number.format(result.volume)} cu ft</dd></div>{!isMulch && <div><dt>Volume with extra</dt><dd>{number.format(result.withWaste)} cu ft</dd></div>}<div><dt>{isMulch ? "2 cu ft bags" : "60 lb bags"}</dt><dd>{number.format(result.bags)} bags</dd></div><div><dt>Estimated bag cost</dt><dd>{values.price > 0 ? money.format(result.bags * values.price) : "Add a price"}</dd></div></dl><button type="button" onClick={reset}>Reset values</button></div><p className="pricing-note">{isMulch ? "Order a little extra for uneven beds and settling. Bag coverage can vary by product." : "The extra-material allowance helps account for spillage and uneven ground. Confirm ready-mix ordering minimums and bag yield with your supplier."}</p></section>;
}
