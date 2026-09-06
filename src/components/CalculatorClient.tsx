"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import posthog from "posthog-js";
import type { Calculator } from "@/lib/calculators";
import type { DynamicRow } from "@/lib/calculators";
import { defaultAIModel } from "@/lib/ai-pricing";
import DynamicRows from "@/components/DynamicRows";
const currency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value);
const decimal = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
type Result = { primary: string; label: string; rows: [string, string][] };
function calculate(c: Calculator, v: Record<string, number>, dynamicRows: DynamicRow[] = []): Result {
  const f = (x: number) => Number.isFinite(x) ? decimal(x) : "â€”"; const usd = (x: number) => Number.isFinite(x) ? currency(x) : "â€”";
  switch(c.formula) {
    case "salaryHourly": return {primary: usd(v.salary/(v.hours*v.weeks)),label:"Estimated hourly rate",rows:[["Weekly",usd(v.salary/v.weeks)],["Monthly",usd(v.salary/12)],["Annual",usd(v.salary)]]};
    case "hourlySalary": { const annual=v.rate*v.hours*v.weeks; return {primary:usd(annual),label:"Estimated annual pay",rows:[["Weekly",usd(v.rate*v.hours)],["Monthly",usd(annual/12)],["Hourly",usd(v.rate)]]}; }
    case "overtime": return {primary:usd(v.rate*v.hours*v.multiplier),label:"Overtime pay",rows:[["Base rate",usd(v.rate)],["Overtime rate",usd(v.rate*v.multiplier)]]};
    case "tip": {const tip=v.bill*v.tip/100,total=v.bill+tip;return {primary:usd(total/v.people),label:"Total per person",rows:[["Tip",usd(tip)],["Bill total",usd(total)]]};}
    case "discount": {const saved=v.price*v.discount/100;return {primary:usd(v.price-saved),label:"Sale price",rows:[["You save",usd(saved)],["Original price",usd(v.price)]]};}
    case "margin": {const p=v.revenue-v.cost;return {primary:f(p/v.revenue*100)+"%",label:"Profit margin",rows:[["Profit",usd(p)],["Revenue",usd(v.revenue)]]};}
    case "markup": {const sale=v.cost*(1+v.markup/100);return {primary:usd(sale),label:"Selling price",rows:[["Markup amount",usd(sale-v.cost)],["Cost",usd(v.cost)]]};}
    case "commission": return {primary:usd(v.sales*v.rate/100),label:"Estimated commission",rows:[["Sales",usd(v.sales)],["Rate",f(v.rate)+"%"]]};
    case "loan": {const r=v.rate/100/12, months=v.years*12, payment=v.principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);return {primary:usd(payment),label:"Estimated monthly payment",rows:[["Total paid",usd(payment*months)],["Interest",usd(payment*months-v.principal)]]};}
    case "simpleInterest": {const i=v.principal*v.rate/100*v.years;return {primary:usd(v.principal+i),label:"Total value",rows:[["Interest earned",usd(i)],["Starting amount",usd(v.principal)]]};}
    case "compoundInterest": {const total=v.principal*Math.pow(1+v.rate/100,v.years);return {primary:usd(total),label:"Estimated total value",rows:[["Interest earned",usd(total-v.principal)],["Years",f(v.years)]]};}
    case "annualIncome": {const annual=v.hourlyRate*v.hoursPerWeek*v.weeksPerYear;return {primary:usd(annual),label:"Estimated annual income",rows:[["Monthly",usd(annual/12)],["Weekly",usd(v.hourlyRate*v.hoursPerWeek)],["Hourly",usd(v.hourlyRate)]]};}
    case "mortgage": {const principal=v.principal-v.downPayment,r=v.rate/1200,n=v.years*12,payment=principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);return {primary:usd(payment),label:"Estimated monthly payment",rows:[["Loan amount",usd(principal)],["Total interest",usd(payment*n-principal)]]};}
    case "autoLoan": {const principal=v.price-v.downPayment,r=v.rate/1200,n=v.years*12,payment=principal*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);return {primary:usd(payment),label:"Estimated monthly payment",rows:[["Loan amount",usd(principal)],["Total interest",usd(payment*n-principal)]]};}
    case "futureValue": {const total=v.principal*Math.pow(1+v.rate/100,v.years);return {primary:usd(total),label:"Estimated future value",rows:[["Growth",usd(total-v.principal)],["Starting amount",usd(v.principal)]]};}
    case "presentValue": {const total=v.futureValue/Math.pow(1+v.rate/100,v.years);return {primary:usd(total),label:"Present value",rows:[["Future amount",usd(v.futureValue)],["Discounted amount",usd(v.futureValue-total)]]};}
    case "retirement": {const months=v.years*12,r=v.rate/1200,total=v.current*Math.pow(1+r,months)+v.monthly*((Math.pow(1+r,months)-1)/r);return {primary:usd(total),label:"Estimated retirement savings",rows:[["Contributions",usd(v.current+v.monthly*months)],["Investment growth",usd(total-v.current-v.monthly*months)]]};}
    case "inflation": {const total=v.amount*Math.pow(1+v.rate/100,v.years);return {primary:usd(total),label:"Future cost",rows:[["Increase",usd(total-v.amount)],["Todayâ€™s amount",usd(v.amount)]]};}
    case "cardPayoff": {const r=v.rate/1200,months=Math.log(v.payment/(v.payment-r*v.balance))/Math.log(1+r),interest=v.payment*Math.ceil(months)-v.balance;return {primary:f(Math.ceil(months))+" months",label:"Estimated payoff time",rows:[["Total interest",usd(interest)],["Monthly payment",usd(v.payment)]]};}
    case "budget": {const spending=v.needs+v.wants+v.savings,remaining=v.income-spending;return {primary:usd(remaining),label:"Monthly amount remaining",rows:[["Total planned",usd(spending)],["Savings rate",f(v.savings/v.income*100)+"%"]]};}
    case "vat": {const vat=v.price*v.rate/100;return {primary:usd(v.price+vat),label:"Price including VAT",rows:[["VAT",usd(vat)],["Before VAT",usd(v.price)]]};}
    case "salesTax": {const tax=v.price*v.taxRate/100;return {primary:usd(v.price+tax),label:"Price including tax",rows:[["Sales tax",usd(tax)],["Before tax",usd(v.price)]]};}
    case "savingsGoal": {const remaining=v.goal-v.saved;return {primary:usd(remaining/v.months),label:"Amount to save each month",rows:[["Remaining",usd(remaining)],["Savings goal",usd(v.goal)]]};}
    case "debtIncome": return {primary:f(v.debt/v.income*100)+"%",label:"Debt-to-income ratio",rows:[["Monthly debt",usd(v.debt)],["Gross monthly income",usd(v.income)]]};
    case "percentOf": return {primary:f(v.part/v.whole*100)+"%",label:"Percentage",rows:[["Part",f(v.part)],["Whole",f(v.whole)]]};
    case "xPercent": return {primary:f(v.percent/100*v.number),label:"Answer",rows:[["Percentage",f(v.percent)+"%"],["Number",f(v.number)]]};
    case "percentChange": return {primary:f((v.end-v.start)/v.start*100)+"%",label:"Percentage change",rows:[["Difference",f(v.end-v.start)],["New value",f(v.end)]]};
    case "percentDifference": return {primary:f(Math.abs(v.first-v.second)/((v.first+v.second)/2)*100)+"%",label:"Percentage difference",rows:[["Difference",f(Math.abs(v.first-v.second))],["Average",f((v.first+v.second)/2)]]};
    case "testGrade": {const score=(v.total-v.wrong)/v.total*100;const grade=score>=97?"A+":score>=93?"A":score>=90?"A-":score>=87?"B+":score>=83?"B":score>=80?"B-":score>=77?"C+":score>=73?"C":score>=70?"C-":score>=67?"D+":score>=63?"D":"F";return {primary:f(score)+"%",label:"Test score",rows:[["Letter grade",grade],["Correct answers",f(v.total-v.wrong)],["Incorrect answers",f(v.wrong)]]};}
    case "grade": {const valid=dynamicRows.filter((row)=>Number(row.possible)>0),weighted=valid.some((row)=>Number(row.weight)>0),numerator=weighted?valid.reduce((sum,row)=>sum+Number(row.earned)/Number(row.possible)*Number(row.weight),0):valid.reduce((sum,row)=>sum+Number(row.earned),0),denominator=weighted?valid.reduce((sum,row)=>sum+Number(row.weight),0):valid.reduce((sum,row)=>sum+Number(row.possible),0),current=denominator?numerator/denominator*100:NaN,finalWeight=weighted?v.finalWeight:0,required=finalWeight>0?(v.target*100-numerator)/finalWeight:NaN;return {primary:f(current)+"%",label:"Current grade",rows:[["Grading method",weighted?"Weighted":"Points-based"],["Assignments",f(valid.length)],["Total points",`${f(valid.reduce((sum,row)=>sum+Number(row.earned),0))} / ${f(valid.reduce((sum,row)=>sum+Number(row.possible),0))}`],["Required final score",Number.isFinite(required)?f(required)+"%":"Add a final weight"]]};}
    case "reversePercent": return {primary:f(v.final/(v.percent/100)),label:"Original value",rows:[["Final value",f(v.final)],["Percentage remaining",f(v.percent)+"%"]]};
    case "birthYear": {const year=v.year-v.age;return {primary:f(year),label:"Estimated birth year",rows:[["Current age",f(v.age)+" years"],["Current year",f(v.year)],["Range",`${f(year-1)}â€“${f(year)}`]]};}
    case "ftCm": return {primary:f(v.value*30.48)+" cm",label:"Centimeters",rows:[["Feet",f(v.value)]]}; case "cmFt": return {primary:f(v.value/30.48)+" ft",label:"Feet",rows:[["Centimeters",f(v.value)]]}; case "inCm": return {primary:f(v.value*2.54)+" cm",label:"Centimeters",rows:[["Inches",f(v.value)]]}; case "lbKg": return {primary:f(v.value*0.453592)+" kg",label:"Kilograms",rows:[["Pounds",f(v.value)]]}; case "kgLb": return {primary:f(v.value*2.20462)+" lb",label:"Pounds",rows:[["Kilograms",f(v.value)]]}; case "miKm": return {primary:f(v.value*1.60934)+" km",label:"Kilometers",rows:[["Miles",f(v.value)]]}; case "fC": return {primary:f((v.value-32)*5/9)+" Â°C",label:"Celsius",rows:[["Fahrenheit",f(v.value)]]}; case "cF": return {primary:f(v.value*9/5+32)+" Â°F",label:"Fahrenheit",rows:[["Celsius",f(v.value)]]};
    case "bmi": {const bmi=v.weight/Math.pow(v.height/100,2);return {primary:f(bmi),label:"Body mass index",rows:[["Category",bmi<18.5?"Underweight":bmi<25?"Typical range":bmi<30?"Overweight":"Higher range"],["Weight",f(v.weight)+" kg"]]};}
    case "calories": {const bmr=10*v.weight+6.25*v.height-5*v.age-161;return {primary:f(bmr*v.activity)+" kcal",label:"Estimated daily calories",rows:[["Baseline estimate",f(bmr)+" kcal"],["Activity multiplier",f(v.activity)]]};}
    case "pace": return {primary:f(v.minutes/v.distance)+" min/km",label:"Average pace",rows:[["Distance",f(v.distance)+" km"],["Time",f(v.minutes)+" min"]]};
    case "water": {const liters=v.weight*0.033+v.activity*0.012;return {primary:f(liters)+" L",label:"Estimated daily water target",rows:[["Milliliters",f(liters*1000)+" ml"],["Weight",f(v.weight)+" kg"]]};}
    case "bmr": {const total=10*v.weight+6.25*v.height-5*v.age-161;return {primary:f(total)+" kcal",label:"Estimated daily BMR",rows:[["Weight",f(v.weight)+" kg"],["Height",f(v.height)+" cm"]]};}
    case "idealWeight": {const meters=v.height/100;return {primary:`${f(18.5*meters*meters)}â€“${f(24.9*meters*meters)} kg`,label:"Estimated healthy-weight range",rows:[["Height",f(v.height)+" cm"],["BMI range","18.5â€“24.9"]]};}
    case "oneRepMax": {const total=v.weight*(1+v.reps/30);return {primary:f(total)+" kg",label:"Estimated one-rep maximum",rows:[["Lift",f(v.weight)+" kg"],["Repetitions",f(v.reps)]]};}
    case "heartRate": {const max=220-v.age,target=max*v.intensity/100;return {primary:f(target)+" bpm",label:"Estimated target heart rate",rows:[["Estimated max",f(max)+" bpm"],["Intensity",f(v.intensity)+"%"]]};}
    case "bodySurface": {const total=Math.sqrt(v.height*v.weight/3600);return {primary:f(total)+" mÂ²",label:"Estimated body surface area",rows:[["Weight",f(v.weight)+" kg"],["Height",f(v.height)+" cm"]]};}
    case "average": return {primary:f((v.first+v.second+v.third)/3),label:"Average",rows:[["Sum",f(v.first+v.second+v.third)],["Values","3"]]};
    case "fraction": return {primary:f(v.numerator/v.denominator),label:"Decimal value",rows:[["Fraction",`${f(v.numerator)}/${f(v.denominator)}`],["Percentage",f(v.numerator/v.denominator*100)+"%"]]};
    case "stdDev": {const mean=(v.first+v.second+v.third)/3,sd=Math.sqrt(((v.first-mean)**2+(v.second-mean)**2+(v.third-mean)**2)/3);return {primary:f(sd),label:"Population standard deviation",rows:[["Mean",f(mean)],["Values","3"]]};}
    case "decimalTime": {const hours=Math.floor(v.hours), minutes=Math.round((v.hours-hours)*60);return {primary:`${hours}h ${minutes}m`,label:"Hours and minutes",rows:[["Total minutes",f(v.hours*60)+" min"],["Decimal hours",f(v.hours)]]};}
    case "businessBreakEven": {const contribution=v.price-v.variable, sales=v.fixed/contribution;return {primary:f(sales)+" sales",label:"Break-even sales",rows:[["Contribution per sale",usd(contribution)],["Break-even revenue",usd(sales*v.price)]]};}
    case "roi": return {primary:f((v.gain-v.cost)/v.cost*100)+"%",label:"Return on investment",rows:[["Net return",usd(v.gain-v.cost)],["Investment cost",usd(v.cost)]]};
    case "ratio": {const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;const g=gcd(Math.round(v.first),Math.round(v.second));return {primary:`${v.first/g}:${v.second/g}`,label:"Simplified ratio",rows:[["First",f(v.first)],["Second",f(v.second)]]};}
    case "exponent": return {primary:f(Math.pow(v.base,v.exponent)),label:"Result",rows:[["Expression",`${f(v.base)}^${f(v.exponent)}`]]}; case "sqrt": return {primary:v.value<0?"â€”":f(Math.sqrt(v.value)),label:"Square root",rows:[["Number",f(v.value)]]};
    case "volume": {const volume=v.length*v.width*v.height;return {primary:f(volume)+" cubic units",label:"Volume",rows:[["Base area",f(v.length*v.width)+" square units"],["Formula",`${f(v.length)} Ã— ${f(v.width)} Ã— ${f(v.height)}`]]};}
    case "area": return {primary:f(v.length*v.width)+" square units",label:"Rectangle area",rows:[["Perimeter",f(2*(v.length+v.width))+" units"],["Formula",`${f(v.length)} Ã— ${f(v.width)}`]]};
    case "pythagorean": return {primary:f(Math.hypot(v.first,v.second)),label:"Hypotenuse",rows:[["First leg",f(v.first)],["Second leg",f(v.second)]]};
    case "distance": return {primary:f(Math.hypot(v.x2-v.x1,v.y2-v.y1)),label:"Distance",rows:[["Horizontal change",f(v.x2-v.x1)],["Vertical change",f(v.y2-v.y1)]]};
    case "slope": return {primary:v.x2===v.x1?"Undefined":f((v.y2-v.y1)/(v.x2-v.x1)),label:"Slope",rows:[["Rise",f(v.y2-v.y1)],["Run",f(v.x2-v.x1)]]};
    case "quadratic": {const d=v.b*v.b-4*v.a*v.c;const first=(-v.b+Math.sqrt(d))/(2*v.a),second=(-v.b-Math.sqrt(d))/(2*v.a);return {primary:d<0?"No real roots":`${f(first)}, ${f(second)}`,label:"Solutions",rows:[["Discriminant",f(d)],["Equation",`${f(v.a)}xÂ² + ${f(v.b)}x + ${f(v.c)} = 0`]]};}
    case "percentError": return {primary:f(Math.abs(v.observed-v.actual)/Math.abs(v.actual)*100)+"%",label:"Percent error",rows:[["Difference",f(Math.abs(v.observed-v.actual))],["Accepted value",f(v.actual)]]};
    case "speed": return {primary:f(v.distance/v.time)+" km/h",label:"Average speed",rows:[["Distance",f(v.distance)+" km"],["Time",f(v.time)+" hours"]]};
    case "density": return {primary:f(v.mass/v.volume)+" g/cmÂ³",label:"Density",rows:[["Mass",f(v.mass)+" g"],["Volume",f(v.volume)+" cmÂ³"]]};
    case "aiApi": {const one=(v.input/1e6*defaultAIModel.inputPerMillionTokens)+(v.output/1e6*defaultAIModel.outputPerMillionTokens), monthly=one*v.requests*v.days;return {primary:usd(monthly),label:"Estimated monthly API cost",rows:[["Per request",usd(one)],["Daily",usd(one*v.requests)],["Yearly",usd(monthly*12)],["Input cost",usd(v.input/1e6*defaultAIModel.inputPerMillionTokens)],["Output cost",usd(v.output/1e6*defaultAIModel.outputPerMillionTokens)]]};}
    case "aiTokens": {const input=v.input/1e6*defaultAIModel.inputPerMillionTokens,output=v.output/1e6*defaultAIModel.outputPerMillionTokens;return {primary:usd(input+output),label:"Estimated request cost",rows:[["Input",usd(input)],["Output",usd(output)]]};}
    case "tokenEstimate": {const tokens=v.words*1.33;return {primary:f(tokens*v.requests)+" tokens",label:"Estimated total tokens",rows:[["Per request",f(tokens)+" tokens"],["Words",f(v.words)]]};}
    case "chatbot": {const per=(v.input/1e6*defaultAIModel.inputPerMillionTokens)+(v.output/1e6*defaultAIModel.outputPerMillionTokens);return {primary:usd(per*v.conversations),label:"Estimated monthly chatbot cost",rows:[["Per conversation",usd(per)],["Conversations",f(v.conversations)]]};}
    case "saas": {const ai=v.users*v.requests*v.tokens/1e6*defaultAIModel.inputPerMillionTokens, revenue=v.users*v.price,total=ai+v.other,profit=revenue-total;return {primary:usd(profit),label:"Estimated monthly gross profit",rows:[["AI cost",usd(ai)],["Total cost",usd(total)],["Revenue",usd(revenue)],["Gross margin",f(profit/revenue*100)+"%"]]};}
    case "breakEven": {const profit=v.revenue-v.aiCost-v.variable,customers=v.fixed/profit;return {primary:f(customers)+" customers",label:"Break-even customers",rows:[["Profit per customer",usd(profit)],["Break-even revenue",usd(customers*v.revenue)]]};}
    case "generation": {const daily=v.generations*v.cost,monthly=daily*v.days;return {primary:usd(monthly),label:"Estimated monthly cost",rows:[["Daily",usd(daily)],["Annual",usd(monthly*12)]]};}
    default: return {primary:"â€”",label:"Result",rows:[]};
  }
}
export default function CalculatorClient({ calculator }: { calculator: Calculator }) {
  const initial = Object.fromEntries(calculator.fields.map((field) => [field.id, field.defaultValue]));
  const [values, setValues] = useState<Record<string, number>>(initial);
  const initialRows = calculator.dynamicRows?.initialRows ?? [];
  const [rows, setRows] = useState<DynamicRow[]>(initialRows);
  const result = useMemo(() => calculate(calculator, values, rows), [calculator, values, rows]);
  const changedField = useRef<string | null>(null);
  const previousResult = useRef(result.primary);

  useEffect(() => {
    if (result.primary === previousResult.current || changedField.current === null) return;
    posthog.capture("calculator_computed", { calculator_slug: calculator.slug, calculator_title: calculator.title, calculator_category: calculator.category, changed_field: changedField.current, result_label: result.label });
    previousResult.current = result.primary;
    changedField.current = null;
  }, [calculator, result]);

  const handleChange = (fieldId: string, value: number) => { changedField.current = fieldId; setValues((current) => ({ ...current, [fieldId]: value })); };
  const handleReset = () => { setValues(initial); setRows(initialRows); posthog.capture("calculator_reset", { calculator_slug: calculator.slug, calculator_title: calculator.title, calculator_category: calculator.category }); };

  if (calculator.dynamicRows) return <section className="calculator" aria-label={`${calculator.title} form`}><div className="fields"><DynamicRows definition={calculator.dynamicRows} rows={rows} onChange={setRows} />{calculator.fields.map((field) => <label key={field.id}>{field.label}<div className="input-wrap">{field.suffix === "$" && <span>$</span>}<input type="number" min={field.min} value={Number.isFinite(values[field.id]) ? values[field.id] : ""} onChange={(event) => handleChange(field.id, Number(event.target.value))} />{field.suffix && field.suffix !== "$" && <span>{field.suffix}</span>}</div></label>)}</div><div className="result" aria-live="polite"><p>{result.label}</p><strong>{result.primary}</strong><dl>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><button type="button" onClick={handleReset}>Reset calculator</button></div></section>;

  return <section className="calculator" aria-label={`${calculator.title} form`}><div className="fields">{calculator.fields.map((field) => <label key={field.id}>{field.label}<div className="input-wrap">{field.suffix === "$" && <span>$</span>}<input type="number" min={field.min} value={Number.isFinite(values[field.id]) ? values[field.id] : ""} onChange={(event) => handleChange(field.id, Number(event.target.value))} />{field.suffix && field.suffix !== "$" && <span>{field.suffix}</span>}</div></label>)}</div><div className="result" aria-live="polite"><p>{result.label}</p><strong>{result.primary}</strong><dl>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><button type="button" onClick={handleReset}>Reset values</button></div>{calculator.ai && <p className="pricing-note">Example pricing data last updated {defaultAIModel.lastUpdated}. AI model pricing changes over time—check the provider&apos;s official pricing before making purchasing decisions.</p>}</section>;
}
