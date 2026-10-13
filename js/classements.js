// Données des jeux de classement. Valeurs saisies de mémoire : approximatives.
// minGap : écart minimal entre deux pays d'un même tirage, pour que de petites imprécisions
// ne changent pas le bon ordre. Le classement se fait toujours de la plus grande valeur à la plus petite.
export const flag=code=>[...code].map(c=>String.fromCodePoint(127397+c.charCodeAt(0))).join("");

export const ALTITUDE=[
["NP","Népal",8849],["PK","Pakistan",8611],["IN","Inde",8586],["BT","Bhoutan",7570],["TJ","Tadjikistan",7495],
["AF","Afghanistan",7492],["KG","Kirghizistan",7439],["KZ","Kazakhstan",7010],["AR","Argentine",6961],["CL","Chili",6893],
["PE","Pérou",6768],["BO","Bolivie",6520],["EC","Équateur",6263],["US","États-Unis",6190],["CA","Canada",5959],
["TZ","Tanzanie",5895],["MM","Myanmar",5881],["CO","Colombie",5730],["RU","Russie",5642],["MX","Mexique",5636],
["IR","Iran",5610],["KE","Kenya",5199],["GE","Géorgie",5193],["TR","Turquie",5137],["UG","Ouganda",5109],
["VE","Venezuela",4978],["ID","Indonésie",4884],["FR","France",4806],["IT","Italie",4748],["UZ","Ouzbékistan",4643],
["CH","Suisse",4634],["ET","Éthiopie",4550],["PG","Papouasie-Nouvelle-Guinée",4509],["RW","Rwanda",4507],
["AZ","Azerbaïdjan",4466],["MN","Mongolie",4374],["GT","Guatemala",4220],["MA","Maroc",4167],["MY","Malaisie",4095],
["AM","Arménie",4090],["CM","Cameroun",4040],["TW","Taïwan",3952],["CR","Costa Rica",3820],["AT","Autriche",3798],
["JP","Japon",3776],["NZ","Nouvelle-Zélande",3724],["ES","Espagne",3715],["YE","Yémen",3666],["LS","Lesotho",3482],
["PA","Panama",3475],["ZA","Afrique du Sud",3450],["TD","Tchad",3445],["VN","Vietnam",3143],["TM","Turkménistan",3139],
["DO","République dominicaine",3098],["LB","Liban",3088],["SD","Soudan",3042],["ER","Érythrée",3018],["OM","Oman",3009],
["MW","Malawi",3002],["BR","Brésil",2995],["DE","Allemagne",2962],["PH","Philippines",2954],["BG","Bulgarie",2925],
["GR","Grèce",2918],["DZ","Algérie",2908],["MG","Madagascar",2876],["HN","Honduras",2870],["SI","Slovénie",2864],
["LA","Laos",2819],["SY","Syrie",2814],["AL","Albanie",2764],["KP","Corée du Nord",2744],["SV","Salvador",2730],
["HT","Haïti",2680],["SK","Slovaquie",2655],["EG","Égypte",2629],["AO","Angola",2620],["ZW","Zimbabwe",2592],
["NA","Namibie",2573],["TH","Thaïlande",2565],["RO","Roumanie",2544],["ME","Monténégro",2534],["LK","Sri Lanka",2524],
["PL","Pologne",2499],["NO","Norvège",2469],["MZ","Mozambique",2436],["NG","Nigeria",2419],["SO","Somalie",2416],
["BA","Bosnie-Herzégovine",2386],["PT","Portugal",2351],["ZM","Zambie",2329],["LY","Libye",2267],["JM","Jamaïque",2256],
["AU","Australie",2228],["RS","Serbie",2169],["IS","Islande",2110],["SE","Suède",2097],["NI","Nicaragua",2085],
["UA","Ukraine",2061],["CU","Cuba",1974],["KR","Corée du Sud",1947],["CY","Chypre",1952],["JO","Jordanie",1854],
["HR","Croatie",1831],["KH","Cambodge",1813],["CZ","Tchéquie",1603],["TN","Tunisie",1544],["BW","Botswana",1491],
["GB","Royaume-Uni",1345],["FI","Finlande",1324],["SR","Suriname",1286],["ML","Mali",1155],["IE","Irlande",1039],
["HU","Hongrie",1014],["MR","Mauritanie",915],["GH","Ghana",885],["PY","Paraguay",842],["BE","Belgique",694],
["LU","Luxembourg",560],["UY","Uruguay",514],["MD","Moldavie",430],["BY","Biélorussie",345],["NL","Pays-Bas",322],
["EE","Estonie",318],["LV","Lettonie",312],["LT","Lituanie",294],["MT","Malte",253],["DK","Danemark",171],
["SG","Singapour",164],["QA","Qatar",103]
];

