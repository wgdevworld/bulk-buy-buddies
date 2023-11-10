# Import the necessary libraries
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

BASE_URL = "https://www.costco.com/WarehouseListByStateDisplayView"


def scrape_store_details(driver):
    details = {}

    # Scraping Address
    address_elem = driver.find_element(By.CSS_SELECTOR, "span[itemprop='streetAddress']")
    locality_elem = driver.find_element(By.CSS_SELECTOR, "span[itemprop='addressLocality']")
    region_elem = driver.find_element(By.CSS_SELECTOR, "span[itemprop='addressRegion']")
    postal_code_elem = driver.find_element(By.CSS_SELECTOR, "span[itemprop='postalCode']")
    details["Address"] = f"{address_elem.text}, {locality_elem.text}, {region_elem.text} {postal_code_elem.text}"

    # Scraping Hours of Operation
    hours_elems = driver.find_elements(By.CSS_SELECTOR, "div.core > time[itemprop='openingHours']")
    hours = [hour.text.strip() for hour in hours_elems]
    details["Hours"] = hours

    return details


def scrape_costco_locations():
    print("Selenium version:", webdriver.__version__)

    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920x1080")

    driver_path = ChromeDriverManager().install()
    service = Service(driver_path)
    driver = webdriver.Chrome(service=service, options=options)

    driver.get(BASE_URL)

    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.accordion-panel-group")))

    states = driver.find_elements_by_css_selector("div.h6-style-guide-warehouse-title")
    store_details = []

    for state in states:
        state_name = state.text.split(' ')[0]
        state.click()
        time.sleep(1)

        stores = driver.find_elements_by_css_selector("div.warehouse-warehouse-item")
        for store in stores:
            details = {}
            details["State"] = state_name
            details["Store Name"] = store.find_element(By.CSS_SELECTOR, "div.location-name").text

            # Find the "Store Details" link and click it using JavaScript
            store_link_elem = store.find_element(By.CSS_SELECTOR, "div.warehouse-details > a:nth-child(2)")
            driver.execute_script("arguments[0].click();", store_link_elem)

            # Wait for the store details page to load
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, "span[itemprop='streetAddress']")))

            details.update(scrape_store_details(driver))

            # Go back to the previous page (the state's page)
            driver.back()

            store_details.append(details)

        state.click()

    driver.quit()
    return store_details


if __name__ == "__main__":
    locations = scrape_costco_locations()
    for location in locations:
        print(location)
