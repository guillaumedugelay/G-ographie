"""Génère js/monde.js à partir de world-atlas (Natural Earth 1:110m, licence ISC)
et i18n-iso-countries (codes ISO, licence MIT).

Usage : python3 outils/carte.py <countries-110m.json> <codes.json> <langs/fr.json> > js/monde.js
Chaque pays : code ISO à deux lettres (ou null s'il n'en a pas), nom français et contours en [lon,lat,...].
"""
import json, sys

topo = json.load(open(sys.argv[1]))
codes = {c[2]: c[0] for c in json.load(open(sys.argv[2]))}   # numérique -> alpha-2
noms = json.load(open(sys.argv[3]))["countries"]                 # alpha-2 -> nom français
nom = lambda c: (noms.get(c)[0] if isinstance(noms.get(c), list) else noms.get(c)) if c else None
sx, sy = topo["transform"]["scale"]
tx, ty = topo["transform"]["translate"]

# Arcs : coordonnées quantifiées et codées en différences
arcs = []
for arc in topo["arcs"]:
    x = y = 0
    pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sx + tx, y * sy + ty))
    arcs.append(pts)

def ring(idx):
    out = []
    for i in idx:
        pts = arcs[i] if i >= 0 else arcs[~i][::-1]
        out.extend(pts if not out else pts[1:])
    return out

pays = []
for g in topo["objects"]["countries"]["geometries"]:
    if g.get("type") is None:
        continue
    polys = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
    rings = []
    for poly in polys:
        for r in poly:
            pts = ring(r)
            # Contours qui traversent l'antiméridien (Russie, Fidji) : longitudes rendues continues
            # (ex. 179 puis 181 au lieu de 179 puis -179), pour éviter une fausse ligne à travers la carte
            flat, prev = [], None
            for lon, lat in pts:
                if prev is not None:
                    while lon - prev > 180: lon -= 360
                    while lon - prev < -180: lon += 360
                prev = lon
                flat += [round(lon, 2), round(lat, 2)]
            rings.append(flat)
    code = codes.get(g.get("id"))
    if g.get("id") == "010":          # Antarctique : pas dessiné
        continue
    pays.append([code, nom(code) or g.get("properties", {}).get("name"), rings])

print("// Généré par outils/carte.py — Natural Earth 1:110m via world-atlas (ISC), noms et codes ISO via i18n-iso-countries (MIT). Ne pas modifier à la main.")
print("export const MONDE=" + json.dumps(pays, separators=(",", ":")) + ";")
