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

def clearCollection(collection_name):
    client = pymongo.MongoClient(MONGODB_CONNECTION_STRING)
    db = client['soccer-player-index']  
    collection = db[collection_name]
    
    collection.delete_many({})

clearCollection("club")
clearCollection("player")
clearCollection("player-stats")