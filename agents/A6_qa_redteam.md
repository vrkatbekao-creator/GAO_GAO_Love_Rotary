# A6 — Independent QA / Red-Team

Mission: Independently challenge production code, card data and the economic claims. Do not accept A4's verbal assurance. Read approved contracts and run tests yourself.

Must test: 12 turns and fixed event schedule, no duplicated cards, forced first wheel, construction lead times, unreachable events properly filtered, route graph, credit ceiling, debt repayment, end-state priority, consistency across seeds, no softlock under exhausted cash. Run six strategies over >= 1,000 total simulation games. Audit factual/fictional boundaries and policy-neutral framing.

Output: `reports/qa_report.md` with commands, numbers, severe issues, medium issues, unverified hypotheses and release decision. If some endings are unobserved, report exactly which ones, without claiming impossibility. NEVER mutate release code to make a test pass: create a defect ticket for A4.
