const BATCH3R1_LESSONS = [
  // 1. 75-Lakh to 2-Crore Recycling Plant Entrepreneurship
  {
    slug: "75-lakh-2-crore-scale-tier-extrusion-plants-recycling-and-processing-lines",
    title: "₹75 Lakh–₹2 Crore Scale Recycling & Extrusion Plants: Project Economics & Working Capital",
    module_name: "Module 4 — Industrial Policy, EPR & Entrepreneurship",
    level: "advanced",
    previous_score: 72,
    quality_score: 90,
    review_status: "internally_reviewed",
    review_governance_status: "internally_curated",
    regulatory_verification_status: "not_applicable",
    reviewed_by: "Internally curated and technically reviewed",
    academic_reviewer_id: null,
    content: `# ₹75 Lakh–₹2 Crore Scale Recycling & Extrusion Plants: Project Economics & Working Capital

> [!WARNING]
> **Indicative Planning Range Caution**: Equipment CAPEX, civil costs, and working capital requirements represent **indicative planning estimates as of July 2026** based on standard Indian industrial machinery quotations. Market data verification is pending dated supplier quotes.

> [!NOTE]
> **Model Classification**: Simplified pre-finance project model — not a bankable project report, supplier quotation or investment recommendation.

## 1. Why This Topic Matters
Establishing a medium-scale PET bottle flake or Polyolefin pellet recycling plant in India ($\text{₹}75\text{ Lakhs}$ to $\text{₹}2.0\text{ Crores}$ investment tier) requires balancing fixed capital expenditure (machinery, power substation, effluent treatment) with operating working capital. Operating at $500\text{ kg/hour}$ feed capacity requires careful management of raw flake yield losses ($8\%$), power consumption, itemized variable costs, and inventory turn days to achieve sustainable cash flows.

## 2. Learning Objectives
By completing this lesson, you will be able to:
- **Structure** CAPEX and working capital across Conservative, Base, and Optimistic scenarios.
- **Calculate** yield-adjusted feedstock costs and itemized variable OPEX per kg.
- **Derive** line-by-line full manufacturing production costs per kg.
- **Differentiate** 80% Base Operating Working Capital vs 100% Peak Design Working Capital.

## 3. Core Setup Architecture

\`\`\`mermaid
graph TD
    A["Raw PET Bottle Bales Input (₹55/kg)"] --> B["Bale Breaker & Sorting (8% Contaminant Removal)"]
    B --> C["Wet Crushing & Hot Chemical Wash (Yield-Adjusted Flake ₹59.78/kg)"]
    C --> D["Extrusion Pelletization & Screen Filtering (Variable OPEX ₹7.00/kg)"]
    D --> E["Recycled RPET Granules Output (Selling Price ₹78.00/kg)"]
    E --> F["Net Contribution Margin (₹11.22/kg)"]
\`\`\`

## 4. Line-by-Line Cost Derivations & Scenario Financial Model

### 4.1 Fixed CAPEX Breakdown (₹140.00 Lakhs)
- **Extrusion & Recycling Machinery**: ₹95.00 Lakhs ($500\text{ kg/hr}$ twin-screw degassing extruder + hot washer + pelletizer)
- **Power Substation & Electricals**: ₹18.00 Lakhs ($250\text{ kVA}$ transformer + DG backup)
- **Civil Utility & ETP Setup**: ₹15.00 Lakhs (Effluent treatment plant + water recycling)
- **Pre-Operating & Tooling Expenses**: ₹12.00 Lakhs
- **Total Fixed CAPEX**: **₹140.00 Lakhs**

### 4.2 Operating Schedule & Capacity Basis
- **Scheduled Capacity**: $300\text{ operating days/year} \times 20\text{ scheduled hours/day} = 6,000\text{ scheduled operating hours/year}$.
- **Hourly Feed Rate**: $500\text{ kg/hour}$ raw PET bottle bales ($8,000\text{ kg/day}$ at 80% utilization; $10,000\text{ kg/day}$ at 100% peak capacity).
- **Staffing**: 8 Plant Technicians across 2 shifts ($8 \times \text{₹}22,000/\text{month} \times 12 = \text{₹}21.12\text{ Lakhs/year}$).
- **Fixed Annual OPEX (₹36.87 Lakhs/yr)**: Factory Rent (₹12.00L) + Technician Salaries (₹21.12L) + Maintenance & Insurance (₹3.75L).

### 4.3 Unit Economics & Itemized Variable Costs
- **Raw Bales Purchase Price**: ₹55.00/kg
- **Resin Yield ($92\%$)**: Yield-adjusted raw flake cost = $\frac{\text{₹}55.00}{0.92} = \mathbf{\text{₹}59.78/\text{kg}}$.
- **Itemized Variable Operating Costs (₹7.00/kg Total)**:
  - Electricity ($0.45\text{ kWh/kg} \times \text{₹}9.00/\text{kWh}$): **₹4.05/kg**
  - Water, ETP & Washing Chemicals: **₹1.20/kg**
  - Screen Filter Mesh, Consumables & Packaging: **₹0.85/kg**
  - Quality Lab Testing, Freight & Rejects Allowance: **₹0.90/kg**
- **Contribution Margin After Stated Variable Costs**:
  $$\text{Contribution Margin} = \text{Selling Price (₹78.00)} - \text{Flake Cost (₹59.78)} - \text{Variable OPEX (₹7.00)} = \mathbf{\text{₹}11.22/\text{kg}}$$

### 4.4 Line-by-Line Full Manufacturing Cost Derivation
$$\text{Full Manufacturing Cost/kg} = \text{Yield-Adjusted Flake Cost (₹59.78)} + \text{Variable OPEX (₹7.00)} + \text{Allocated Fixed OPEX/kg}$$

- *Base ($2,208,000\text{ kg/yr}$)*: Allocated Fixed OPEX = $\frac{\text{₹}36.87\text{L}}{2,208,000\text{ kg}} = \text{₹}1.67/\text{kg} \implies \mathbf{\text{₹}68.45/\text{kg}}$.

### 4.5 Working Capital Comparison: 80% Base Operating vs 100% Peak Design Basis

| Working Capital & Investment Line Item | 80% Base Operating Basis | 100% Peak Design Load Basis |
|---|:---:|:---:|
| **Daily Raw Bales Feed Throughput** | **8,000 kg/day** | **10,000 kg/day** |
| **Daily Saleable Output (92% Yield)** | **7,360 kg/day** | **9,200 kg/day** |
| **7-Day Raw Flake Inventory (@ ₹55/kg)** | ₹30.80 Lakhs | ₹38.50 Lakhs |
| **7-Day Finished Goods Stock (@ Cost ₹68.45/kg)** | ₹35.27 Lakhs | ₹44.08 Lakhs |
| **15-Day Receivables (@ Selling Price ₹78/kg)** | ₹86.11 Lakhs | ₹107.64 Lakhs |
| **Less 15-Day Supplier Credit (@ ₹55/kg)** | -₹66.00 Lakhs | -₹82.50 Lakhs |
| **Net Working Capital (NWC)** | **₹86.18 Lakhs** | **₹107.72 Lakhs** |
| **Fixed Equipment & Utility CAPEX** | ₹140.00 Lakhs | ₹140.00 Lakhs |
| **Total Project Funding Requirement** | **₹226.18 Lakhs** ($\approx \text{₹}2.26\text{ Cr}$) | **₹247.72 Lakhs** ($\approx \text{₹}2.48\text{ Cr}$) |
| **Annual Post-Tax Operating Cash Flow** | **₹158.15 Lakhs/year** | **₹204.60 Lakhs/year** (Full Peak) |
| **Recalculated Project Payback Period** | **1.430 Years (17.2 Months)** | **1.211 Years (14.5 Months)** |

*Note on Peak Funding:* Under peak funding (₹247.72L) evaluated against base operating cash flow (₹158.15L/yr), the conservative peak payback is $1.566\text{ years}$ ($18.8\text{ months}$).

## 5. Industrial Applications
- **RPET Granules for Textile & Packaging**: Plant setup in Gujarat recycling cluster supplying fiber extruders and sheet plants. *(Illustrative Indian industry scenario based on PET recycling operations).*

## 6. Key Takeaways & Glossary
- **Yield-Adjusted Feedstock Cost**: Cost per net usable kg accounting for unwashed bottle contamination losses.
- **Finished Goods Stock Valuation**: Valued at full manufacturing production cost per kg, not selling price.

## 7. Sources & Standard References
1. CIPET Plastic Product Design & Costing Handbook, 2022.
2. MSME Development Act Guidelines, Ministry of Micro, Small and Medium Enterprises, 2021.
`
  }
];

module.exports = {
  BATCH3R1_LESSONS
};
