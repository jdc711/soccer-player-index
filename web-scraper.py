from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from time import sleep
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Use environment variables
CHROME_DRIVER_PATH = os.getenv('CHROME_DRIVER_PATH')
USER_AGENT = os.getenv('USER_AGENT')

def parse_player_profile_text(player_profile_text):
    player_profile = {}
    # Split the text into lines
    lines = player_profile_text.strip().splitlines()

    # Process each line
    for line in lines:
        # Split the line into words
        words = line.split()
    
        first_word = words[0]
        if first_word == "Name:":
            player_profile["name"] = " ".join(words[1:])
        elif first_word == "Full":
            continue
        elif first_word == "Current":
            if len(words) == 2:
                player_profile["current-team"] = "N/A"
            else:
                player_profile["current-team"] = " ".join(words[2:])
        elif first_word == "Shirt":
            player_profile["shirt-number"] = int(words[2])
        elif first_word == "Age:":
            player_profile["age"] = int(words[1])
        elif first_word == "Height:":
            player_profile["height-cm"] = int(words[1][:-2])
        elif first_word == "Nationality:":
            player_profile["nationality"] = " ".join(words[1:])
        elif first_word == "Positions:":
            player_profile["positions"] = " ".join(words[1:])
            
    return player_profile

def get_player_stats(link):
    options = Options()
    options.headless = False
    options.add_argument(USER_AGENT)
    service = Service(CHROME_DRIVER_PATH)
    service.start()

    driver = webdriver.Chrome(service=service, options=options)
    driver.delete_all_cookies()  # Clear cookies before navigating to the site
    driver.command_executor.set_timeout(10)
    
    try:
        driver.get(link)
        wait = WebDriverWait(driver, 10)
        player_profile_scraped = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="layout-wrapper"]/div[3]/div[1]/div[1]/div[2]/div[2]'))
        )      
        stats_table_scraped = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="top-player-stats-summary-grid"]'))
        )
        
        player_profile = parse_player_profile_text(player_profile_scraped.text)
        print("player_profile: ", player_profile)

    except Exception as e:
        print("An error occurred:", e)
        driver.quit()

    finally:
        driver.quit()


    

links = [
"https://www.whoscored.com/Players/50835/History/Neymar",
"https://www.whoscored.com/Players/2302/History/Xavi",
"https://www.whoscored.com/Players/5/History/Thierry-Henry",
"https://www.whoscored.com/Players/29400/History/Robert-Lewandowski",
"https://www.whoscored.com/Players/315227/History/Erling-Haaland"
"https://www.whoscored.com/Players/20874/History/Luka-Modric",
"https://www.whoscored.com/Players/73084/History/Kevin-De-Bruyne",
"https://www.whoscored.com/Players/5583/History/Cristiano-Ronaldo",
"https://www.whoscored.com/Players/9486/History/Andrés-Iniesta",
"https://www.whoscored.com/Players/83532/History/Harry-Kane",
"https://www.whoscored.com/Players/91909/History/Son-Heung-Min",
"https://www.whoscored.com/Players/108226/History/Mohamed-Salah",
"https://www.whoscored.com/Players/300713/History/Kylian-Mbappé",
"https://www.whoscored.com/Players/14296/History/Karim-Benzema",
"https://www.whoscored.com/Players/73798/History/Thibaut-Courtois",
"https://www.whoscored.com/Players/123761/History/Bruno-Fernandes",
"https://www.whoscored.com/Players/136741/History/Bernardo-Silva",
"https://www.whoscored.com/Players/31772/History/Toni-Kroos",
"https://www.whoscored.com/Players/44721/History/Sergio-Busquets",
"https://www.whoscored.com/Players/44288/History/Jordi-Alba",
"https://www.whoscored.com/Players/22221/History/Luis-Suárez",
"https://www.whoscored.com/Players/9909/History/Sergio-Ramos",
]


get_player_stats(links[0])
get_player_stats(links[1])
get_player_stats(links[2])










# def get_player_names():
#     # scrape https://www.futbin.com/players to retrieve list of player names
#     #repTb > tbody > tr:nth-child(2) > td.table-row-text.row > div.d-inline.pt-2.pl-3 > div:nth-child(1) > a
    
#     player_names = []
#     return player_names

# def get_player_stats(name):
#     options = Options()
#     options.headless = False
#     options.add_argument("user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36")
#     service = Service('/Users/dongwoo/Desktop/personal-projects/soccer-player-index/chromedriver-mac-x64/chromedriver',  log_path='/Users/dongwoo/Desktop/personal-projects/soccer-player-index/chromedriver.log')
#     service.start()
    
    
#     driver = webdriver.Chrome(service=service, options=options)
#     driver.delete_all_cookies()  # Clear cookies before navigating to the site
#     driver.command_executor.set_timeout(10)

#     try:
#         print("herestart")
#         driver.get('https://www.whoscored.com')
#         print("here0")
        
#         waitForAd = WebDriverWait(driver, 10)
#         ad_close_button = waitForAd.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[7]/div/div[1]/button')))
#         ad_close_button.click()

#         search_box = driver.find_element(By.XPATH, '//*[@id="search-box"]')
#         search_box.send_keys(name)
#         search_button = driver.find_element(By.XPATH, '//*[@id="search-button"]')
#         search_button.click()

#         print("here1")
#         wait = WebDriverWait(driver, 10)
#         # Click the player link on the search result page
#         player_link = wait.until(
#             EC.element_to_be_clickable((By.XPATH, '//*[@id="layout-wrapper"]/div[3]/div[1]/div/table/tbody/tr[2]/td[1]/a'))
#         )
#         player_link.click()
        
        
#         print("here2")


#         # Click the link on the player profile page to navigate to the stats
#         stats_link = wait.until(
#             EC.element_to_be_clickable((By.XPATH, '//*[@id="sub-navigation"]/ul/li[4]/a'))
#         )
#         stats_link.click()

#         print("here3")

#         # Ensure the stats table is present
#         stats_table = wait.until(
#             EC.presence_of_element_located((By.XPATH, '//*[@id="top-player-stats-summary-grid"]'))
#         )

#         print("here4")

#         # Now you can extract information from the stats table
#         # For example, to print out the table text:
#         print(stats_table.text)

#         # Or to return the table element for further processing outside the function
#         return stats_table

#     except Exception as e:
#         print("An error occurred:", e)
#     finally:
#         driver.quit()
# player_stats_table = get_player_stats("Lionel Messi")

