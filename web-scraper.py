from collections import defaultdict
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
import pprint
import pymongo
# Load environment variables from .env file
load_dotenv()

# Use environment variables
CHROME_DRIVER_PATH = os.getenv('CHROME_DRIVER_PATH')
USER_AGENT = os.getenv('USER_AGENT')
MONGODB_CONNECTION_STRING = os.getenv('MONGODB_CONNECTION_STRING')

league_abbreviation_to_name_map = {
    'FL1': "Ligue 1",
    'SLL': "LaLiga",
    'UCL': "UEFA Champions League",
    'UEL': "UEFA Europa League",
    'WC': "FIFA World Cup",
    'ICA': "Copa America",
    'GB': "Bundesliga",
    # 'UEC': "UEFA European Championship",
    'EPL': "Premier League",
    'ISA': "Serie A",
    'UMLS': "Major League Soccer",
    'EFLC': "Carabao Cup",
    "ECS": "Community Shield",
    "UNL": "UEFA Nations League"
}

def league_abbreviation_to_name(abbr, season):
    if abbr == "UEC":
        if season == "2008" or season == "2012" or season == "2016" or season == "2020" or season == "2024" or season == "2028":
            return "UEFA European Championship"
        else:
            return "UEFA European Championship Qualifiers"
    else:
        if abbr not in league_abbreviation_to_name_map:
            return None
        return league_abbreviation_to_name_map[abbr]



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
                player_profile["current-club"] = "N/A"
            else:
                player_profile["current-club"] = " ".join(words[2:])
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
    
def parse_player_stats_text(player_stats_text, player_profile):
    player_stats = []
    season_and_club = True
    season_stats = {}
    
    lines = player_stats_text.strip().splitlines()
    for line in lines[3:]:
        words = line.split()
        if season_and_club:
            season_stats["season"] = words[0]
            if player_profile["nationality"] == words[1]:
                season_stats["club"] = "N/A"
            else:
                season_stats["club"] = " ".join(words[1:])  
        else:
            league = league_abbreviation_to_name(words[0], season_stats["season"])
            if league:
                season_stats["league"] = league
            else:
                season_stats["league"] = words[0]
            season_stats["appearances"] = words[1]
            # season_stats["minutes"] = words[2]
            season_stats["goals"] = words[3]
            season_stats["assists"] = words[4]
            season_stats["yellow-cards"] = words[5]
            season_stats["red-cards"] = words[6]
            # season_stats["shot-per-game"] = words[7]
            # season_stats["pass-success-percentage"] = words[8]
            # season_stats["ariel-duels-won"] = words[9]
            season_stats["man-of-the-matches"] = words[10]
            season_stats["average-match-rating"] = words[11]                
        season_and_club = not season_and_club
        if season_and_club == True:
            player_stats.append(season_stats.copy())
            season_stats.clear()
        
    return player_stats

def find_leagues_per_club(player_stats):
    club_to_leagues = defaultdict(set)
    for season_stats in player_stats:
        if season_stats["club"] != "N/A":
            club_to_leagues[season_stats["club"]].add(season_stats["league"])
    return club_to_leagues

def scrape_player_stats(link):
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
        player_stats = parse_player_stats_text(stats_table_scraped.text, player_profile)

        return player_profile, player_stats
    except Exception as e:
        print("An error occurred:", e)
        driver.quit()

    finally:
        driver.quit()

links = [
"https://www.whoscored.com/Players/11119/History/Lionel-Messi",
"https://www.whoscored.com/Players/50835/History/Neymar",
"https://www.whoscored.com/Players/2302/History/Xavi",
"https://www.whoscored.com/Players/5/History/Thierry-Henry",
"https://www.whoscored.com/Players/29400/History/Robert-Lewandowski",
"https://www.whoscored.com/Players/315227/History/Erling-Haaland",
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


def update_club_db(club_to_leagues):
    # takes a dictionary of club name --> list of leagues
    # for each club in dictionary:
        # if club does not exist in db, then add club to db along with the leagues it participates in
        # if club already exists in db, then add any missing leagues to the db
    
    # MongoDB connection setup
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    club_collection = db['club']  
    for club in club_to_leagues:
        for league in club_to_leagues[club]:
            club_collection.update_one(
                {"name": club},  # Query to find the document
                {"$addToSet": {"leagues": league}},  # Operation to add league if not exists
                upsert=True  # Create a new document if one doesn't exist
            )
            
def add_player_to_db(player_profile, clubs):
    # MongoDB connection setup
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    player_collection = db['player'] 
    player_document = player_collection.find_one({"name": player_profile["name"]})
    if player_document == None:
        player_collection.insert_one({
            "name": player_profile["name"],
            "age": player_profile["age"],
            "nationality": player_profile["nationality"],
            "positions": player_profile["positions"],
            "age": player_profile["age"],
            "age": player_profile["age"],
            "age": player_profile["age"],
            "current-club": player_profile["current-club"],
            "shirt-number": player_profile["shirt-number"],
            "club-history": clubs
        })  

def add_player_season_to_db(player_profile, player_stats):
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    player_stats_collection = db['player-stats'] 
    for season_stats in player_stats:
        player_stats_document = player_stats_collection.find_one({
            "name": player_profile["name"],
            "club": season_stats["club"],
            "season": season_stats["season"],
            "league": season_stats["league"]
        })
        if player_stats_document == None:
            player_stats_collection.insert_one({
                "name": player_profile["name"],
                "club": season_stats["club"],
                "season": season_stats["season"],
                "league": season_stats["league"],
                "appearances": season_stats["appearances"],
                "goals": season_stats["goals"],
                "assists": season_stats["assists"],
                "yellow-cards": season_stats["yellow-cards"],
                "red-cards": season_stats["red-cards"],
                "man-of-the-matches": season_stats["man-of-the-matches"],
                "average-match-rating": season_stats["average-match-rating"],
            })
    
for link in links:
    player_profile, player_stats = scrape_player_stats(link)
    club_to_leagues = find_leagues_per_club(player_stats)
    update_club_db(club_to_leagues) 
    clubs = []
    for club in club_to_leagues:
        clubs.append(club)
    add_player_to_db(player_profile, clubs)
    add_player_season_to_db(player_profile, player_stats)
    


