import httpx
import re
from typing import Optional

EDGAR_BASE = "https://data.sec.gov/submissions"
EDGAR_SEARCH = "https://efts.sec.gov/LATEST/search-index"
EDGAR_FULL_TEXT = "https://efts.sec.gov/LATEST/search-index?q={query}&dateRange=custom&startdt={start}&enddt={end}&forms=10-K"

HEADERS = {
    "User-Agent": "SynapseFleet compliance-research@synapsefleet.ai",
    "Accept": "application/json"
}

TEST_COMPANIES = {
    "MICROSOFT": "0000789019",
    "GOOGLE": "0001652044",
    "META": "0001326801",
    "APPLE": "0000320193",
    "AMAZON": "0001018724"
}


def get_company_filings(cik: str, form_type: str = "10-K", count: int = 1) -> Optional[dict]:
    """
    Fetches a company's latest SEC filings by CIK number.
    CIK is the company's unique SEC identifier.
    """
    cik_padded = cik.zfill(10)
    url = f"{EDGAR_BASE}/CIK{cik_padded}.json"

    print(f"[EDGAR] Fetching filings for CIK {cik}...")

    try:
        response = httpx.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        data = response.json()

        company_name = data.get("name", "Unknown")
        filings = data.get("filings", {}).get("recent", {})

        form_types = filings.get("form", [])
        accession_numbers = filings.get("accessionNumber", [])
        filing_dates = filings.get("filingDate", [])
        primary_docs = filings.get("primaryDocument", [])

        results = []
        for i, ft in enumerate(form_types):
            if ft == form_type and len(results) < count:
                accession = accession_numbers[i].replace("-", "")
                doc = primary_docs[i]
                filing_url = f"https://www.sec.gov/Archives/edgar/full-index/{accession[:4]}/{accession[4:6]}/{accession[6:8]}/{accession_numbers[i]}/{doc}"

                results.append({
                    "form_type": ft,
                    "filing_date": filing_dates[i],
                    "accession_number": accession_numbers[i],
                    "document_url": f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type={form_type}&dateb=&owner=include&count=10"
                })

        print(f"[EDGAR] Found {len(results)} {form_type} filing(s) for {company_name}")

        return {
            "company_name": company_name,
            "cik": cik,
            "filings": results
        }

    except httpx.HTTPError as e:
        print(f"[EDGAR] HTTP error: {e}")
        return None
    except Exception as e:
        print(f"[EDGAR] Unexpected error: {e}")
        return None


def fetch_company_risk_disclosures(cik: str, max_chars: int = 6000) -> Optional[dict]:
    """
    Fetches and extracts the risk/compliance section from a company's latest 10-K.
    This is what Exposure Analyzer will scan for compliance gaps.
    """
    filings_data = get_company_filings(cik, form_type="10-K", count=1)
    if not filings_data or not filings_data["filings"]:
        print(f"[EDGAR] No 10-K found for CIK {cik}")
        return None

    company_name = filings_data["company_name"]
    accession = filings_data["filings"][0]["accession_number"]
    filing_date = filings_data["filings"][0]["filing_date"]

    accession_path = accession.replace("-", "")
    index_url = f"https://www.sec.gov/Archives/edgar/data/{cik}/{accession_path}/{accession}-index.htm"

    print(f"[EDGAR] Fetching 10-K document for {company_name}...")

    try:
        index_response = httpx.get(index_url, headers=HEADERS, timeout=30, follow_redirects=True)
        index_text = index_response.text

        doc_links = re.findall(r'href="(/Archives/edgar/data/[^"]+\.htm)"', index_text)
        ten_k_url = None
        for link in doc_links:
            if "10k" in link.lower() or "10-k" in link.lower() or "annual" in link.lower():
                ten_k_url = f"https://www.sec.gov{link}"
                break

        if not ten_k_url and doc_links:
            ten_k_url = f"https://www.sec.gov{doc_links[0]}"

        if not ten_k_url:
            print(f"[EDGAR] Could not locate 10-K document for {company_name}")
            return {
                "company_name": company_name,
                "cik": cik,
                "filing_date": filing_date,
                "risk_text": f"10-K filed on {filing_date}. Document parsing unavailable — use SEC EDGAR directly at https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type=10-K",
                "source": index_url
            }

        doc_response = httpx.get(ten_k_url, headers=HEADERS, timeout=30, follow_redirects=True)
        raw_text = re.sub(r"<[^>]+>", " ", doc_response.text)
        raw_text = re.sub(r"\s+", " ", raw_text).strip()

        risk_start = raw_text.lower().find("risk factor")
        if risk_start == -1:
            risk_start = raw_text.lower().find("privacy")
        if risk_start == -1:
            risk_start = 0

        risk_text = raw_text[risk_start:risk_start + max_chars]

        print(f"[EDGAR] Successfully extracted {len(risk_text)} characters from {company_name} 10-K")

        return {
            "company_name": company_name,
            "cik": cik,
            "filing_date": filing_date,
            "risk_text": risk_text,
            "source": ten_k_url
        }

    except Exception as e:
        print(f"[EDGAR] Error fetching document: {e}")
        return {
            "company_name": company_name,
            "cik": cik,
            "filing_date": filing_date,
            "risk_text": "Document extraction failed — company filing metadata retrieved successfully.",
            "source": index_url
        }


def list_test_companies() -> list:
    return [{"name": k, "cik": v} for k, v in TEST_COMPANIES.items()]


if __name__ == "__main__":
    print("Available test companies:")
    for c in list_test_companies():
        print(f"  {c['name']} — CIK {c['cik']}")

    print("\nTesting EDGAR fetch with Microsoft...")
    result = fetch_company_risk_disclosures(TEST_COMPANIES["MICROSOFT"])
    if result:
        print(f"\nCompany: {result['company_name']}")
        print(f"CIK: {result['cik']}")
        print(f"Filing date: {result['filing_date']}")
        print(f"Risk text preview: {result['risk_text'][:300]}...")
    else:
        print("Failed to fetch company data.")
