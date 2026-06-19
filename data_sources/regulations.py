REGULATIONS = {
    "GDPR": {
        "regulation_key": "GDPR",
        "celex": "32016R0679",
        "name": "General Data Protection Regulation",
        "max_penalty_eur": 20000000,
        "max_penalty_pct": 4.0,
        "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32016R0679",
        "raw_text": """REGULATION (EU) 2016/679 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL
of 27 April 2016 on the protection of natural persons with regard to the processing
of personal data and on the free movement of such data (General Data Protection Regulation).

KEY OBLIGATIONS:
Article 5 - Principles: Personal data must be processed lawfully, fairly, transparently,
for specified purposes, minimised, accurate, kept no longer than necessary, secured,
and the controller must be accountable for compliance.

Article 6 - Lawful basis: Processing is lawful only if at least one of six bases applies:
consent, contract, legal obligation, vital interests, public task, or legitimate interests.

Article 7 - Consent: Must be freely given, specific, informed, unambiguous. Withdrawable
at any time. Cannot be bundled with terms of service.

Article 12-23 - Data subject rights: Right to access, rectification, erasure (right to be
forgotten), restriction of processing, data portability, and objection.

Article 25 - Privacy by design and default: Data protection must be integrated into
processing activities from the outset. Only necessary data should be processed by default.

Article 30 - Records of processing: Controllers must maintain records of all processing
activities including purposes, categories of data, recipients, retention periods.

Article 32 - Security: Implement appropriate technical and organisational measures
including pseudonymisation, encryption, ensuring confidentiality, integrity and availability.

Article 33 - Breach notification: Notify supervisory authority within 72 hours of
becoming aware of a personal data breach. Notify affected individuals without undue delay
if high risk.

Article 35 - Data Protection Impact Assessment: Required for processing likely to result
in high risk, including large-scale processing of special categories or systematic monitoring.

Article 37 - Data Protection Officer: Mandatory for public authorities, organisations
processing special categories at large scale, or organisations monitoring individuals at scale.

Article 44-49 - International transfers: Personal data may only be transferred to third
countries with adequate protection, appropriate safeguards (SCCs, BCRs), or specific derogations.

Article 83 - Penalties:
- Up to EUR 10,000,000 or 2% global annual turnover for infringements of processor obligations,
  technical measures, breach notification, DPO, and certification requirements.
- Up to EUR 20,000,000 or 4% global annual turnover for infringements of basic principles,
  consent conditions, data subject rights, and international transfer rules.

AFFECTED DOMAINS: Data Protection, Privacy, Information Security, HR Systems,
Marketing, Customer Data Management, IT Infrastructure, Legal, Compliance.

COMPLIANCE DEADLINE: Already in force since 25 May 2018.
"""
    },
    "EU_AI_ACT": {
        "regulation_key": "EU_AI_ACT",
        "celex": "32024R1689",
        "name": "EU Artificial Intelligence Act",
        "max_penalty_eur": 35000000,
        "max_penalty_pct": 7.0,
        "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689",
        "raw_text": """REGULATION (EU) 2024/1689 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL
of 13 June 2024 laying down harmonised rules on artificial intelligence (AI Act).

KEY OBLIGATIONS:
Article 5 - Prohibited AI practices: Subliminal manipulation, exploitation of vulnerabilities,
social scoring by public authorities, real-time remote biometric identification in public spaces
(with narrow exceptions), emotion recognition in workplace/education, biometric categorisation
inferring sensitive attributes.

Article 9 - Risk management: High-risk AI systems must implement a risk management system
covering identification/analysis of risks, estimation and evaluation, adoption of risk measures.

Article 10 - Data governance: Training, validation, and testing data must meet quality criteria,
be relevant, representative, free of errors, and complete. Examine for biases.

Article 13 - Transparency: High-risk AI systems must be transparent, enabling deployers to
interpret and use outputs appropriately. Instructions for use must be provided.

Article 14 - Human oversight: High-risk AI systems must allow effective human oversight.
Natural persons must be able to understand capabilities, monitor operation, intervene or interrupt.

Article 16 - Obligations of providers: Register high-risk AI in EU database, affix CE marking,
draw up technical documentation, keep logs, ensure conformity assessment.

Article 43 - Conformity assessment: High-risk AI systems must undergo conformity assessment
before market placement. Some require third-party assessment.

Article 72 - Penalties for prohibited AI: Up to EUR 35,000,000 or 7% of global annual turnover.
Article 73 - Penalties for high-risk non-compliance: Up to EUR 15,000,000 or 3% of turnover.
Article 74 - Penalties for incorrect information: Up to EUR 7,500,000 or 1% of turnover.

AFFECTED DOMAINS: AI Development, Product Management, Legal, Compliance, HR Systems,
Customer Service AI, Recruitment AI, Credit Scoring, Biometric Systems.

COMPLIANCE DEADLINE: Prohibited practices banned from 2 February 2025. High-risk AI
obligations apply from 2 August 2026. General-purpose AI model rules from 2 August 2025.
"""
    },
    "DORA": {
        "regulation_key": "DORA",
        "celex": "32022R2554",
        "name": "Digital Operational Resilience Act",
        "max_penalty_eur": 10000000,
        "max_penalty_pct": 2.0,
        "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554",
        "raw_text": """REGULATION (EU) 2022/2554 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL
of 14 December 2022 on digital operational resilience for the financial sector (DORA).

KEY OBLIGATIONS:
Article 5-16 - ICT Risk Management: Financial entities must implement a comprehensive ICT
risk management framework. Identify, classify, and document all ICT assets and functions.
Establish protection, detection, response, and recovery capabilities.

Article 17-23 - ICT Incident Management: Classify and report ICT-related incidents.
Major incidents must be reported to competent authorities. Notify clients affected by
major incidents. Submit initial, intermediate, and final reports.

Article 24-27 - Digital Operational Resilience Testing: Conduct basic testing annually.
Advanced threat-led penetration testing (TLPT) every 3 years for significant entities.
Test results must be shared with authorities upon request.

Article 28-44 - Third-Party Risk: Manage ICT third-party risk. Maintain register of
all ICT third-party service providers. Contracts must include specific provisions on
security, audit rights, exit strategies, data location.

Article 29 - Critical ICT third-party providers designated by ESAs are subject to
direct oversight framework.

Article 45-56 - Information Sharing: Financial entities may share cyber threat information
and intelligence with each other. Participate in information sharing arrangements.

Article 30 - Key contractual provisions: Service level agreements, security requirements,
audit and inspection rights, termination rights, data portability and deletion.

Penalties: Member states set penalties. Industry guidance suggests up to EUR 10,000,000
or 2% of total annual worldwide turnover for non-compliance.

AFFECTED DOMAINS: IT Operations, Information Security, Risk Management, Vendor Management,
Business Continuity, Financial Services, Audit, Compliance, Legal.

COMPLIANCE DEADLINE: Applies from 17 January 2025. All financial entities in EU must comply.
"""
    }
}


