import Link from "next/link"; import GradeCalculator from "@/components/GradeCalculator";
export const metadata={robots:{index:false,follow:true},title:"Grade Calculator"};
export default function Page(){return <main className="embed-page"><h1>Grade Calculator</h1><GradeCalculator compact/><p>Powered by <Link href="/calculators/grade-calculator" target="_blank">Numero Calculators</Link></p></main>;}
