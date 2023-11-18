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
    "UNL": "UEFA Nations League",
    "USC": "UEFA Super Cup",
    "BSA": "Brazilian Serie A",
    "NE": "Eliteserien",
    "PLN": "Liga Portugal",
    "EC": "English Championship",
    "IEU": "UEFA European Championship U21",
    "ACoN": "Africa Cup of Nations",
    "ICC": "FIFA Confederations Cup",
    "WCQ": "World Cup Qualifiers"
}

def team_abbreviation_to_name_map(name):
    if name == "Man City":
        return "Manchester City"
    elif name == "Man Utd":
        return "Manchester United"
    elif name == "Bayern":
        return "Bayern Munich"
    elif name == "PSG":
        return "Paris Saint-Germain"
    elif name == "Atletico":
        return "Atletico Madrid"
    else:
        return name

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

def replaceSpecialLetters(name):
    for i in range(len(name)):
        if name[i] == 'é':
            name = name[:i] + 'e' + name[i+1:]
        elif name[i] == 'ë':
            name = name[:i] + 'e' + name[i+1:]
        elif name[i] == 'á':
            name = name[:i] + 'a' + name[i+1:]
        elif name[i] == 'à':
            name = name[:i] + 'a' + name[i+1:]
        elif name[i] == 'ã':
            name = name[:i] + 'a' + name[i+1:]
        elif name[i] == 'ú':
            name = name[:i] + 'u' + name[i+1:]
        elif name[i] == 'ü':
            name = name[:i] + 'u' + name[i+1:]
        elif name[i] == 'í':
            name = name[:i] + 'i' + name[i+1:]
        elif name[i] == 'Ø':
            name = name[:i] + 'O' + name[i+1:]
        elif name[i] == 'Á':
            name = name[:i] + 'A' + name[i+1:]
    return name
        
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
            player_profile["name"] = replaceSpecialLetters(player_profile["name"])

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
        
        
        if "shirt-number" not in player_profile:
            player_profile["shirt-number"] = -1
            
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
                season_stats["club"] = " ".join(words[1:]) 
            else:
                season_stats["club"] = " ".join(words[1:])  
                season_stats["club"] = team_abbreviation_to_name_map(season_stats["club"])
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

def scrape_player_page(link):
    options = Options()
    options.add_argument("--headless")

    options.headless = True
    options.add_argument(USER_AGENT)
    service = Service(CHROME_DRIVER_PATH)
    service.start()

    driver = webdriver.Chrome(service=service, options=options)
    driver.delete_all_cookies()  # Clear cookies before navigating to the site
    driver.command_executor.set_timeout(20)
    
    try:
        driver.get(link)
        wait = WebDriverWait(driver, 20)
        player_profile_scraped = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="layout-wrapper"]/div[3]/div[1]/div[1]/div[2]/div[2]'))
        )      
        stats_table_scraped = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="top-player-stats-summary-grid"]'))
        )
        player_image_url = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="layout-wrapper"]/div[3]/div[1]/div[1]/div[2]/div[1]/img'))
        )     
        current_club_image_url = wait.until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="layout-wrapper"]/div[3]/div[1]/div[1]/h1/img'))
        )   
        
        player_profile = parse_player_profile_text(player_profile_scraped.text)
        player_stats = parse_player_stats_text(stats_table_scraped.text, player_profile)

        return player_profile, player_stats, player_image_url.get_attribute('src'), current_club_image_url.get_attribute('src') 
    except Exception as e:
        print("An error occurred:", e)
        driver.quit()

    finally:
        driver.quit()

