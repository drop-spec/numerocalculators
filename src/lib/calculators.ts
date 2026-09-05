export type Category = "money" | "percentage" | "time-date" | "conversions" | "health-fitness" | "math" | "business" | "ai-calculators";
export type Field = { id: string; label: string; defaultValue: number; suffix?: string; min?: number };
export type Calculator = {
  slug: string; title: string; description: string; category: Category; fields: Field[]; formula: string;
  keywords: string[]; explanation: string; example: string; related: string[]; ai?: boolean;
};

export const categories: Record<Category, { title: string; description: string; accent: string }> = {
  money: { title: "Money calculators", description: "Make clearer decisions about pay, borrowing, saving, and everyday spending.", accent: "Money" },
  percentage: { title: "Percentage calculators", description: "Quick percentage answers for discounts, changes, and comparisons.", accent: "Percent" },
  "time-date": { title: "Time & date calculators", description: "Plan dates, durations, and working time without the mental arithmetic.", accent: "Time" },
  conversions: { title: "Conversion calculators", description: "Practical unit conversions with plain, accurate results.", accent: "Convert" },
  "health-fitness": { title: "Health & fitness calculators", description: "Helpful estimates for fitness planning and everyday health questions.", accent: "Health" },
  math: { title: "Math calculators", description: "Straightforward tools for common math problems.", accent: "Math" },
  business: { title: "Business calculators", description: "Simple numbers for pricing, margins, and planning.", accent: "Business" },
  "ai-calculators": { title: "AI cost calculators", description: "Estimate AI API, token, product, image, and video costs before you commit budget.", accent: "AI tools" },
};

const c = (slug: string, title: string, category: Category, fields: Field[], formula: string, description: string, keywords: string[] = []): Calculator => ({
  slug, title, category, fields, formula, description, keywords, explanation: "Enter the values you know to get an instant estimate. Results are rounded for readability; use them as a practical planning guide.", example: "Try the pre-filled values, then adjust them to match your situation.", related: [], ai: category === "ai-calculators",
});
const n = (id: string, label: string, defaultValue: number, suffix?: string): Field => ({ id, label, defaultValue, suffix, min: 0 });