def fetch_regulation(regulation_key: str) -> dict | None:
    if regulation_key not in REGULATIONS:
        print(f"[Regulations] Unknown key: {regulation_key}")
        return None
    reg = REGULATIONS[regulation_key]
    print(f"[Regulations] Loaded {reg['name']} — {len(reg['raw_text'])} chars")
    return reg


def list_available_regulations() -> list:
    return [{"key": k, "name": v["name"], "celex": v["celex"]} for k, v in REGULATIONS.items()]


# --- Additional regulations: MiCA, NIS2, AML ---
REGULATIONS["MICA"] = {
    "regulation_key": "MICA",
    "celex": "32023R1114",
    "name": "Markets in Crypto-Assets Regulation",
    "max_penalty_eur": 5000000,
    "max_penalty_pct": 3.0,
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114",
    "raw_text": """REGULATION (EU) 2023/1114 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 31 May 2023 on markets in crypto-assets (MiCA).

KEY OBLIGATIONS:
Title II - Crypto-asset white papers: Offerors and persons seeking admission to trading must publish a fair, clear and non-misleading white paper, notified to the competent authority before publication.
Title III/IV - Asset-referenced tokens (ARTs) and e-money tokens (EMTs): Issuers must be authorised, maintain adequate reserves of assets, and meet own-funds and redemption-at-par requirements.
Title V - Crypto-Asset Service Providers (CASPs): Must be authorised, meet prudential safeguards, segregate and safeguard client crypto-assets and funds, and maintain governance, conflict-of-interest and complaint-handling procedures.
Title VI - Market abuse: Prohibits insider dealing, unlawful disclosure of inside information, and market manipulation in crypto-assets.

PENALTIES (legal persons): For general infringements, administrative fines up to the higher of EUR 5,000,000 or 3% of total annual turnover. For market-abuse breaches, up to the higher of EUR 15,000,000 or 15% of total annual turnover.

AFFECTED DOMAINS: Crypto-Asset Services, Custody and Safeguarding, Treasury, Compliance, Market Surveillance, Consumer Protection, Legal, Finance.

COMPLIANCE DEADLINE: Applies from 30 December 2024 (CASP provisions); national transitional arrangements end 1 July 2026.
"""
}
REGULATIONS["NIS2"] = {
    "regulation_key": "NIS2",
    "celex": "32022L2555",
    "name": "Network and Information Security Directive 2 (NIS2)",
    "max_penalty_eur": 10000000,
    "max_penalty_pct": 2.0,
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555",
    "raw_text": """DIRECTIVE (EU) 2022/2555 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 14 December 2022 on measures for a high common level of cybersecurity across the Union (NIS2 Directive).

KEY OBLIGATIONS:
Article 20 - Governance: Management bodies must approve and oversee cybersecurity risk-management measures and can be held personally liable for non-compliance.
Article 21 - Risk-management measures: Implement appropriate technical, operational and organisational measures, including risk analysis, incident handling, business continuity and backups, supply-chain security, vulnerability handling, encryption, and access control.
Article 23 - Incident reporting: Submit an early warning to the CSIRT or competent authority within 24 hours of a significant incident, a full notification within 72 hours, and a final report within one month.
Article 24-25 - Use of EU certification schemes and standardised security approaches.

PENALTIES: Essential entities face administrative fines up to the higher of EUR 10,000,000 or 2% of total worldwide annual turnover. Important entities up to the higher of EUR 7,000,000 or 1.4%.

AFFECTED DOMAINS: Information Security, IT Operations, Incident Response, Business Continuity, Supply-Chain and Vendor Management, Governance, Risk, Compliance.

COMPLIANCE DEADLINE: Member State transposition deadline was 17 October 2024; measures apply from 18 October 2024.
"""
}
REGULATIONS["AML"] = {
    "regulation_key": "AML",
    "celex": "32024R1624",
    "name": "Anti-Money Laundering Regulation (AMLR)",
    "max_penalty_eur": 5000000,
    "max_penalty_pct": 10.0,
    "source_url": "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1624",
    "raw_text": """REGULATION (EU) 2024/1624 OF THE EUROPEAN PARLIAMENT AND OF THE COUNCIL of 31 May 2024 on the prevention of the use of the financial system for money laundering or terrorist financing (Anti-Money Laundering Regulation, AMLR), part of the EU AML package alongside Directive (EU) 2024/1640 (AMLD6).

KEY OBLIGATIONS:
Customer due diligence (CDD): Identify and verify customers and their beneficial owners, and conduct ongoing monitoring of the business relationship.
Enhanced due diligence: Apply stronger measures in higher-risk situations, including certain third countries and politically exposed persons.
Beneficial ownership: Determine and keep up to date the ultimate beneficial owners and report to central registers.
Suspicious activity: Detect and report suspicious transactions to the Financial Intelligence Unit and retain records.
Internal controls: Maintain AML/CFT policies, a compliance function, and staff training. Cash payments above EUR 10,000 are prohibited.

PENALTIES: For serious, repeated or systematic breaches by legal persons, maximum administrative pecuniary sanctions up to the higher of EUR 5,000,000 or 10% of total annual turnover.

AFFECTED DOMAINS: KYC and Onboarding, Transaction Monitoring, Financial Crime Compliance, Beneficial Ownership, Regulatory Reporting, Audit, Legal, Risk.

COMPLIANCE DEADLINE: AMLR applies from 10 July 2027; AMLD6 to be transposed by Member States by 10 July 2027.
"""
}