links = [
# "https://www.whoscored.com/Players/136741/History/Bernardo-Silva",
# "https://www.whoscored.com/Players/11119/History/Lionel-Messi",
# "https://www.whoscored.com/Players/50835/History/Neymar",
# "https://www.whoscored.com/Players/2302/History/Xavi",
# "https://www.whoscored.com/Players/5/History/Thierry-Henry",
# "https://www.whoscored.com/Players/29400/History/Robert-Lewandowski",
# "https://www.whoscored.com/Players/315227/History/Erling-Haaland",
# "https://www.whoscored.com/Players/20874/History/Luka-Modric",
# "https://www.whoscored.com/Players/73084/History/Kevin-De-Bruyne",
# "https://www.whoscored.com/Players/5583/History/Cristiano-Ronaldo",
# "https://www.whoscored.com/Players/9486/History/Andrés-Iniesta",
# "https://www.whoscored.com/Players/83532/History/Harry-Kane",
# "https://www.whoscored.com/Players/91909/History/Son-Heung-Min",
# "https://www.whoscored.com/Players/108226/History/Mohamed-Salah",
# "https://www.whoscored.com/Players/300713/History/Kylian-Mbappé",
# "https://www.whoscored.com/Players/14296/History/Karim-Benzema",
# "https://www.whoscored.com/Players/73798/History/Thibaut-Courtois",
# "https://www.whoscored.com/Players/123761/History/Bruno-Fernandes",
# "https://www.whoscored.com/Players/31772/History/Toni-Kroos",
# "https://www.whoscored.com/Players/44721/History/Sergio-Busquets",
# "https://www.whoscored.com/Players/44288/History/Jordi-Alba",
# "https://www.whoscored.com/Players/22221/History/Luis-Suárez",
# "https://www.whoscored.com/Players/9909/History/Sergio-Ramos",
# "https://www.whoscored.com/Players/33404/History/Eden-Hazard",
# "https://www.whoscored.com/Players/2776/History/Iker-Casillas",
# "https://www.whoscored.com/Players/2579/History/Andrea-Pirlo",
# "https://www.whoscored.com/Players/48/History/Frank-Lampard",
# "https://www.whoscored.com/Players/4384/History/Didier-Drogba",
# "https://www.whoscored.com/Players/17/History/Steven-Gerrard",
# "https://www.whoscored.com/Players/298510/History/Victor-Osimhen",
# "https://www.whoscored.com/Players/313171/History/Rúben-Dias",
# "https://www.whoscored.com/Players/95408/History/Virgil-van-Dijk",
# "https://www.whoscored.com/Players/247454/History/Martin-Ødegaard",
# "https://www.whoscored.com/Players/80774/History/Marc-André-ter-Stegen",
# "https://www.whoscored.com/Players/379868/History/Jude-Bellingham",
# "https://www.whoscored.com/Players/337782/History/Vinícius-Júnior",
# "https://www.whoscored.com/Players/303139/History/Rodri",
# "https://www.whoscored.com/Players/88526/History/Casemiro",
# "https://www.whoscored.com/Players/367185/History/Bukayo-Saka",
# "https://www.whoscored.com/Players/80241/History/Antoine-Griezmann",
# "https://www.whoscored.com/Players/402197/History/Pedri",
# "https://www.whoscored.com/Players/344644/History/Federico-Valverde",
# "https://www.whoscored.com/Players/395252/History/Jamal-Musiala",
# "https://www.whoscored.com/Players/3859/History/Wayne-Rooney",
# "https://www.whoscored.com/Players/299513/History/Ousmane-Dembélé",
# "https://www.whoscored.com/Players/114075/History/N-Golo-Kanté",
# "https://www.whoscored.com/Players/9016/History/Franck-Ribéry",
# "https://www.whoscored.com/Players/4173/History/Arjen-Robben",
# "https://www.whoscored.com/Players/23110/History/Ángel-Di-María",
# "https://www.whoscored.com/Players/37099/History/Thomas-Müller",
# "https://www.whoscored.com/Players/5780/History/Dani-Alves",
# "https://www.whoscored.com/Players/20241/History/Marcelo",
# "https://www.whoscored.com/Players/347862/History/Rodrygo",
# "https://www.whoscored.com/Players/93206/History/Raphaël-Varane",
# "https://www.whoscored.com/Players/28550/History/Thiago-Silva",
# "https://www.whoscored.com/Players/377168/History/Luis-Díaz",
# "https://www.whoscored.com/Players/8040/History/Cesc-Fàbregas",
# "https://www.whoscored.com/Players/109915/History/Sadio-Mané",
# "https://www.whoscored.com/Players/1320/History/Carles-Puyol",
"https://www.whoscored.com/Players/12712/History/Gerard-Piqué",
"https://www.whoscored.com/Players/6319/History/David-Villa",
"https://www.whoscored.com/Players/320834/History/Achraf-Hakimi",
"https://www.whoscored.com/Players/102248/History/Emiliano-Martínez",
"https://www.whoscored.com/Players/369430/History/Enzo-Fernández",
"https://www.whoscored.com/Players/349207/History/Rafael-Leão",
"https://www.whoscored.com/Players/331254/History/Phil-Foden",
"https://www.whoscored.com/Players/395252/History/Jamal-Musiala",
"https://www.whoscored.com/Players/24444/History/Olivier-Giroud",
"https://www.whoscored.com/Players/402664/History/Josko-Gvardiol",
"https://www.whoscored.com/Players/365409/History/Julián-Álvarez",
"https://www.whoscored.com/Players/300945/History/Christopher-Nkunku",
"https://www.whoscored.com/Players/114147/History/Alisson-Becker",
"https://www.whoscored.com/Players/128967/History/João-Cancelo",
"https://www.whoscored.com/Players/422937/History/Gavi",
"https://www.whoscored.com/Players/370984/History/Khvicha-Kvaratskhelia",
"https://www.whoscored.com/Players/283323/History/Joshua-Kimmich",
"https://www.whoscored.com/Players/39722/History/David-Alaba",
"https://www.whoscored.com/Players/136220/History/Yassine-Bounou",
"https://www.whoscored.com/Players/353423/History/Aurélien-Tchouaméni",
"https://www.whoscored.com/Players/303115/History/Théo-Hernández",
"https://www.whoscored.com/Players/345319/History/Alexis-Mac-Allister",
"https://www.whoscored.com/Players/125547/History/Rodrigo-De-Paul",
"https://www.whoscored.com/Players/77464/History/Ilkay-Gündogan",
"https://www.whoscored.com/Players/104749/History/Riyad-Mahrez"
]