// Indice de perception de la corruption 2023 (Transparency International), sur 100 : plus c'est haut, moins le pays est perçu comme corrompu
const CORRUPTION=[
["DK","Danemark",90],["FI","Finlande",87],["NZ","Nouvelle-Zélande",85],["NO","Norvège",84],["SG","Singapour",83],
["SE","Suède",82],["CH","Suisse",82],["NL","Pays-Bas",79],["DE","Allemagne",78],["LU","Luxembourg",78],
["IE","Irlande",77],["CA","Canada",76],["EE","Estonie",76],["AU","Australie",75],["BE","Belgique",73],
["JP","Japon",73],["UY","Uruguay",73],["IS","Islande",72],["AT","Autriche",71],["FR","France",71],
["GB","Royaume-Uni",71],["US","États-Unis",69],["AE","Émirats arabes unis",68],["BT","Bhoutan",68],["TW","Taïwan",67],
["CL","Chili",66],["KR","Corée du Sud",63],["IL","Israël",62],["PT","Portugal",61],["LT","Lituanie",61],
["ES","Espagne",60],["LV","Lettonie",60],["BW","Botswana",59],["QA","Qatar",58],["CZ","Tchéquie",57],
["IT","Italie",56],["SI","Slovénie",56],["CR","Costa Rica",55],["PL","Pologne",54],["GE","Géorgie",53],
["RW","Rwanda",53],["SA","Arabie saoudite",52],["MY","Malaisie",50],["HR","Croatie",50],["GR","Grèce",49],
["JO","Jordanie",46],["RO","Roumanie",46],["BG","Bulgarie",45],["SN","Sénégal",43],["GH","Ghana",43],
["HU","Hongrie",42],["CN","Chine",42],["CU","Cuba",42],["ZA","Afrique du Sud",41],["VN","Vietnam",41],
["CO","Colombie",40],["TN","Tunisie",40],["IN","Inde",39],["KZ","Kazakhstan",39],["MA","Maroc",38],
["AR","Argentine",37],["BR","Brésil",36],["DZ","Algérie",36],["UA","Ukraine",36],["EG","Égypte",35],
["TH","Thaïlande",35],["TR","Turquie",34],["ID","Indonésie",34],["PH","Philippines",34],["PE","Pérou",33],
["MX","Mexique",31],["KE","Kenya",31],["PK","Pakistan",29],["BO","Bolivie",29],["RU","Russie",26],
["UG","Ouganda",26],["NG","Nigeria",25],["IR","Iran",24],["LB","Liban",24],["BD","Bangladesh",24],
["IQ","Irak",23],["KH","Cambodge",22],["SD","Soudan",22],["AF","Afghanistan",20],["MM","Myanmar",20],
["TD","Tchad",20],["LY","Libye",18],["HT","Haïti",17],["KP","Corée du Nord",17],["NI","Nicaragua",17],
["YE","Yémen",16],["SY","Syrie",13],["VE","Venezuela",13],["SO","Somalie",11]
];

// Classement mondial de la liberté de la presse 2024 (Reporters sans frontières) : rang sur 180, 1 = presse la plus libre.
// Stocké en négatif pour garder « de la plus grande valeur à la plus petite » = du plus libre au moins libre.
const PRESSE=[
["NO","Norvège",1],["DK","Danemark",2],["SE","Suède",3],["NL","Pays-Bas",4],["FI","Finlande",5],
["EE","Estonie",6],["PT","Portugal",7],["IE","Irlande",8],["CH","Suisse",9],["DE","Allemagne",10],
["CA","Canada",14],["NZ","Nouvelle-Zélande",19],["FR","France",21],["GB","Royaume-Uni",23],["TW","Taïwan",27],
["ES","Espagne",30],["AT","Autriche",32],["ZA","Afrique du Sud",38],["AU","Australie",39],["IT","Italie",46],
["PL","Pologne",47],["US","États-Unis",55],["UA","Ukraine",61],["KR","Corée du Sud",62],["AR","Argentine",66],
["HU","Hongrie",67],["JP","Japon",70],["BR","Brésil",82],["TH","Thaïlande",87],["GR","Grèce",88],
["IL","Israël",101],["KE","Kenya",102],["ID","Indonésie",111],["NG","Nigeria",112],["CO","Colombie",119],
["MX","Mexique",121],["MA","Maroc",129],["PH","Philippines",134],["DZ","Algérie",139],["PK","Pakistan",152],
["VE","Venezuela",156],["TR","Turquie",158],["IN","Inde",159],["RU","Russie",162],["SA","Arabie saoudite",166],
["EG","Égypte",170],["CN","Chine",172],["VN","Vietnam",174],["IR","Iran",176],["KP","Corée du Nord",177],
["AF","Afghanistan",178],["SY","Syrie",179],["ER","Érythrée",180]
];

const fr=n=>n.toLocaleString("fr-FR");
export const JEUX={
  altitude:{titre:"Le plus haut sommet",ico:"mountain",
    consigne:"Classe ces 10 pays du plus haut point culminant au plus bas.",haut:"Plus haut",bas:"Plus bas",
    data:ALTITUDE,minGap:40,fmt:v=>fr(v)+" m"},
  corruption:{titre:"Le moins corrompu",ico:"scale",
    consigne:"Classe ces 10 pays du moins corrompu au plus corrompu (indice de perception de la corruption 2023, sur 100).",haut:"Moins corrompu",bas:"Plus corrompu",
    data:CORRUPTION,minGap:3,fmt:v=>v+" / 100"},
  presse:{titre:"La presse la plus libre",ico:"newspaper",
    consigne:"Classe ces 10 pays de la presse la plus libre à la moins libre (classement RSF 2024).",haut:"Plus libre",bas:"Moins libre",
    data:PRESSE.map(([c,n,r])=>[c,n,-r]),minGap:5,fmt:v=>"rang "+(-v)+" / 180"},
};
