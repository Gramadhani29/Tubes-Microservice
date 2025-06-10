import requests
from config import KEMAHASISWAAN_API_URL, LOGISTIK_API_URL

def get_event(event_id):
    url = f"{KEMAHASISWAAN_API_URL}/event/{event_id}"
    response = requests.get(url)
    return response.json()

def get_room(room_id):
    url = f"{LOGISTIK_API_URL}/room/{room_id}"
    response = requests.get(url)
    return response.json() 