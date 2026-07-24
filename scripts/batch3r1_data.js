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
- **Differentiate** Average Operating Working Capital vs Peak Design Working Capital requirements.

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
- **Hourly Feed Rate**: $500\text{ kg/hour}$ raw PET bottle bales ($8,000\text{ kg/day}$ peak load).
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

- *Conservative ($1,656,000\text{ kg/yr}$)*: Allocated Fixed OPEX = $\frac{\text{₹}36.87\text{L}}{1,656,000\text{ kg}} = \text{₹}2.23/\text{kg} \implies \mathbf{\text{₹}69.01/\text{kg}}$.
- *Base ($2,208,000\text{ kg/yr}$)*: Allocated Fixed OPEX = $\frac{\text{₹}36.87\text{L}}{2,208,000\text{ kg}} = \text{₹}1.67/\text{kg} \implies \mathbf{\text{₹}68.45/\text{kg}}$.
- *Optimistic ($2,484,000\text{ kg/yr}$)*: Allocated Fixed OPEX = $\frac{\text{₹}36.87\text{L}}{2,484,000\text{ kg}} = \text{₹}1.48/\text{kg} \implies \mathbf{\text{₹}68.26/\text{kg}}$.

### 4.5 Base-Case Working Capital Breakdown: Average vs Peak Design Basis

| Base Scenario Working Capital Line Item | Average Operating Basis (80% Schedule) | Peak Design Load Basis (100% Capacity) |
|---|:---:|:---:|
| **Daily Raw Bales Feed** | $7,360\text{ kg/day}$ | $8,000\text{ kg/day}$ |
| **Daily Saleable RPET Output** | $6,771.2\text{ kg/day}$ | $7,360.0\text{ kg/day}$ |
| **7-Day Raw Flake Stock (@ ₹55/kg)** | ₹28.34 Lakhs | ₹30.80 Lakhs |
| **7-Day Finished Goods Stock (@ Cost ₹68.45/kg)** | ₹32.44 Lakhs | ₹35.27 Lakhs |
| **15-Day Receivables (@ Selling Price ₹78/kg)** | ₹79.22 Lakhs | ₹86.11 Lakhs |
| **Less 15-Day Supplier Credit (@ ₹55/kg)** | -₹60.72 Lakhs | -₹66.00 Lakhs |
| **Net Working Capital (NWC)** | **₹79.28 Lakhs** | **₹86.18 Lakhs** |
| **Fixed Equipment & Utility CAPEX** | ₹140.00 Lakhs | ₹140.00 Lakhs |
| **Total Initial Project Investment** | **₹219.28 Lakhs** | **₹226.18 Lakhs** |
| **Simplified Post-Tax Cash Flow (25% tax)** | **₹158.15 Lakhs/year** | **₹158.15 Lakhs/year** |
| **Recalculated Project Payback Period** | **1.387 Years (16.6 Months)** | **1.430 Years (17.2 Months)** |

### 4.6 3-Scenario Summary Table (Average Operating Basis)

| Financial & Operating Metric | Conservative Scenario | Base Scenario | Optimistic Scenario |
|---|:---:|:---:|:---:|
| **Operating Utilization (6,000 hrs)** | $60\%$ | $80\%$ | $90\%$ |
| **Annual Saleable RPET Output (kg)** | $1,656,000\text{ kg}$ | $2,208,000\text{ kg}$ | $2,484,000\text{ kg}$ |
| **Full Manufacturing Cost per kg** | **₹69.01/kg** | **₹68.45/kg** | **₹68.26/kg** |
| **Net Working Capital (Average Basis)** | **₹59.66 Lakhs** | **₹79.28 Lakhs** | **₹89.10 Lakhs** |
| **Fixed Equipment CAPEX** | ₹140.00 Lakhs | ₹140.00 Lakhs | ₹140.00 Lakhs |
| **Total Initial Project Cost (Average Basis)** | **₹199.66 Lakhs** | **₹219.28 Lakhs** | **₹229.10 Lakhs** |
| **Annual Gross Contribution (₹11.22/kg)** | ₹185.80 Lakhs | ₹247.74 Lakhs | ₹278.70 Lakhs |
| **Pre-Tax Operating Profit** | ₹148.93 Lakhs | ₹210.87 Lakhs | ₹241.83 Lakhs |
| **Simplified Post-Tax Cash Flow (25% tax)**| **₹111.70 Lakhs/yr** | **₹158.15 Lakhs/yr** | **₹181.37 Lakhs/yr** |
| **Recalculated Payback (Average Basis)** | **1.787 Years (21.4 Mos)** | **1.387 Years (16.6 Mos)** | **1.263 Years (15.2 Mos)** |

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
