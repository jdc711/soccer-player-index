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

def addLeaguesAsOwnArray():
    #For each club document, create a new field called _league_ids, 
    #where the field is an array of objectids retrieved by traversing 
    # each object in "leagues"
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    club_collection = db["club"]
    
    # Iterate through each document in the club collection
    for club in club_collection.find():
        # Extract _league_ids from each club's leagues array
        _league_ids = []
        for league in club.get('leagues', []):
            if league == []:
                # print("club: ", club["name"], " league: ", league["name"])
                continue
            # print("league: ", league)
            if "_league_id" not in league: continue
            _league_ids.append(league["_league_id"])
        # print("club: ", club["name"], " league_ids: ", _league_ids)
        # # Update the document with the new _league_ids field
        club_collection.update_one(
            {'_id': club['_id']},
            {'$set': {'_league_ids': _league_ids}}
        )

def addClubsAsOwnArray():
    #For each club document, create a new field called _league_ids, 
    #where the field is an array of objectids retrieved by traversing 
    # each object in "leagues"
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    player_collection = db["player"]
    
    # Iterate through each document in the club collection
    for player in player_collection.find():
        # Extract _league_ids from each club's leagues array
        _club_ids = []
        for club in player.get('club-history', []):
            if club == []:
                # print("club: ", club["name"], " league: ", league["name"])
                continue
            # print("league: ", league)
            if "_club_id" not in club: continue
            _club_ids.append(club["_club_id"])
        # print("club: ", club["name"], " league_ids: ", _league_ids)
        # # Update the document with the new _league_ids field
        player_collection.update_one(
            {'_id': player['_id']},
            {'$set': {'_club_ids': _club_ids}}
        )

addClubsAsOwnArray()