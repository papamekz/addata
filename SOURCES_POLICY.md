# Sources Policy

## Principle

This dataset documents the harms of outdoor advertising using **exclusively independent sources**.
No data from advertising companies, industry associations, or marketing research firms is accepted.

## Accepted Sources

| Type | Examples |
|------|---------|
| Peer-reviewed academic journals | BMC Public Health, Nature, SAGE, Taylor & Francis, Springer |
| WHO / UN reports | World Health Organization guidelines and policy statements |
| Government / public health agencies | CDC, national health ministries, environmental agencies |
| Court rulings and regulatory decisions | Competition authorities, constitutional courts, administrative courts |
| Investigative journalism | Only as corroborating evidence or as the documented object of a claim; prefer primary documents where available |
| University research (non-sponsored) | Must have no disclosed funding from advertising industry |
| Independent NGOs | DarkSky International, public health nonprofits |
| Academic books (university presses) | Routledge, Oxford UP, Cambridge UP, MIT Press |

## URL Stability

Source URLs should be stable enough for both humans and AI agents to resolve.
Prefer:

- official report pages, persistent repository records, DOI landing pages, PubMed/PMC pages, or direct PDFs from official domains
- court/regulator/agency pages over press copies or news summaries
- repository records over rate-limited metadata APIs

Avoid:

- generic homepages when a specific report or decision URL exists
- search-result URLs, session URLs, tracking URLs, and temporary download redirects
- API endpoints as the primary source URL when a normal landing page exists
- links that currently return 403, 404, 429, timeout, or redirect to an error page in `node scripts/audit-urls.js`

If a source is accurate but the URL is unstable, replace the URL with a stable landing page or official archive copy while keeping the DOI/title metadata.

## Rejected Sources

The following are **explicitly excluded**:

- OAAA (Out of Home Advertising Association of America)
- WFA (World Federation of Advertisers)
- FEPE International
- Nielsen (advertising measurement)
- Any study with primary funding from: Outdoor Media Group, Clear Channel, Lamar, JCDecaux, or similar
- Industry-sponsored "research" reports or white papers
- Marketing analytics firms (eMarketer, Statista paid content, etc.)

Industry reports may appear only when the claim is explicitly analysing or critiquing
the industry report itself, not as independent evidence of public benefit.

When `source.independent: false` is used, the claim must clearly be one of:

- a self-admission or self-reported operator/industry figure
- a regulatory/financial risk disclosed by the operator itself
- an allegation or interested-market-actor source that is explicitly labelled as such
- the object of a source critique, not independent evidence

## How to Verify Independence

1. Check the **Funding / Disclosure** section of any paper
2. Search the authors' affiliations — no advertising company employment
3. Check if the journal has published rebuttals or corrections related to industry conflicts
4. For NGOs: verify 501(c)(3) or equivalent status and review their funding sources

## Flagging

If you find a source that may not meet these criteria, open a GitHub Issue with the label `source-review`.
Claims with unresolved source questions are marked `verified: false` in their frontmatter.