def add_club_to_db(club_name, league_name, nationality, club_img_url):
    # adds club and its corresponding league to db
    # if club doesnt exist in db, create new club document
    # if league doesnt exist in db, create new league document
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    club_collection = db['club']
    league_collection = db['league'] 
    league_document = league_collection.find_one({"name":league_name})
    if league_document == None:
        league_collection.insert_one(
            {
                "name":league_name,
                "location": "TBD"
            },  
        )
        league_document = league_collection.find_one({"name":league_name})
    
    
    club_collection.update_one(
        {"name": club_name},  # Query to find the document
        {
            "$set": {
                "image-url": club_img_url,
                "is-club": (nationality != club_name)
            },
            "$addToSet": {
                "leagues": 
                    {
                        "name": league_document["name"],
                        "_league_id": league_document["_id"]        
                    } 
            }
        }, 
        upsert=True  # Create a new document if one doesn't exist
    )
    
    
    

def add_clubs_to_db(club_to_leagues, current_club, current_club_img_url, nationality):
    # takes a dictionary of club name --> list of leagues
    # for each club in dictionary:
        # if club does not exist in db, then add club to db along with the leagues it participates in
        # if club already exists in db, then add any missing leagues to the db
    
    for club_name in club_to_leagues:
        for league_name in club_to_leagues[club_name]:
            if club_name == current_club:
                add_club_to_db(club_name, league_name, nationality, current_club_img_url)
            else:
                add_club_to_db(club_name, league_name, nationality, "")
            
            
