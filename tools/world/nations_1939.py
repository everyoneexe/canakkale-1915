"""1938/39 egemenlik ve İkinci Dünya Savaşı tarafları.

Sınır kaynağı `world_1938.geojson` (aourednik/historical-basemaps). Ad alanı
sömürgeleri "Algeria (France)" gibi parantezle veriyor; aşağıdaki tablo
bunları egemen güce bağlar.

Taraf ve katılma tarihleri:
  https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates
  https://en.wikipedia.org/wiki/Participants_in_World_War_II
"""
from __future__ import annotations

UK = "United Kingdom"
USSR = "USSR"

SOVEREIGN_FIX: dict[str, str] = {
    # ── Britanya İmparatorluğu ──
    "British Raj": UK,
    "India": UK,
    "Ceylon": UK,
    "British Somaliland": UK,
    "Gold Coast": UK,
    "Nigeria": UK,
    "Kenya": UK,
    "Uganda": UK,
    "Sudan": UK,
    "Northern Rhodesia": UK,
    "Southern Rhodesia": UK,
    "Malawi": UK,
    "Botswana": UK,
    "Lesotho": UK,
    "Swaziland": UK,
    "Gambia, The": UK,
    "Sierra Leone": UK,
    "Malaysia": UK,
    "Brunei": UK,
    "Hong Kong": UK,
    "Mandatory Palestine (GB)": UK,
    "Mesopotamia (GB)": UK,
    "Jordan": UK,
    "Egypt": UK,
    "Cyprus": UK,
    "Guyana": UK,
    "Belize": UK,
    "Jamaica": UK,
    "Trinidad": UK,
    "Bahamas": UK,
    "Yemen (UK)": UK,
    "Oman (British Raj)": UK,
    "Fiji": UK,
    "Gilbert and Ellice Islands": UK,
    "Tonga": UK,
    "Walbis Bay": "Union of South Africa",
    "Tanzania, United Republic of": UK,  # Tanganyika mandası
    # ── Fransız İmparatorluğu ──
    "Algeria (France)": "France",
    "Morocco (France)": "France",
    "Tunisia": "France",
    "French West Africa": "France",
    "French Equatorial Africa": "France",
    "French Cameroons": "France",
    "French Indo-China": "France",
    "French Somaliland": "France",
    "French Guiana": "France",
    "Madagascar (France)": "France",
    "Syria (France)": "France",
    "Congo (France)": "France",
    "Cochin China": "France",
    "Laos": "France",
    "Cambodia": "France",
    "New Caledonia": "France",
    "Togo": "France",
    "Guadeloupe": "France",
    "Martinique": "France",
    # ── İtalyan İmparatorluğu ──
    "Libya": "Italy",
    "Eritrea (Italy)": "Italy",
    "Ethiopia (Italy)": "Italy",
    "Italian Somaliland": "Italy",
    # ── Diğer ──
    "Belgian Congo": "Belgium",
    "Rwanda (Belgium)": "Belgium",
    "Burundi": "Belgium",
    "Angola (Portugal)": "Portugal",
    "Mozambique (Portugal)": "Portugal",
    "Guinea-Bissau": "Portugal",
    "Dutch East Indies": "Netherlands",
    "Netherlands Antilles": "Netherlands",
    "Suriname": "Netherlands",
    "Philippines": "United States",
    "Puerto Rico": "United States",
    "Guam": "United States",
    "American Samoa": "United States",
    "Saipan": "Empire of Japan",
    "Dominion of Newfoundland": UK,
    "Rio De Oro": "Spain",
    "Spanish Sahara": "Spain",
    "Equatorial Guinea": "Spain",
    "Xinjiang": "Chinese warlords",
    "Armenia": USSR,
    "Israel": UK,
}

ALIAS: dict[str, str] = {
    "Great Britain": UK,
    "United Kingdom of Great Britain and Ireland": UK,
    "Soviet Union": USSR,
    "Russia": USSR,
    "Germany": "Germany",
    "Union of South Africa": "Union of South Africa",
    "USA": "United States",
}

