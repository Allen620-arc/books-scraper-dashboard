import requests
from bs4 import BeautifulSoup

# Target URL
url = "http://books.toscrape.com/"

# Step 1: Download the page
response = requests.get(url)
html = response.text

# Step 2: Parse the HTML with BeautifulSoup
soup = BeautifulSoup(html, "html.parser")

# Step 3: Find all book titles on the page
books = soup.find_all("h3")

print("Books on the homepage:\n")

# Step 4: Print each book title
for book in books:
    title = book.a["title"]
    print("-", title)