export const calculators: Calculator[] = [
  c("salary-to-hourly", "Salary to Hourly Calculator", "money", [n("salary","Annual salary",52000,"$"),n("hours","Hours per week",40),n("weeks","Weeks per year",52)], "salaryHourly", "Convert an annual salary into an hourly pay estimate."),
  c("hourly-to-salary", "Hourly to Salary Calculator", "money", [n("rate","Hourly pay",25,"$"),n("hours","Hours per week",40),n("weeks","Weeks per year",52)], "hourlySalary", "See weekly, monthly, and annual pay from an hourly rate.", ["salary", "annual", "wage"]),
  c("overtime-calculator", "Overtime Calculator", "money", [n("rate","Hourly pay",25,"$"),n("hours","Overtime hours",8),n("multiplier","Overtime multiplier",1.5)], "overtime", "Estimate overtime pay at your agreed multiplier."),
  c("tip-calculator", "Tip Calculator", "money", [n("bill","Bill amount",80,"$"),n("tip","Tip percentage",20,"%"),n("people","People splitting",2)], "tip", "Calculate a tip and a fair per-person total."),
  c("discount-calculator", "Discount Calculator", "money", [n("price","Original price",120,"$"),n("discount","Discount",20,"%")], "discount", "Find the sale price and savings from a percentage discount."),
  c("profit-margin-calculator", "Profit Margin Calculator", "money", [n("revenue","Revenue",1000,"$"),n("cost","Cost",650,"$")], "margin", "Calculate profit and profit margin from revenue and costs.", ["margin calculator", "gross margin", "profit"]),
  c("markup-calculator", "Markup Calculator", "money", [n("cost","Cost",50,"$"),n("markup","Markup",40,"%")], "markup", "Turn a cost and markup percentage into a selling price."),
  c("commission-calculator", "Commission Calculator", "money", [n("sales","Sales amount",5000,"$"),n("rate","Commission rate",8,"%")], "commission", "Estimate commission based on sales and a percentage rate."),
  c("loan-payment-calculator", "Loan Payment Calculator", "money", [n("principal","Loan amount",250000,"$"),n("rate","Annual interest rate",6.5,"%"),n("years","Loan term",30,"years")], "loan", "Estimate a fixed monthly loan payment, excluding taxes and insurance."),
  c("simple-interest-calculator", "Simple Interest Calculator", "money", [n("principal","Starting amount",1000,"$"),n("rate","Annual rate",5,"%"),n("years","Years",3)], "simpleInterest", "Calculate simple interest and total value."),
  c("compound-interest-calculator", "Compound Interest Calculator", "money", [n("principal","Starting amount",1000,"$"),n("rate","Annual rate",5,"%"),n("years","Years",10)], "compoundInterest", "Estimate compounded growth with annual compounding."),
  c("sales-tax-calculator", "Sales Tax Calculator", "money", [n("price","Price before tax",100,"$"),n("taxRate","Sales tax rate",8.25,"%")], "salesTax", "Calculate sales tax and the final purchase price.", ["tax", "sales tax", "tax included"]),
  c("savings-goal-calculator", "Savings Goal Calculator", "money", [n("goal","Savings goal",10000,"$"),n("saved","Already saved",2000,"$"),n("months","Months to save",12,"months")], "savingsGoal", "Find the monthly amount needed to reach a savings goal."),
  c("debt-to-income-calculator", "Debt-to-Income Calculator", "money", [n("debt","Monthly debt payments",1200,"$"),n("income","Gross monthly income",5000,"$")], "debtIncome", "Estimate your debt-to-income ratio from monthly amounts."),
  c("annual-income-calculator", "Annual Income Calculator", "money", [n("hourlyRate","Hourly pay",25,"$"),n("hoursPerWeek","Hours per week",40),n("weeksPerYear","Weeks per year",52)], "annualIncome", "Estimate your yearly, monthly, and weekly income from an hourly rate.", ["annual income", "yearly income", "salary"]),
  c("percentage-calculator", "Percentage Calculator", "percentage", [n("part","Part",20),n("whole","Whole",80)], "percentOf", "Find what percentage one number is of another.", ["percent", "what percent"]),
  c("what-is-x-percent-of-y", "What Is X% of Y?", "percentage", [n("percent","Percentage",25,"%"),n("number","Number",200)], "xPercent", "Calculate a percentage of any number."),
  c("percentage-increase-calculator", "Percentage Increase Calculator", "percentage", [n("start","Original value",80),n("end","New value",100)], "percentChange", "Measure a percentage increase or decrease between two values."),
  c("percentage-difference-calculator", "Percentage Difference Calculator", "percentage", [n("first","First value",80),n("second","Second value",100)], "percentDifference", "Compare two values using their average as the reference."),
  c("reverse-percentage-calculator", "Reverse Percentage Calculator", "percentage", [n("final","Final value",80),n("percent","Percentage remaining",80,"%")], "reversePercent", "Find the original value before a percentage reduction or increase."),
  c("test-grade-calculator", "Test Grade Calculator", "math", [n("total","Total questions or points",40),n("wrong","Incorrect answers",7)], "testGrade", "Calculate a percentage score and an estimated letter grade from total and incorrect answers.", ["test score", "teacher grader", "grade percentage"]),
  c("birth-year-calculator", "Birth Year Calculator", "time-date", [n("age","Current age",30,"years"),n("year","Current year",2026)], "birthYear", "Estimate a birth year from a person’s current age and the current year.", ["year born", "what year was I born"]),
  c("feet-to-centimeters", "Feet to Centimeters", "conversions", [n("value","Feet",6,"ft")], "ftCm", "Convert feet to centimeters."),
  c("centimeters-to-feet", "Centimeters to Feet", "conversions", [n("value","Centimeters",180,"cm")], "cmFt", "Convert centimeters to feet."),
  c("inches-to-centimeters", "Inches to Centimeters", "conversions", [n("value","Inches",12,"in")], "inCm", "Convert inches to centimeters."),
  c("pounds-to-kilograms", "Pounds to Kilograms", "conversions", [n("value","Pounds",150,"lb")], "lbKg", "Convert pounds to kilograms."),
  c("kilograms-to-pounds", "Kilograms to Pounds", "conversions", [n("value","Kilograms",70,"kg")], "kgLb", "Convert kilograms to pounds."),
  c("miles-to-kilometers", "Miles to Kilometers", "conversions", [n("value","Miles",10,"mi")], "miKm", "Convert miles to kilometers."),
  c("fahrenheit-to-celsius", "Fahrenheit to Celsius", "conversions", [n("value","Fahrenheit",68,"°F")], "fC", "Convert Fahrenheit to Celsius."),
  c("celsius-to-fahrenheit", "Celsius to Fahrenheit", "conversions", [n("value","Celsius",20,"°C")], "cF", "Convert Celsius to Fahrenheit."),
  c("bmi-calculator", "BMI Calculator", "health-fitness", [n("weight","Weight",70,"kg"),n("height","Height",175,"cm")], "bmi", "Estimate body mass index from height and weight."),
  c("calorie-calculator", "Calorie Calculator", "health-fitness", [n("weight","Weight",70,"kg"),n("height","Height",175,"cm"),n("age","Age",30,"years"),n("activity","Activity multiplier",1.55)], "calories", "Estimate daily energy needs using a simplified Mifflin-St Jeor baseline."),
  c("running-pace-calculator", "Running Pace Calculator", "health-fitness", [n("distance","Distance",5,"km"),n("minutes","Time",30,"minutes")], "pace", "Calculate average running pace per kilometer."),
  c("water-intake-calculator", "Water Intake Calculator", "health-fitness", [n("weight","Weight",70,"kg"),n("activity","Exercise minutes",30,"minutes")], "water", "Estimate a daily water-intake target based on weight and exercise."),
  c("average-calculator", "Average Calculator", "math", [n("first","First number",10),n("second","Second number",20),n("third","Third number",30)], "average", "Find the arithmetic mean of three numbers."),
  c("ratio-calculator", "Ratio Calculator", "math", [n("first","First value",4),n("second","Second value",6)], "ratio", "Express two numbers as a simplified ratio."),
  c("exponent-calculator", "Exponent Calculator", "math", [n("base","Base",2),n("exponent","Exponent",8)], "exponent", "Raise a number to a power."),
  c("square-root-calculator", "Square Root Calculator", "math", [n("value","Number",144)], "sqrt", "Find the principal square root of a non-negative number."),
  c("volume-calculator", "Volume Calculator", "math", [n("length","Length",10,"units"),n("width","Width",5,"units"),n("height","Height",3,"units")], "volume", "Calculate the volume of a rectangular prism from its length, width, and height.", ["volume calculator", "rectangular prism volume", "cubic volume"]),
  c("fraction-calculator", "Fraction Calculator", "math", [n("numerator","Numerator",3),n("denominator","Denominator",4)], "fraction", "Convert a fraction to a decimal and percentage."),
  c("standard-deviation-calculator", "Standard Deviation Calculator", "math", [n("first","First value",10),n("second","Second value",14),n("third","Third value",18)], "stdDev", "Calculate the population standard deviation of three values."),
  c("decimal-hours-to-time", "Decimal Hours to Time Calculator", "time-date", [n("hours","Decimal hours",7.5,"hours")], "decimalTime", "Convert decimal hours into hours and minutes."),
  c("business-break-even-calculator", "Business Break-Even Calculator", "business", [n("fixed","Fixed costs",5000,"$"),n("price","Price per sale",50,"$"),n("variable","Variable cost per sale",20,"$")], "businessBreakEven", "Estimate how many sales your business needs to cover fixed costs."),
  c("roi-calculator", "ROI Calculator", "business", [n("gain","Investment gain",1500,"$"),n("cost","Investment cost",1000,"$")], "roi", "Calculate the return on investment as a percentage."),
  c("ai-api-cost-calculator", "AI API Cost Calculator", "ai-calculators", [n("input","Input tokens per request",100000),n("output","Output tokens per request",25000),n("requests","Requests per day",1000),n("days","Days per month",30)], "aiApi", "Estimate API costs with centralized, clearly labelled example model pricing.", ["AI API", "token cost", "LLM cost"]),
  c("llm-token-cost-calculator", "LLM Token Cost Calculator", "ai-calculators", [n("input","Input tokens",100000),n("output","Output tokens",25000)], "aiTokens", "Estimate the input and output cost of an LLM request."),
  c("ai-token-calculator", "AI Token Calculator", "ai-calculators", [n("words","Words",750),n("requests","Requests",100)], "tokenEstimate", "Estimate tokens from words; tokenization varies by model and language."),
  c("ai-chatbot-cost-calculator", "AI Chatbot Cost Calculator", "ai-calculators", [n("conversations","Conversations per month",10000),n("input","Input tokens per conversation",1200),n("output","Output tokens per conversation",500)], "chatbot", "Estimate monthly AI chatbot API spending."),
  c("ai-saas-cost-calculator", "AI SaaS Cost Calculator", "ai-calculators", [n("users","Monthly active users",1000),n("requests","Requests per user",20),n("tokens","Tokens per request",2000),n("price","Subscription price",20,"$"),n("other","Other monthly costs",3000,"$")], "saas", "Estimate costs, revenue, margin, and break-even for an AI product."),
  c("ai-product-break-even-calculator", "AI Product Break-Even Calculator", "ai-calculators", [n("fixed","Monthly fixed costs",5000,"$"),n("aiCost","AI cost per customer",2,"$"),n("variable","Other variable cost",3,"$"),n("revenue","Revenue per customer",25,"$")], "breakEven", "Find the customer count needed to cover fixed costs."),
  c("ai-image-generation-cost-calculator", "AI Image Generation Cost Calculator", "ai-calculators", [n("generations","Images per day",100),n("cost","Cost per image",0.04,"$"),n("days","Days per month",30)], "generation", "Estimate image-generation spending; provider pricing varies."),
  c("ai-video-generation-cost-calculator", "AI Video Generation Cost Calculator", "ai-calculators", [n("generations","Videos per day",10),n("cost","Cost per video",0.5,"$"),n("days","Days per month",30)], "generation", "Estimate video-generation spending; provider pricing varies."),
];

export const calculatorBySlug = (slug: string) => calculators.find((item) => item.slug === slug);
export const byCategory = (category: Category) => calculators.filter((item) => item.category === category);
export const categoryForPath = (path: string) => (Object.keys(categories) as Category[]).find((key) => key === path);
export const money = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
export const number = (n: number, digits = 2) => new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(n);