# taraf: eksen | muttefik | tarafsiz   ·  joins: savaşa giriş tarihi
FACTION: dict[str, tuple[str, str | None]] = {
    # ── Mihver ─────────────────────────────────────────────────────
    "Germany": ("eksen", None),
    "Italy": ("eksen", "1940-06-10"),
    "Empire of Japan": ("eksen", "1941-12-07"),
    "Hungary": ("eksen", "1940-11-20"),
    "Romania": ("eksen", "1940-11-23"),
    "Bulgaria": ("eksen", "1941-03-01"),
    "Finland": ("eksen", "1941-06-25"),
    # ── Müttefikler ────────────────────────────────────────────────
    UK: ("muttefik", "1939-09-03"),
    "France": ("muttefik", "1939-09-03"),
    "Poland": ("muttefik", None),
    USSR: ("muttefik", "1941-06-22"),
    "United States": ("muttefik", "1941-12-08"),
    "Canada": ("muttefik", "1939-09-10"),
    "Australia": ("muttefik", "1939-09-03"),
    "New Zealand": ("muttefik", "1939-09-03"),
    "Union of South Africa": ("muttefik", "1939-09-06"),
    "Belgium": ("muttefik", "1940-05-10"),
    "Netherlands": ("muttefik", "1940-05-10"),
    "Luxembourg": ("muttefik", "1940-05-10"),
    "Norway": ("muttefik", "1940-04-09"),
    "Denmark": ("muttefik", "1940-04-09"),
    "Greece": ("muttefik", "1940-10-28"),
    "Yugoslavia": ("muttefik", "1941-04-06"),
    "Czechoslovakia": ("muttefik", None),
    "Chinese warlords": ("muttefik", "1941-12-09"),
    "Brazil": ("muttefik", "1942-08-22"),
    "Ethiopia (Italy)": ("muttefik", "1941-01-18"),
    # ── Tarafsızlar ────────────────────────────────────────────────
    "Spain": ("tarafsiz", None),
    "Portugal": ("tarafsiz", None),
    "Switzerland": ("tarafsiz", None),
    "Sweden": ("tarafsiz", None),
    "Ireland": ("tarafsiz", None),
    "Turkey": ("tarafsiz", None),
    "Iran": ("tarafsiz", None),
    "Afghanistan": ("tarafsiz", None),
    "Saudi Arabia": ("tarafsiz", None),
    "Yemen": ("tarafsiz", None),
    "Siam": ("tarafsiz", None),
    "Argentina": ("tarafsiz", None),
    "Chile": ("tarafsiz", None),
    "Mexico": ("tarafsiz", None),
    "Mongolia": ("tarafsiz", None),
    "Tibet": ("tarafsiz", None),
    "Nepal": ("tarafsiz", None),
    "Liberia": ("tarafsiz", None),
    "Estonia": ("tarafsiz", None),
    "Latvia": ("tarafsiz", None),
    "Lithuania": ("tarafsiz", None),
    "Albania": ("tarafsiz", None),
}

DISPLAY_TR: dict[str, str] = {
    "Germany": "Almanya",
    "Italy": "İtalya",
    "Empire of Japan": "Japonya",
    "Hungary": "Macaristan",
    "Romania": "Romanya",
    "Bulgaria": "Bulgaristan",
    "Finland": "Finlandiya",
    UK: "Birleşik Krallık",
    "France": "Fransa",
    "Poland": "Polonya",
    USSR: "Sovyetler Birliği",
    "United States": "Amerika Birleşik Devletleri",
    "Canada": "Kanada",
    "Australia": "Avustralya",
    "New Zealand": "Yeni Zelanda",
    "Union of South Africa": "Güney Afrika Birliği",
    "Belgium": "Belçika",
    "Netherlands": "Hollanda",
    "Norway": "Norveç",
    "Denmark": "Danimarka",
    "Greece": "Yunanistan",
    "Yugoslavia": "Yugoslavya",
    "Czechoslovakia": "Çekoslovakya",
    "Chinese warlords": "Çin",
    "Spain": "İspanya",
    "Portugal": "Portekiz",
    "Switzerland": "İsviçre",
    "Sweden": "İsveç",
    "Ireland": "İrlanda",
    "Turkey": "Türkiye",
    "Iran": "İran",
    "Brazil": "Brezilya",
    "Mexico": "Meksika",
    "Siam": "Siyam",
    "Saudi Arabia": "Suudi Arabistan",
    "Ethiopia (Italy)": "Etiyopya",
}


def sovereign_of(name: str, subjecto: str | None, partof: str | None) -> str:
    raw = SOVEREIGN_FIX.get(name) or subjecto or partof or name
    return ALIAS.get(raw, raw)


def faction_of(sovereign: str) -> tuple[str, str | None]:
    return FACTION.get(sovereign, ("tarafsiz", None))