def add_player_to_db(player_profile, clubs, player_img_url):
    # MongoDB connection setup
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    player_collection = db['player'] 
    club_collection = db['club'] 
    club_document = club_collection.find_one({"name": player_profile["current-club"]})
    player_document = player_collection.find_one({"name": player_profile["name"]})
    if player_document == None:
        if player_profile["current-club"] != "N/A":
        
            player_collection.insert_one({
                "_current_club_id": club_document["_id"],
                "name": player_profile["name"],
                "age": player_profile["age"],
                "nationality": player_profile["nationality"],
                "positions": player_profile["positions"],
                "age": player_profile["age"],
                "age": player_profile["age"],
                "age": player_profile["age"],
                "current-club": player_profile["current-club"],
                "shirt-number": player_profile["shirt-number"],
                "club-history": clubs,
                "image-url": player_img_url
            })  
        else:
            player_collection.insert_one({
                # "_current_club_id": "N/A",
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
        player_document = player_collection.find_one({"name": player_profile["name"]})
    return player_document["_id"]
    
def add_player_season_to_db(player_profile, season_stats):
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    player_stats_collection = db['player-stats'] 
    club_collection = db['club'] 
    league_collection = db['league'] 
    player_collection = db['player'] 

    league_document = league_collection.find_one({"name": season_stats["league"]})
        
    if league_document == None:
        league_collection.insert_one(
            {
                "name":season_stats["league"],
                "location": "TBD"
            },  
        )
        league_document = league_collection.find_one({"name":season_stats["league"]})
            
    club_document = club_collection.find_one({"name": season_stats["club"]})
    if club_document == None:
        add_club_to_db(season_stats["club"], season_stats["league"], player_profile["Nationality"], "")
        club_document = club_collection.find_one({"name": season_stats["club"]})
        
    player_document = player_collection.find_one({"name": player_profile["name"]})
    if player_document == None:
        add_player_to_db(player_profile, [], "")
        player_document = player_collection.find_one({"name": player_profile["name"]})
    
    player_id = player_document["_id"]
    
    player_stats_document = player_stats_collection.find_one({
            "name": player_profile["name"],
            "club": season_stats["club"],
            "season": season_stats["season"],
            "league": season_stats["league"]
    })
    if player_stats_document == None:
        if club_document == None:
            player_stats_collection.insert_one({
                "_player_id": player_id,
                "_club_id": "N/A",
                "_league_id": league_document["_id"],
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
            
        else:
            player_stats_collection.insert_one({
                "_player_id": player_id,
                "_club_id": club_document["_id"],
                "_league_id": league_document["_id"],
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
    

def add_player_seasons_to_db(player_profile, player_stats):
    for season_stats in player_stats:
        add_player_season_to_db(player_profile,season_stats)
            
def add_club_to_db2(club, current_club_img_url, nationality):
    if club== "N/A": return
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    club_collection = db['club']
    club_document = club_collection.find_one({"name":club})
    if club_document == None:
        club_collection.update_one(
            {"name": club},  # Query to find the document
            {
                "$set": {
                    "image-url": current_club_img_url,
                    "is-club": (nationality != club)
                },
                "$addToSet": {
                    "leagues": 
                        {
                      
                        } 
                }
            },
            # Operation to add league if not exists
            upsert=True  # Create a new document if one doesn't exist
        )
    
def add_league_to_club(club,league):
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    club_collection = db['club'] 
    league_collection = db['league'] 
    league_document = league_collection.find_one({"name": league})
    if league_document == None:
        print("Could not find league ", league)
    club_document = club_collection.find_one({"name":club})
    if club_document == None:
        print("Could not find club ", club)
    print("club before: ", club_document)
    club_collection.update_one(
        {"name": club},  # Query to find the document
        {
            "$addToSet": {
                "leagues": 
                    {
                        "name": league_document["name"],
                        "_league_id": league_document["_id"]        
                    } 
            }
        },
    )
    club_document = club_collection.find_one({"name":club})
    print("club after: ", club_document)
    
    

for link in links:
    player_profile, player_stats, player_img_url, current_club_img_url = scrape_player_page(link)
    print("here1")
    club_to_leagues = find_leagues_per_club(player_stats)
    print("here2")

    add_clubs_to_db(club_to_leagues, player_profile["current-club"], current_club_img_url, player_profile["nationality"]) 
    print("here3")

    clubs = []
    for club in club_to_leagues:
        clubs.append(club)
    add_club_to_db2(player_profile["current-club"], current_club_img_url, player_profile["nationality"])
    print("here4")

    add_player_to_db(player_profile, clubs, player_img_url)
    add_player_seasons_to_db(player_profile, player_stats)
    print("finished adding ", player_profile["name"])
    print("here5")