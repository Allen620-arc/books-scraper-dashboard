import requests
from bs4 import BeautifulSoup

base_url = "http://books.toscrape.com/catalogue/page-{}.html"

# Number of pages to scrape (site has 50 total)
total_pages = 50

for page in range(1, total_pages + 1):
    print(f"\n🔎 Scraping page {page}...")

    # Build full URL
    url = base_url.format(page)

    # Request the page
    response = requests.get(url)
    if response.status_code != 200:
        print(f"❌ Failed to fetch page {page}")
        continue

    # Parse the HTML
    soup = BeautifulSoup(response.text, "html.parser")

    # Extract all book titles
    books = soup.find_all("h3")

    for book in books:
        title = book.a["title"]
        print("-", title)
