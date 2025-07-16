import requests
from bs4 import BeautifulSoup
import csv

base_url = "http://books.toscrape.com/catalogue/page-{}.html"
total_pages = 50  # Scrape all 50 pages

# Open CSV file to write
with open("books-to-scrape/books_data.csv", "w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)
    writer.writerow(["Title", "Price", "Availability"])  # Header row

    for page in range(1, total_pages + 1):
        print(f"📄 Scraping page {page}...")

        url = base_url.format(page)
        response = requests.get(url)
        if response.status_code != 200:
            print(f"❌ Failed to fetch page {page}")
            continue

        soup = BeautifulSoup(response.text, "html.parser")

        # Each book is inside an article tag
        books = soup.find_all("article", class_="product_pod")

        for book in books:
            title = book.h3.a["title"]

            price = book.find("p", class_="price_color").text.strip()
            availability = book.find("p", class_="instock availability").text.strip()

            writer.writerow([title, price, availability])
            print(f"✔️  {title} | {price} | {availability}")
