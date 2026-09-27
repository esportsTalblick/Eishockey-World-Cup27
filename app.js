/*
 * EISHOCKEY WORLD CUP 27: MANAGER — mobile-first browser edition
 * Replacement file: app.js
 * - 100% touch-oriented navigation
 * - 5 skaters + 1 G
 * - 120 second live match simulation
 * - dynamic transfer marketplace with live listings/auctions
 * - fixtures/friendlies, draft, coaches, sponsors, stadium, finances, stats
 * - local save + JSON export/import
 */
(() => {
  'use strict';

  const APP_KEY = 'hockeyWorldCup27SaveV3';
  const APP_VERSION = '3.0.0';
  const WEEKLY_RESET_KEY = 'hockeyWorldCup27WeeklyResetV1';
  const LEGACY_KEYS = ['hockeyWorldCup27SaveV3','hockeyWorldCup27SaveV2','hockeyWorldCup27SaveV1','streetKingsSaveV15','streetKingsSaveV14','streetKingsSaveV13','streetKingsSaveV12','streetKingsSaveV11','streetKingsSaveV10','streetKingsSaveV9','streetKingsSaveV8','streetKingsSaveV7','streetKingsSaveV6','streetKingsSaveV5','streetKingsSaveV4','streetKingsSaveV3','streetKingsSaveV2','streetKingsSave'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const money = n => new Intl.NumberFormat('de-DE', {style:'currency', currency:'EUR', maximumFractionDigits:0}).format(Math.round(n || 0));
  const dateDE = d => new Date(d).toLocaleDateString('de-DE', {day:'2-digit', month:'2-digit'});
  const timeDE = d => new Date(d).toLocaleTimeString('de-DE', {hour:'2-digit', minute:'2-digit'});
  const clamp = (n,a,b) => Math.max(a, Math.min(b,n));
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const uid = p => `${p}_${Math.random().toString(36).slice(2,10)}`;
  const avg = (arr, fn) => arr.length ? arr.reduce((s,x)=>s+fn(x),0)/arr.length : 0;

  const POSITIONS = ['G','LD','RD','LW','C','RW'];
  const FIRST = ['Alex','Mason','Noah','Liam','Ethan','Oliver','Leo','Finn','Luca','Nico','Mika','Jonas','Elias','Tyler','Jack','Max','Owen','Cole','Logan','Dylan','Milo','Kai','Sam','Ben'];
  const LAST = ['Miller','Johnson','Smith','Wilson','Brown','Davis','Anderson','Thomas','Moore','Martin','Thompson','White','Clark','Lewis','Walker','Hall','Allen','Young','King','Wright','Bennett','Keller','Wagner','Novak'];
  const HAIR = ['black','brown','blond','dark'];
  const SKIN = ['light','tan','dark'];
  const TEAM_COLORS = ['#61d7ff','#e33b4f','#ffffff','#2f7df4','#ffcf40','#39c6a8','#d94bbd','#8c9eff'];
  const WEATHER = [
    {name:'Klare Eisfläche',mult:1.02,icon:'❄',pitch:'Schnelles Eis'},
    {name:'Kühles Hallenklima',mult:1.00,icon:'🏒',pitch:'Normales Eis'},
    {name:'Nasses Wechselklima',mult:0.97,icon:'💧',pitch:'Schweres Eis'},
    {name:'Hohe Hallentemperatur',mult:0.96,icon:'🌡️',pitch:'Langsames Eis'}
  ];
  const SPONSORS = [
    {id:'northstar',name:'NORTHSTAR ICE SPORTS',tier:1,pay:12000,bonus:0.02,accent:'#f4d03f',emoji:'🪵'},
    {id:'nova',name:'ICEFORCE',tier:2,pay:16500,bonus:0.03,accent:'#22c55e',emoji:'🌿'},
    {id:'worldcup',name:'WORLD CUP SPORT',tier:2,pay:18500,bonus:0.035,accent:'#ef4444',emoji:'🏔️'},
    {id:'ksk',name:'WORLD CUP BANK',tier:2,pay:21000,bonus:0.04,accent:'#d71920',emoji:'🏦'},
    {id:'autohaus',name:'POLARIS EQUIPMENT',tier:3,pay:24500,bonus:0.045,accent:'#6fb7ff',emoji:'🚘'},
    {id:'regional',name:'ICE ARENA PARTNERS',tier:3,pay:28000,bonus:0.05,accent:'#f59e0b',emoji:'👑'},
    {id:'kat-1',name:"Aar Bäckerei",tier:1,pay:7750,bonus:0.013,accent:'#22c55e',emoji:"\ud83e\udd68"},
    {id:'kat-2',name:"Einrich Metzgerei",tier:1,pay:8500,bonus:0.013,accent:'#6fb7ff',emoji:"\ud83e\udd69"},
    {id:'kat-3',name:"World Cup Arena Kaffeewerk",tier:1,pay:9250,bonus:0.014,accent:'#f59e0b',emoji:"\u2615"},
    {id:'kat-4',name:"Aar Tal Getränke",tier:1,pay:10000,bonus:0.015,accent:'#be9cff',emoji:"\ud83e\udd64"},
    {id:'kat-5',name:"Lahn & Land Hofladen",tier:1,pay:10750,bonus:0.015,accent:'#f4d03f',emoji:"\ud83c\udf3e"},
    {id:'kat-6',name:"Taunus Fahrradwerk",tier:1,pay:11500,bonus:0.016,accent:'#22c55e',emoji:"\ud83d\udeb2"},
    {id:'kat-7',name:"World Cup Arena Auto Service",tier:1,pay:12250,bonus:0.017,accent:'#6fb7ff',emoji:"\ud83d\ude97"},
    {id:'kat-8',name:"Einrich Reifen",tier:1,pay:13000,bonus:0.017,accent:'#f59e0b',emoji:"\ud83d\udede"},
    {id:'kat-9',name:"Aar Apotheke",tier:1,pay:13750,bonus:0.018,accent:'#be9cff',emoji:"\ud83d\udc8a"},
    {id:'kat-10',name:"Lahn Optik",tier:1,pay:14500,bonus:0.018,accent:'#f4d03f',emoji:"\ud83d\udc53"},
    {id:'kat-11',name:"Taunus Fitness",tier:1,pay:15250,bonus:0.019,accent:'#22c55e',emoji:"\ud83c\udfcb\ufe0f"},
    {id:'kat-12',name:"Einrich Sportswear",tier:1,pay:16000,bonus:0.02,accent:'#6fb7ff',emoji:"\ud83d\udc55"},
    {id:'kat-13',name:"World Cup Arena Fahrschule",tier:1,pay:16750,bonus:0.02,accent:'#f59e0b',emoji:"\ud83d\udea6"},
    {id:'kat-14',name:"Aar Bau & Holz",tier:1,pay:17500,bonus:0.021,accent:'#be9cff',emoji:"\ud83e\udeb5"},
    {id:'kat-15',name:"Lahn Elektro",tier:1,pay:18250,bonus:0.022,accent:'#f4d03f',emoji:"\ud83d\udd0c"},
    {id:'kat-16',name:"Taunus Dach & Wand",tier:1,pay:19000,bonus:0.022,accent:'#22c55e',emoji:"\ud83c\udfe0"},
    {id:'kat-17',name:"Einrich Gartenwelt",tier:1,pay:19750,bonus:0.023,accent:'#6fb7ff',emoji:"\ud83c\udf33"},
    {id:'kat-18',name:"World Cup Arena Blumenhaus",tier:1,pay:20500,bonus:0.024,accent:'#f59e0b',emoji:"\ud83d\udc90"},
    {id:'kat-19',name:"Aar Café am Markt",tier:2,pay:27750,bonus:0.027,accent:'#be9cff',emoji:"\ud83c\udf70"},
    {id:'kat-20',name:"Lahn Pizza",tier:2,pay:28500,bonus:0.028,accent:'#f4d03f',emoji:"\ud83c\udf55"},
    {id:'kat-21',name:"Taunus Grillstube",tier:2,pay:29250,bonus:0.029,accent:'#22c55e',emoji:"\ud83c\udf54"},
    {id:'kat-22',name:"Einrich Eisdiele",tier:2,pay:30000,bonus:0.029,accent:'#6fb7ff',emoji:"\ud83c\udf66"},
    {id:'kat-23',name:"World Cup Arena Buchladen",tier:2,pay:30750,bonus:0.03,accent:'#f59e0b',emoji:"\ud83d\udcda"},
    {id:'kat-24',name:"Aar Computer Service",tier:2,pay:31500,bonus:0.031,accent:'#be9cff',emoji:"\ud83d\udcbb"},
    {id:'kat-25',name:"Lahn Handy Punkt",tier:2,pay:32250,bonus:0.031,accent:'#f4d03f',emoji:"\ud83d\udcf1"},
    {id:'kat-26',name:"Taunus Werkstatt",tier:2,pay:33000,bonus:0.032,accent:'#22c55e',emoji:"\ud83d\udd27"},
    {id:'kat-27',name:"Einrich Schlüsseldienst",tier:2,pay:33750,bonus:0.033,accent:'#6fb7ff',emoji:"\ud83d\udd11"},
    {id:'kat-28',name:"World Cup Arena Reinigung",tier:2,pay:34500,bonus:0.033,accent:'#f59e0b',emoji:"\ud83e\uddfd"},
    {id:'kat-29',name:"Aar Druck & Design",tier:2,pay:35250,bonus:0.034,accent:'#be9cff',emoji:"\ud83d\udda8\ufe0f"},
    {id:'kat-30',name:"Lahn Media",tier:2,pay:36000,bonus:0.035,accent:'#f4d03f',emoji:"\ud83d\udcfa"},
    {id:'kat-31',name:"Taunus Radio",tier:2,pay:36750,bonus:0.035,accent:'#22c55e',emoji:"\ud83d\udcfb"},
    {id:'kat-32',name:"Einrich Eventservice",tier:2,pay:37500,bonus:0.036,accent:'#6fb7ff',emoji:"\ud83c\udfaa"},
    {id:'kat-33',name:"World Cup Arena Taxi",tier:2,pay:38250,bonus:0.036,accent:'#f59e0b',emoji:"\ud83d\ude95"},
    {id:'kat-34',name:"Aar Kurier",tier:2,pay:39000,bonus:0.037,accent:'#be9cff',emoji:"\ud83d\udce6"},
    {id:'kat-35',name:"Lahn Logistik",tier:2,pay:39750,bonus:0.038,accent:'#f4d03f',emoji:"\ud83d\ude9a"},
    {id:'kat-36',name:"Taunus Immobilien",tier:2,pay:40500,bonus:0.038,accent:'#22c55e',emoji:"\ud83c\udfe2"},
    {id:'kat-37',name:"Einrich Versicherung",tier:3,pay:47750,bonus:0.042,accent:'#6fb7ff',emoji:"\ud83d\udee1\ufe0f"},
    {id:'kat-38',name:"World Cup Arena Finanzservice",tier:3,pay:48500,bonus:0.043,accent:'#f59e0b',emoji:"\ud83d\udcb6"},
    {id:'kat-39',name:"Aar Reisebüro",tier:3,pay:49250,bonus:0.043,accent:'#be9cff',emoji:"\u2708\ufe0f"},
    {id:'kat-40',name:"Lahn Hotel",tier:3,pay:50000,bonus:0.044,accent:'#f4d03f',emoji:"\ud83d\udecf\ufe0f"},
    {id:'kat-41',name:"Taunus Camping",tier:3,pay:50750,bonus:0.045,accent:'#22c55e',emoji:"\u26fa"},
    {id:'kat-42',name:"Einrich Tiermarkt",tier:3,pay:51500,bonus:0.045,accent:'#6fb7ff',emoji:"\ud83d\udc3e"},
    {id:'kat-43',name:"World Cup Arena Tierarzt",tier:3,pay:52250,bonus:0.046,accent:'#f59e0b',emoji:"\ud83d\udc15"},
    {id:'kat-44',name:"Aar Fahrrad & Sport",tier:3,pay:53000,bonus:0.047,accent:'#be9cff',emoji:"\u26bd"},
    {id:'kat-45',name:"Lahn Outdoor",tier:3,pay:53750,bonus:0.047,accent:'#f4d03f',emoji:"\ud83e\udd7e"},
    {id:'kat-46',name:"Taunus Holzhandel",tier:3,pay:54500,bonus:0.048,accent:'#22c55e',emoji:"\ud83e\ude9a"},
    {id:'kat-47',name:"Einrich Baustoffe",tier:3,pay:55250,bonus:0.049,accent:'#6fb7ff',emoji:"\ud83e\uddf1"},
    {id:'kat-48',name:"World Cup Arena Markt",tier:3,pay:56000,bonus:0.049,accent:'#f59e0b',emoji:"\ud83d\uded2"},
    {id:'kat-49',name:"Aar Getränkemarkt",tier:3,pay:56750,bonus:0.05,accent:'#be9cff',emoji:"\ud83c\udf7a"},
    {id:'kat-50',name:"Lahn Blech & Metall",tier:3,pay:57500,bonus:0.05,accent:'#f4d03f',emoji:"\u2699\ufe0f"},
    {id:'kat-51',name:"Taunus Druckerei",tier:3,pay:58250,bonus:0.051,accent:'#22c55e',emoji:"\ud83d\udcf0"}
  ];
  const TEAM_NAMES = [
    ['USA','New York','USA','🇺🇸'],['Canada','Toronto','Canada','🇨🇦'],['Germany','Berlin','Deutschland','🇩🇪'],['Croatia','Zagreb','Kroatien','🇭🇷'],
    ['Sweden','Stockholm','Schweden','🇸🇪'],['Finland','Helsinki','Finnland','🇫🇮'],['Switzerland','Bern','Schweiz','🇨🇭'],['Czechia','Prague','Tschechien','🇨🇿'],
    ['Slovakia','Bratislava','Slowakei','🇸🇰'],['Norway','Oslo','Norwegen','🇳🇴'],['Denmark','Copenhagen','Dänemark','🇩🇰'],['France','Paris','Frankreich','🇫🇷'],
    ['Austria','Vienna','Österreich','🇦🇹'],['Slovenia','Ljubljana','Slowenien','🇸🇮'],['Italy','Rome','Italien','🇮🇹'],['Latvia','Riga','Lettland','🇱🇻'],
    ['Kazakhstan','Astana','Kasachstan','🇰🇿'],['Poland','Warsaw','Polen','🇵🇱'],['Hungary','Budapest','Ungarn','🇭🇺'],['Great Britain','London','Großbritannien','🇬🇧'],
    ['Netherlands','Amsterdam','Niederlande','🇳🇱'],['Japan','Tokyo','Japan','🇯🇵'],['South Korea','Seoul','Südkorea','🇰🇷'],['Australia','Melbourne','Australien','🇦🇺']
  ];
const ALL_COUNTRIES = [{"iso":"AF","name":"Afghanistan"},{"iso":"AL","name":"Albanien"},{"iso":"DZ","name":"Algerien"},{"iso":"AS","name":"Amerikanisch-Samoa"},{"iso":"VI","name":"Amerikanische Jungferninseln"},{"iso":"UM","name":"Amerikanische Überseeinseln"},{"iso":"AD","name":"Andorra"},{"iso":"AO","name":"Angola"},{"iso":"AI","name":"Anguilla"},{"iso":"AQ","name":"Antarktis"},{"iso":"AG","name":"Antigua und Barbuda"},{"iso":"AR","name":"Argentinien"},{"iso":"AM","name":"Armenien"},{"iso":"AW","name":"Aruba"},{"iso":"AZ","name":"Aserbaidschan"},{"iso":"AU","name":"Australien"},{"iso":"BS","name":"Bahamas"},{"iso":"BH","name":"Bahrain"},{"iso":"BD","name":"Bangladesch"},{"iso":"BB","name":"Barbados"},{"iso":"BY","name":"Belarus"},{"iso":"BE","name":"Belgien"},{"iso":"BZ","name":"Belize"},{"iso":"BJ","name":"Benin"},{"iso":"BM","name":"Bermuda"},{"iso":"BT","name":"Bhutan"},{"iso":"BO","name":"Bolivien"},{"iso":"BA","name":"Bosnien und Herzegowina"},{"iso":"BW","name":"Botsuana"},{"iso":"BV","name":"Bouvetinsel"},{"iso":"BR","name":"Brasilien"},{"iso":"VG","name":"Britische Jungferninseln"},{"iso":"IO","name":"Britisches Territorium im Indischen Ozean"},{"iso":"BN","name":"Brunei Darussalam"},{"iso":"BG","name":"Bulgarien"},{"iso":"BF","name":"Burkina Faso"},{"iso":"BI","name":"Burundi"},{"iso":"CV","name":"Cabo Verde"},{"iso":"CL","name":"Chile"},{"iso":"CN","name":"China"},{"iso":"CK","name":"Cookinseln"},{"iso":"CR","name":"Costa Rica"},{"iso":"CW","name":"Curaçao"},{"iso":"DE","name":"Deutschland"},{"iso":"DM","name":"Dominica"},{"iso":"DO","name":"Dominikanische Republik"},{"iso":"DJ","name":"Dschibuti"},{"iso":"DK","name":"Dänemark"},{"iso":"EC","name":"Ecuador"},{"iso":"SV","name":"El Salvador"},{"iso":"CI","name":"Elfenbeinküste"},{"iso":"ER","name":"Eritrea"},{"iso":"EE","name":"Estland"},{"iso":"SZ","name":"Eswatini"},{"iso":"FK","name":"Falklandinseln"},{"iso":"FJ","name":"Fidschi"},{"iso":"FI","name":"Finnland"},{"iso":"FR","name":"Frankreich"},{"iso":"GF","name":"Französisch-Guayana"},{"iso":"PF","name":"Französisch-Polynesien"},{"iso":"TF","name":"Französische Süd- und Antarktisgebiete"},{"iso":"FO","name":"Färöer"},{"iso":"GA","name":"Gabun"},{"iso":"GM","name":"Gambia"},{"iso":"GE","name":"Georgien"},{"iso":"GH","name":"Ghana"},{"iso":"GI","name":"Gibraltar"},{"iso":"GD","name":"Grenada"},{"iso":"GR","name":"Griechenland"},{"iso":"GB","name":"Großbritannien"},{"iso":"GL","name":"Grönland"},{"iso":"GP","name":"Guadeloupe"},{"iso":"GU","name":"Guam"},{"iso":"GT","name":"Guatemala"},{"iso":"GG","name":"Guernsey"},{"iso":"GN","name":"Guinea"},{"iso":"GW","name":"Guinea-Bissau"},{"iso":"GY","name":"Guyana"},{"iso":"HT","name":"Haiti"},{"iso":"HM","name":"Heard und McDonaldinseln"},{"iso":"HN","name":"Honduras"},{"iso":"HK","name":"Hongkong"},{"iso":"IN","name":"Indien"},{"iso":"ID","name":"Indonesien"},{"iso":"IQ","name":"Irak"},{"iso":"IR","name":"Iran"},{"iso":"IE","name":"Irland"},{"iso":"IS","name":"Island"},{"iso":"IM","name":"Isle of Man"},{"iso":"IL","name":"Israel"},{"iso":"IT","name":"Italien"},{"iso":"JM","name":"Jamaika"},{"iso":"JP","name":"Japan"},{"iso":"YE","name":"Jemen"},{"iso":"JE","name":"Jersey"},{"iso":"JO","name":"Jordanien"},{"iso":"KY","name":"Kaimaninseln"},{"iso":"KH","name":"Kambodscha"},{"iso":"CM","name":"Kamerun"},{"iso":"CA","name":"Kanada"},{"iso":"BQ","name":"Karibische Niederlande"},{"iso":"KZ","name":"Kasachstan"},{"iso":"QA","name":"Katar"},{"iso":"KE","name":"Kenia"},{"iso":"KG","name":"Kirgisistan"},{"iso":"KI","name":"Kiribati"},{"iso":"CC","name":"Kokosinseln"},{"iso":"CO","name":"Kolumbien"},{"iso":"KM","name":"Komoren"},{"iso":"CG","name":"Kongo-Brazzaville"},{"iso":"CD","name":"Kongo-Kinshasa"},{"iso":"HR","name":"Kroatien"},{"iso":"CU","name":"Kuba"},{"iso":"KW","name":"Kuwait"},{"iso":"LA","name":"Laos"},{"iso":"LS","name":"Lesotho"},{"iso":"LV","name":"Lettland"},{"iso":"LB","name":"Libanon"},{"iso":"LR","name":"Liberia"},{"iso":"LY","name":"Libyen"},{"iso":"LI","name":"Liechtenstein"},{"iso":"LT","name":"Litauen"},{"iso":"LU","name":"Luxemburg"},{"iso":"MG","name":"Madagaskar"},{"iso":"MW","name":"Malawi"},{"iso":"MY","name":"Malaysia"},{"iso":"MV","name":"Malediven"},{"iso":"ML","name":"Mali"},{"iso":"MT","name":"Malta"},{"iso":"MA","name":"Marokko"},{"iso":"MH","name":"Marshallinseln"},{"iso":"MQ","name":"Martinique"},{"iso":"MR","name":"Mauretanien"},{"iso":"MU","name":"Mauritius"},{"iso":"YT","name":"Mayotte"},{"iso":"MX","name":"Mexiko"},{"iso":"FM","name":"Mikronesien"},{"iso":"MD","name":"Moldau"},{"iso":"MC","name":"Monaco"},{"iso":"MN","name":"Mongolei"},{"iso":"ME","name":"Montenegro"},{"iso":"MS","name":"Montserrat"},{"iso":"MZ","name":"Mosambik"},{"iso":"MM","name":"Myanmar"},{"iso":"NA","name":"Namibia"},{"iso":"NR","name":"Nauru"},{"iso":"NP","name":"Nepal"},{"iso":"NC","name":"Neukaledonien"},{"iso":"NZ","name":"Neuseeland"},{"iso":"NI","name":"Nicaragua"},{"iso":"NL","name":"Niederlande"},{"iso":"NE","name":"Niger"},{"iso":"NG","name":"Nigeria"},{"iso":"NU","name":"Niue"},{"iso":"KP","name":"Nordkorea"},{"iso":"MK","name":"Nordmazedonien"},{"iso":"NF","name":"Norfolkinsel"},{"iso":"NO","name":"Norwegen"},{"iso":"MP","name":"Nördliche Marianen"},{"iso":"OM","name":"Oman"},{"iso":"PK","name":"Pakistan"},{"iso":"PW","name":"Palau"},{"iso":"PS","name":"Palästinensische Autonomiegebiete"},{"iso":"PA","name":"Panama"},{"iso":"PG","name":"Papua-Neuguinea"},{"iso":"PY","name":"Paraguay"},{"iso":"PE","name":"Peru"},{"iso":"PH","name":"Philippinen"},{"iso":"PN","name":"Pitcairninseln"},{"iso":"PL","name":"Polen"},{"iso":"PT","name":"Portugal"},{"iso":"PR","name":"Puerto Rico"},{"iso":"RW","name":"Ruanda"},{"iso":"RO","name":"Rumänien"},{"iso":"RU","name":"Russland"},{"iso":"RE","name":"Réunion"},{"iso":"SB","name":"Salomonen"},{"iso":"ZM","name":"Sambia"},{"iso":"WS","name":"Samoa"},{"iso":"SM","name":"San Marino"},{"iso":"SA","name":"Saudi-Arabien"},{"iso":"SE","name":"Schweden"},{"iso":"CH","name":"Schweiz"},{"iso":"SN","name":"Senegal"},{"iso":"RS","name":"Serbien"},{"iso":"SC","name":"Seychellen"},{"iso":"SL","name":"Sierra Leone"},{"iso":"ZW","name":"Simbabwe"},{"iso":"SG","name":"Singapur"},{"iso":"SX","name":"Sint Maarten"},{"iso":"SK","name":"Slowakei"},{"iso":"SI","name":"Slowenien"},{"iso":"SO","name":"Somalia"},{"iso":"MO","name":"Sonderverwaltungsregion Macau"},{"iso":"ES","name":"Spanien"},{"iso":"SJ","name":"Spitzbergen und Jan Mayen"},{"iso":"LK","name":"Sri Lanka"},{"iso":"BL","name":"St. Barthélemy"},{"iso":"SH","name":"St. Helena"},{"iso":"KN","name":"St. Kitts und Nevis"},{"iso":"LC","name":"St. Lucia"},{"iso":"MF","name":"St. Martin"},{"iso":"PM","name":"St. Pierre und Miquelon"},{"iso":"VC","name":"St. Vincent und die Grenadinen"},{"iso":"SD","name":"Sudan"},{"iso":"SR","name":"Suriname"},{"iso":"SY","name":"Syrien"},{"iso":"ST","name":"São Tomé und Príncipe"},{"iso":"ZA","name":"Südafrika"},{"iso":"GS","name":"Südgeorgien und die Südlichen Sandwichinseln"},{"iso":"KR","name":"Südkorea"},{"iso":"SS","name":"Südsudan"},{"iso":"TJ","name":"Tadschikistan"},{"iso":"TW","name":"Taiwan"},{"iso":"TZ","name":"Tansania"},{"iso":"TH","name":"Thailand"},{"iso":"TL","name":"Timor-Leste"},{"iso":"TG","name":"Togo"},{"iso":"TK","name":"Tokelau"},{"iso":"TO","name":"Tonga"},{"iso":"TT","name":"Trinidad und Tobago"},{"iso":"TD","name":"Tschad"},{"iso":"CZ","name":"Tschechien"},{"iso":"TN","name":"Tunesien"},{"iso":"TM","name":"Turkmenistan"},{"iso":"TC","name":"Turks- und Caicosinseln"},{"iso":"TV","name":"Tuvalu"},{"iso":"TR","name":"Türkei"},{"iso":"US","name":"USA"},{"iso":"UG","name":"Uganda"},{"iso":"UA","name":"Ukraine"},{"iso":"HU","name":"Ungarn"},{"iso":"UY","name":"Uruguay"},{"iso":"UZ","name":"Usbekistan"},{"iso":"VU","name":"Vanuatu"},{"iso":"VA","name":"Vatikanstadt"},{"iso":"VE","name":"Venezuela"},{"iso":"AE","name":"Vereinigte Arabische Emirate"},{"iso":"VN","name":"Vietnam"},{"iso":"WF","name":"Wallis und Futuna"},{"iso":"CX","name":"Weihnachtsinsel"},{"iso":"EH","name":"Westsahara"},{"iso":"CF","name":"Zentralafrikanische Republik"},{"iso":"CY","name":"Zypern"},{"iso":"EG","name":"Ägypten"},{"iso":"GQ","name":"Äquatorialguinea"},{"iso":"ET","name":"Äthiopien"},{"iso":"AX","name":"Ålandinseln"},{"iso":"AT","name":"Österreich"}];
const COUNTRY_QUALITY = {"CA":90,"US":88,"SE":86,"FI":85,"RU":84,"CZ":84,"CH":80,"SK":79,"DE":79,"UA":68,"BY":69,"LV":74,"DK":73,"NO":72,"KZ":72,"FR":70,"AT":70,"GB":69,"PL":68,"SI":67,"HR":67,"IT":66,"AU":66,"NL":65,"JP":65,"KR":64,"HU":64,"RO":63,"EE":62,"LT":61};
const EXTRA_NAME_POOLS = {"Afghanistan":[["Breanna","Denise","Randy","Kevin","Brooke","Cindy"],["Frazier","Willis","Patel","Garrison","Olson","Warner"]],"Albanien":[["Timothy","Charles","Richard","Carol","Caitlyn","Jason"],["Martinez","Long","Gonzalez","Hill","Jackson","Zuniga"]],"Algerien":[["Elizabeth","Evan","Samuel","Wesley","Nancy","William"],["Green","Banks","Moore","Bradford","Phillips","Davidson"]],"Amerikanisch-Samoa":[["Tyler","Isabella","Todd","Scott","Tina","Kaitlyn"],["Scott","Brown","Valdez","Martinez","Carter","Mclaughlin"]],"Amerikanische Jungferninseln":[["Margaret","Thomas","Elizabeth","Paul","Michelle"],["Powell","Reed","Harrison","Lara","Williams","Wise"]],"Amerikanische Überseeinseln":[["Robin","Amy","Jennifer","Chelsea","Jared","Bobby"],["King","Barker","Caldwell","Foster","Clay","Farley"]],"Andorra":[["Jason","Jose","Stephanie","Jeremiah","Robert","Bonnie"],["Sanchez","Mendoza","Bailey","Griffin","Hancock","Patterson"]],"Angola":[["Michael","Derek","Emma","Jose","Helen","Alexandria"],["Ball","Williams","Romero","Rodriguez","Holland","Miller"]],"Anguilla":[["Nicholas","Kendra","Daniel","Samuel","Bryan","Aaron"],["Ellison","Maynard","Foster","Raymond","Hanna","Pratt"]],"Antarktis":[["Russell","John","Adam","Molly","David","Patricia"],["Armstrong","Donaldson","Smith","Faulkner","Moore","Norman"]],"Antigua und Barbuda":[["Caitlyn","James","Jennifer","John","Emma","Justin"],["Chambers","Clark","Bryant","Rosales","Hodges","Phillips"]],"Argentinien":[["Lorenzo","Guadalupe","Alma","Santino","Felipe","Maria Luz"],["Ramirez","Escobar","Gutierrez","Perez","Rojas"]],"Armenien":[["Գեղամ","Նինա","Բարբարա","Արշակ","Լիլիթ","Նարինե"],["Ազգալդյան","Մշեցյան","Ճոճկանյան","Ղալթախչյան","Սարոյան","Տաճատյան"]],"Aruba":[["Emily","Stephanie","Warren","Carol","Thomas"],["Orozco","Harris","Butler","Murphy","Clark","Cox"]],"Aserbaidschan":[["Əcəbnaz","Kəmalə","Yadigar","Vüsalə","Qumru","Gülmira"],["Cəfərzadə","Fikrətoğlu","Əsgəroğlu","Əmirli","Sədalı","Vəlizadə"]],"Australien":[["Robert","Sarah","Donald","Rebecca","John","Thomas"],["Clarke","Harrington","Avery","Hernandez","Richardson","Scott"]],"Bahamas":[["Brian","Elizabeth","Beth","Nathan","Rachel","Amber"],["Wallace","Henry","Blackburn","Jordan","Carrillo","Woodard"]],"Bahrain":[["William","Taylor","Kirk","Bradley","Dennis","Anthony"],["Jones","Stewart","Sullivan","Stanley","Hamilton","Martin"]],"Bangladesch":[["Katie","Tiffany","Ruth","Joseph","Jennifer"],["Abbott","Holmes","Moody","Benton","Martin","Perez"]],"Barbados":[["Caitlin","Toni","Nicholas","Ryan","Ricky","Carol"],["Peterson","Weber","Kim","Woods","Higgins","Rios"]],"Belarus":[["Lori","Kevin","Benjamin","Alexandria","Darren","Stacey"],["Gonzales","Cooper","Dixon","Jones","Lee","Baker"]],"Belgien":[["Maurizio","Marc","Tom","Michaël","Francine","Jocelyne"],["Collignon","Georges","Lejeune","Reuter","Duez"]],"Belize":[["Christopher","Alexis","Juan","Marie","Evelyn","Frank"],["Velazquez","Harper","Daniels","Orr","Ramirez","Thompson"]],"Benin":[["Zachary","Cameron","Randy","Courtney","Leah","Steven"],["Owens","Friedman","Thompson","Cross","Martinez","Pearson"]],"Bermuda":[["Joshua","Maria","Katherine","Amy","Alyssa","Ryan"],["Lewis","English","Gardner","Ramirez","Watson","Porter"]],"Bhutan":[["Kyle","Richard","Lisa","Eric","Joshua","Rebecca"],["Peters","Fuller","Sandoval","Schwartz","King","Curtis"]],"Bolivien":[["Rachel","Thomas","Stephen","Donald","Katherine","Michael"],["Ryan","Porter","Walker","Johnson","Singh"]],"Bosnien und Herzegowina":[["Brenda","Jonathan","Paula","David","Jamie","Nancy"],["Johnson","Brown","Jordan","Murray","Gonzalez"]],"Botsuana":[["Heather","David","Kristin","Krystal","Laura","Joe"],["Barton","Hart","Crawford","Maynard","Alexander","Tate"]],"Bouvetinsel":[["Daniel","Kim","Adrian","Jessica","Debbie","Misty"],["Sanchez","Allison","Mitchell","Adams","Callahan","Allen"]],"Brasilien":[["Davi Miguel","Ana Julia","Lucas","Cauã","Vinícius","Bryan"],["Vieira","Teixeira","Correia","Rezende","Farias","Sales"]],"Britische Jungferninseln":[["Tracey","Gerald","Zachary","Lance","Holly","Lauren"],["Villa","Martin","Moore","Hill","Ross","Wright"]],"Britisches Territorium im Indischen Ozean":[["Jennifer","Eduardo","Robert","Anthony","Michele","Krystal"],["Benson","Thompson","Mercado","Smith","Yoder","Williams"]],"Brunei Darussalam":[["David","Claudia","Monique","Nicole","Adam","Deborah"],["Pena","Perez","Barr","Mccormick","Clark","Taylor"]],"Bulgarien":[["Спасияна","Деслав","Яначко","Емануила","Йоанна","Светломир"],["Бобев","Николов","Парашкевов","Бърборков","Колев","Дачев"]],"Burkina Faso":[["Bonnie","Charles","Peggy","Patricia","Edgar","Danny"],["Orozco","Williams","Decker","Lee","Lawson"]],"Burundi":[["Sandra","Jason","Lisa","Brandy","Stephen","Daniel"],["Pierce","Martin","Johns","Lynch","Hendricks","Chapman"]],"Cabo Verde":[["Jeff","Sabrina","Richard","Stephen","Amy","Bryan"],["Lyons","Stephenson","Jones","Williams","Huff","Adams"]],"Chile":[["Ramón","Iván","Ashley","Sergio","Jorge","Antonia"],["Herrera","Sánchez","Núñez","Díaz","Espinoza","Silva"]],"China":[["Adam","Robin","Jack","David","Wesley","Anthony"],["James","Adams","Perkins","Rivera","Spencer","Wolf"]],"Cookinseln":[["Theresa","Tyler","Ashlee","Karen","Frances","Emma"],["Collins","Williams","Daniel","Ellis","Mooney","Pham"]],"Costa Rica":[["Carlos","Stephen","Kelly","Brad","Richard","Marie"],["Walls","Liu","Strickland","Brock","King","Cook"]],"Curaçao":[["Julian","Eric","Belinda","Julie","Melanie","Cory"],["Cannon","Garcia","Munoz","Joseph","Hernandez","Fowler"]],"Deutschland":[["Käthe","Sinaida","Raissa","Gino","Mariechen","Hubertus"],["Mangold","Dussen van","Siering","Krause","Mende","Bolzmann"]],"Dominica":[["Jeffrey","Christopher","Brittany","Mark","Roy","Marilyn"],["Jones","Ruiz","Griffin","Rodriguez","Kelly"]],"Dominikanische Republik":[["Dennis","Nicole","Sandy","Michelle","Ashley","Stacey"],["Hatfield","Rodriguez","Martin","Lewis","Davis","Ross"]],"Dschibuti":[["Mary","Theresa","Angela","Margaret","Benjamin","Amanda"],["Thompson","Lee","Gray","Jenkins","Walker","Peters"]],"Dänemark":[["Janni","Julius","Rolf","Pernille","Signe","Josefine"],["Olesen","Andersen","Karlsen","Clausen","Thorsen"]],"Ecuador":[["Brandi","Paul","Ryan","Gary","Amber","Kevin"],["Owens","Jones","Murphy","Lee","Harrington","Ashley"]],"El Salvador":[["Jonathan","Melanie","Joanna","Matthew","Lisa","Carlos"],["Moore","Miller","Martin","Watson","Mitchell","Anderson"]],"Elfenbeinküste":[["David","Johnny","Amanda","Sean","Philip","Rebecca"],["Crane","Brooks","Simmons","Schwartz","Anderson","Oneill"]],"Eritrea":[["Kayla","Austin","Robert","Calvin","Travis","Christine"],["Stout","Shaw","Rivera","Brown","Garcia","Reynolds"]],"Estland":[["Natalia","Niina","Sander","Kristina","Andrei","Elena"],["Adamson","Kolk","Orav","Jõe","Org","Rebane"]],"Eswatini":[["Jacob","Rebecca","Miguel","Brandon","Barbara","Blake"],["Warner","Scott","Hernandez","Thornton","King","Newton"]],"Falklandinseln":[["Donald","Daniel","Heather","Michael","Sarah","Fernando"],["Maxwell","Norton","Burke","Neal","Perez","Ashley"]],"Fidschi":[["Fernando","Christopher","Michael","Emily","Rita","Susan"],["Wilson","Gibson","Hicks","Gray","Powell","Chan"]],"Finnland":[["Emilia","Krista","Johannes","Susanna","Julius","Juha"],["Leino","Saarela","Holopainen","Ruuskanen","Nurminen","Taipale"]],"Frankreich":[["Jean","Claudine","Thibaut","Laurent","Jacques","Margaux"],["Rivière","Ferreira","Olivier","Lefebvre","Étienne","Lagarde"]],"Französisch-Guayana":[["Kelly","Eric","Richard","Matthew","Amy","Andrea"],["Perez","Pitts","Miller","Miles","Nelson","Hays"]],"Französisch-Polynesien":[["Justin","Janet","Monique","Anna","Melinda","Kyle"],["Lang","Schwartz","Evans","Murray","Zimmerman","Little"]],"Französische Süd- und Antarktisgebiete":[["Tiffany","George","Kathleen","Penny","Katie","Dennis"],["Lee","Bennett","Allen","Avila","Fletcher","Salinas"]],"Färöer":[["Steven","Mark","Rita","Tiffany","Betty","Brian"],["Burke","Foley","Hughes","Melton","Lawson","Taylor"]],"Gabun":[["Kristopher","Tyler","Keith","Jason","Jennifer","Daniel"],["Flores","Bryant","Ware","Barton","Mckinney","Fernandez"]],"Gambia":[["Cassandra","Tammy","Kevin","Toni","Maria","Lauren"],["Nelson","Benson","Brown","Chavez","Beard","Parker"]],"Georgien":[["ოთარ","ვერიკო","გივი","მურთაზ","ომარ","ევგენია"],["ჯანელიძე","წერეთელი","გაჯიევა","მაჩიტიძე","გურგენიძე","ცარციძე"]],"Ghana":[["Heather","Jack","Lori","Phyllis","Anthony","Thomas"],["Anderson","Bullock","Schmitt","Hickman","Vazquez","Rich"]],"Gibraltar":[["Jasmine","Joseph","Dana","Garrett","Terry","Lori"],["Wise","Weber","Stewart","Reese","Ford","Torres"]],"Grenada":[["Jacob","Leslie","Gabrielle","Katrina","Daniel","Kenneth"],["Brown","Bruce","Murray","Fisher","Young","Miller"]],"Griechenland":[["Συμεώνη","Κύρος","Θωμαίς","Ελευθερία","Γλαύκη","Δημοκράτης"],["Γιαννακουδάκης","Γκίνης","Μπελέκου","Φιλίππου","Χοντζιά","Χατζόπουλος"]],"Großbritannien":[["Frances","Hilary","Kirsty","Karl","Debra","Angela"],["Davis","Ward","Lee","Parker","Murphy","Sheppard"]],"Grönland":[["Megan","Alexander","Daniel","Sherry","Julia","Courtney"],["Nichols","Booth","Norman","Caldwell","Oconnor","Gibson"]],"Guadeloupe":[["Kathleen","Mitchell","Angela","Jennifer","Cynthia","Robert"],["Holloway","Matthews","Myers","Mclean","Wilson","Cook"]],"Guam":[["Michael","Sheila","William","Vincent","Sarah","Ryan"],["Ramos","Thompson","Nguyen","Williams","Garcia","Bauer"]],"Guatemala":[["Timothy","James","Jose","Marc","Tyler","Steven"],["Maynard","Ramirez","Leon","Nguyen","Perkins","Campbell"]],"Guernsey":[["Christopher","Alex","Tanya","Robert","Gregory","Alexis"],["Gregory","Torres","Sanchez","Jones","Alexander","Wyatt"]],"Guinea":[["Matthew","William","Todd","Anthony","Kimberly","Tracy"],["Williams","Smith","Haas","Johnson","Kelly"]],"Guinea-Bissau":[["Gavin","Kimberly","Michael","Martin","Nathaniel","Jay"],["Wilson","Ellis","Strickland","Russell","Sanders","Ramos"]],"Guyana":[["Cheryl","Cole","Vanessa","Brian","Mackenzie","Amy"],["Simmons","Collins","Neal","Wilson","Burgess","Gamble"]],"Haiti":[["Cindy","Tammy","Amanda","Nathan","Matthew","Jennifer"],["Perry","Rodriguez","Lee","Porter","Thompson","Webb"]],"Heard und McDonaldinseln":[["Robert","Heather","Willie","Jennifer","Timothy","April"],["Marks","Harris","Jones","Miranda","Diaz","Wilson"]],"Honduras":[["Shawn","Michael","Jennifer","Kylie","Kristi","Melissa"],["Mills","Anderson","Payne","English","Fox","Hoffman"]],"Hongkong":[["Logan","Rodney","Jason","Jennifer","Patricia","Diana"],["White","Arnold","Franklin","Lewis","Noble","Robinson"]],"Indien":[["Parth","Ekaja","Guneet","Onveer","Pahal","Finn"],["Bakshi","Sami","Sen","Sane","Sani","Sinha"]],"Indonesien":[["Wage","Dono","Raditya","Vicky","Rachel","Danang"],["Damanik","Manullang","Wibowo","Laksmiwati","Widodo","Tarihoran"]],"Irak":[["Megan","Jeffery","William","Maureen","Emily"],["Cole","Owens","Graves","Ramos","Fletcher","Holland"]],"Iran":[["مبين","یوسف","ثنا","النا","محمدامین","محمدعلي"],["اکبر پور","حسنی","حریریان","هدایت","جنتی","هومن"]],"Irland":[["Taylor","Eryn","Bernard","Jessica","Mary","Deaglan"],["Dooley","Finneran","Leddon","Hanley","McTernan","Cunningham"]],"Island":[["Dagmar","Guðríður","Karína","Hekla","Hjálmar","Arthúr"],["Sporðisson","Valgeirsson","Mánisdóttir","Erlingsson","Freysteinnsdóttir","Veturliðisdóttir"]],"Isle of Man":[["Jennifer","Taylor","Dale","Jill","Rebecca"],["Rivas","Moore","Taylor","Alexander","Huerta","Liu"]],"Israel":[["עידו","גיא","אביה","יוסף","אליענה","מוחמד"],["ח'טיב","פרידמן","גור","טל","כהן","אבו ראס"]],"Italien":[["Fernanda","Elvira","Lara","Achille","Graziella","Gianpaolo"],["Faugno","Monaco","Agostinelli","Prodi","Giacconi","Ossani"]],"Jamaika":[["Johnny","Lee","Scott","Mason","Brandon","Emily"],["Riley","Adams","Hill","Jackson","Roberts","Garcia"]],"Japan":[["翼","篤司","晃","英樹","裕樹"],["井上","村上","遠藤","佐藤","吉田"]],"Jemen":[["Madison","Lisa","Sarah","Jason","Jonathan","Alexandra"],["Lopez","Casey","Little","Cobb","Johnson","Boyer"]],"Jersey":[["Tracy","Alan","Jeremy","Heather","Brianna","Meghan"],["Watson","Chase","Wilson","Rodriguez","Johnson","Taylor"]],"Jordanien":[["Austin","Caleb","Julia","Steven","Mary"],["Singh","Murphy","Vargas","Marshall","Bryant"]],"Kaimaninseln":[["Michael","James","Laura","Kenneth","Marc","Michele"],["Henry","Owen","Walters","Koch","Fletcher","Williams"]],"Kambodscha":[["Matthew","Brittany","Claudia","Michael","Joseph","Christopher"],["Camacho","Mosley","Johns","Jones","Thomas","Tate"]],"Kamerun":[["Mark","Crystal","April","Robert","David","Jonathan"],["Gray","Kennedy","Rollins","Green","Manning","Norton"]],"Kanada":[["Erin","Christopher","Robert","Michael","Carlos","Jacob"],["Navarro","Goodman","Jones","Duke","Yates","Ortiz"]],"Karibische Niederlande":[["Benjamin","Jasmine","Jessica","Richard","Jose","Brenda"],["Price","Mata","Simmons","Bolton","Mason","Perry"]],"Kasachstan":[["Caitlin","Emily","Melissa","Jennifer","Randall","Daniel"],["Smith","French","Clark","Leach","Cook","Williams"]],"Katar":[["Megan","William","Brandi","Terry","Jodi"],["Baker","Hansen","Fields","Keller","Stevens","Brown"]],"Kenia":[["Gerald","George","Sheila","Grace","Alexander","Abdi"],["Atieno","Okinyi","Maina","Njiru","Odhiambo","Musa"]],"Kirgisistan":[["Thomas","Matthew","Sabrina","Rachel","Cindy","Michael"],["Phelps","Newman","Parker","Griffin","Clark","Daniel"]],"Kiribati":[["Ronald","Jenna","Terry","Kaitlyn","Alyssa","William"],["Sweeney","Cole","Martin","Cooley","James","Barker"]],"Kokosinseln":[["Daniel","Kimberly","Michael","Stanley","Yolanda","Mackenzie"],["Wright","Knox","Blair","Evans","Baldwin","Miles"]],"Kolumbien":[["Luis","Dora","Nubia","Fabián","Manuel","Augusto"],["Moreno","López","Caicedo","Henao","Jaramillo","Patiño"]],"Komoren":[["Patrick","Matthew","Steven","Michael","Reginald","Billy"],["Walker","Brown","Morris","Ross","Hernandez","Harrington"]],"Kongo-Brazzaville":[["Christopher","Mary","Tammy","Matthew","Calvin","Barry"],["Thompson","Lynch","Sanders","Freeman","Lara","Scott"]],"Kongo-Kinshasa":[["James","Cody","Audrey","Bruce","Alan","Bradley"],["Baker","Todd","Hays","Ray","Montoya","Baxter"]],"Kroatien":[["Ljubica","Zorka","Matija","Mara","Davor","Leon"],["Sikirić","Maretić","Kolarec","Gudelj","Živić","Baničević"]],"Kuba":[["Melissa","Ricky","Matthew","Marc","Rachel"],["Stevenson","Thompson","Jones","Harding","Strickland","Baird"]],"Kuwait":[["Monica","Colin","Daniel","Thomas","Randy","Matthew"],["Wilson","Lee","Estrada","Miles","Anderson","Gray"]],"Laos":[["Benjamin","Kathleen","Brittany","William","Samuel","Ashley"],["Dillon","Gay","Pierce","Kane","Mitchell","Copeland"]],"Lesotho":[["Abigail","Kevin","Shannon","Katie","Jessica","Joshua"],["Coleman","Weber","Moore","Garcia","Luna","Brown"]],"Lettland":[["Andrešs","Rihards","Jēkabs","Amālija","Elīna","Oto"],["Jaunzema","Krieva","Celmiņa","Rudzītis","Kļaviņš","Lūsis"]],"Libanon":[["Mark","Erika","Larry","Eric","Ashley","Samantha"],["Cain","Powell","Mccormick","Cooper","Walker","Smith"]],"Liberia":[["Jessica","Patricia","Tanner","Heather","Danielle","Samantha"],["Miles","Romero","White","Price","Sparks","Weiss"]],"Libyen":[["Angela","Sarah","Jesse","Glen","Crystal","Gabriel"],["Anderson","Morgan","Fleming","Brown","Spears","Cameron"]],"Liechtenstein":[["John","Jane","Alex","Alex"],["Öhri","Sele","Frick","Wohlwend","Kieber","Schädler"]],"Litauen":[["Matas","Povilas","Jorūnė","Ineta","Gediminas","Ana"],["Stankevičius","Kairys","Butkus","Kavaliauskas","Galdikas","Žukauskas"]],"Luxemburg":[["John","Jane","Alex","Alex"],["Thinnes","Schiltz","Beissel","Goetzinger","Heinen","Theisen"]],"Madagaskar":[["Gloria","Maria","George","Ryan","Tanya","Gary"],["Schwartz","Shaffer","Terry","Johnson","Grimes","Powell"]],"Malawi":[["Debra","Taylor","Kim","Crystal","Jerome","Jane"],["Hall","Knight","Butler","Pugh","Neal","Brown"]],"Malaysia":[["Jermaine","Lisa","Priscilla","Courtney","Deborah"],["Higgins","Petty","Ross","Garcia","Anderson","King"]],"Malediven":[["Elizabeth","Tara","Heather","Michelle","Monica","Dean"],["Henderson","Garrison","Daniel","Moore","Martin","Taylor"]],"Mali":[["Marilyn","Benjamin","Shawn","Leah","Melissa","Rebecca"],["Short","Willis","Peterson","Carrillo","Washington","Bell"]],"Malta":[["Victoria","Steven","Julie","Lauren","Joshua","Christian"],["Leblanc","Smith","Sims","Lewis","Willis","Williams"]],"Marokko":[["Jeffrey","Robert","Maria","Christina","Lindsey","Tina"],["Morrow","Elliott","Smith","Duncan","Gates","Hamilton"]],"Marshallinseln":[["Joan","Duane","Daniel","David","Sara","Kayla"],["Alvarez","Tate","Day","Lamb","Church","Gonzalez"]],"Martinique":[["Victoria","Erica","Jerome","Bradley","Shannon","Brooke"],["Gomez","Brown","Cunningham","Cardenas","Greene","Dyer"]],"Mauretanien":[["Stephen","Shannon","Ricardo","Maria","Heather","Antonio"],["Stevenson","Campbell","Lewis","Cox","Snow","Moore"]],"Mauritius":[["Joy","Robert","Christopher","Craig","Nicholas","Natalie"],["Vega","Simon","Farley","Mercer","Carr","Sheppard"]],"Mayotte":[["Lynn","Denise","Jennifer","Joshua","Kenneth","Beth"],["Clark","Salas","Moore","Gomez","Richardson","Contreras"]],"Mexiko":[["Lilia","Eloisa","María Luisa","Cristian","Adela","Julia"],["Samaniego","Leyva","Morales","Peña","Quezada","Vera"]],"Mikronesien":[["Michael","Melissa","Amber","Kim","Jonathan","Patrick"],["Johnson","Rodriguez","Payne","Evans","Fisher","Harris"]],"Moldau":[["Tiffany","Debra","Laura","Jonathan","Christine","Kayla"],["Walters","Clayton","Malone","Jones","Collins","Oliver"]],"Monaco":[["Sarah","Jesse","Gary","Joel","Susan","Karen"],["Martin","Brooks","Ponce","Velasquez","Smith","Williams"]],"Mongolei":[["Tyler","Patrick","Ashley","Jordan","Katie","Mary"],["Carter","Harris","Ramsey","Haley","Cooper","Lee"]],"Montenegro":[["Sharon","Oscar","Danny","Amber","Audrey","Michael"],["Glenn","Powers","Fitzpatrick","Williams","Ferguson","Howard"]],"Montserrat":[["Sonya","Michael","Robin","Elizabeth","Mark","Christopher"],["Henderson","Morgan","Donaldson","Smith","Ibarra","Rivera"]],"Mosambik":[["James","Gregory","Nancy","Eric","Denise","Wayne"],["Fox","Lucero","Gaines","Gutierrez","Ford","Martinez"]],"Myanmar":[["Anthony","Nathan","Maria","Lawrence","Joel","Derek"],["Wilson","Peterson","Johnson","Fernandez","Blackwell","Norton"]],"Namibia":[["Danielle","Christopher","Daniel","Kevin","Keith","Veronica"],["Davidson","Hawkins","Diaz","Stewart","Banks","Brown"]],"Nauru":[["David","Wesley","Michael","Blake","Olivia","Joshua"],["Marshall","Romero","Smith","Miller","Villanueva","Hartman"]],"Nepal":[["Vanessa","Joseph","Elizabeth","Ricky","Debbie","Lisa"],["Sims","Hernandez","Williams","Mcgrath","Smith","Stone"]],"Neukaledonien":[["Christopher","Brandon","Lisa","Nicholas","Jessica"],["Walker","Arnold","Hogan","Taylor","Bond","Young"]],"Neuseeland":[["Anna","Emily","Anne","Gregory","Lilly","Alexandra"],["Steele","Drew","Eaton","Fox","Kenny","Strawbridge"]],"Nicaragua":[["Jeremy","Sara","Susan","Daniel","John","Michael"],["Dillon","Murillo","Li","Holmes","Washington","Bennett"]],"Niederlande":[["Bart","Nikki","Norah","Samuel","Berend"],["Roessink","van den Nieuwenhuijsen","Kuiper","Arent","de Bruijn","Woudenberg"]],"Niger":[["Susan","Michael","Kari","Hannah","Jennifer","Stephanie"],["Chen","Reese","Baker","Li","Lopez","Perez"]],"Nigeria":[["Paul","Elizabeth","David","Hope","Patience"],["Oshodi","Ibrahim","Akinwale","Nnamani","Balogun"]],"Niue":[["Rachel","Jenna","Joyce","Michael","Dave","Kristine"],["Walsh","Butler","Miles","Owens","Brown","Hall"]],"Nordkorea":[["Vanessa","Melissa","Laura","Jonathan","Wendy","Katherine"],["Hughes","Fox","White","Ramos","Martin","Garcia"]],"Nordmazedonien":[["Richard","Devin","Jennifer","Courtney","Jacob","Jared"],["Mason","Cortez","Woodard","Baldwin","Cervantes","Kaiser"]],"Norfolkinsel":[["Glenn","Daniel","Lindsey","Jennifer","Hailey","Scott"],["Vargas","Johnson","Lopez","Carlson","Palmer","Chavez"]],"Norwegen":[["Linda","Emil","Karoline","Marianne","Kristian","Alexander"],["Mathisen","Jensen","Evensen","Bakke","Hansen","Paulsen"]],"Nördliche Marianen":[["David","Sarah","Yesenia","Jacqueline","Thomas","Roy"],["Duncan","Perez","Johnson","Cook","Parsons","Garcia"]],"Oman":[["David","Christina","Sandra","Matthew","Andrew","Alexis"],["Alexander","Simmons","Bentley","Nichols","Young","Crosby"]],"Pakistan":[["Qudoos","Talal","Zaheer","Raheem","Kaazim","Yaman"],["Vahar","Aadil","Jameel","Ihab","Faizan","Najeeb"]],"Palau":[["William","Kelly","Lee","Richard","Rebecca","Scott"],["Carter","Clark","Garner","Ramirez","Ryan","Stokes"]],"Palästinensische Autonomiegebiete":[["Amanda","Elizabeth","Robin","Dalton","Joshua","Wendy"],["Johnson","Brown","Wilson","Thomas","Case"]],"Panama":[["Adam","Chelsea","Zoe","Justin","Carrie","Kristen"],["Melendez","Mitchell","Macias","Hull","Moreno","Houston"]],"Papua-Neuguinea":[["John","Larry","Jeremy","James","Cynthia","Crystal"],["Harmon","Hardin","Mcclain","Rodriguez","Curtis","Phillips"]],"Paraguay":[["Jeffrey","Christine","Douglas","Elizabeth","Sophia","Jessica"],["Parker","Gordon","Evans","Mann","Torres","Hurst"]],"Peru":[["Johnathan","Brian","Jessica","Beth","Evelyn"],["Garrett","Becker","Richards","Vaughan","Hogan","Daniels"]],"Philippinen":[["Ashley","Robert","Alex","Richard","Barbara","Charles"],["Frost","Barrett","Conley","Ellis","Short","Carter"]],"Pitcairninseln":[["Nicole","Andrea","Kathy","Natalie","Jim","Shelley"],["Hanson","Holmes","Chen","Stone","Kim","Rodriguez"]],"Polen":[["Anna Maria","Daniel","Elżbieta","Eliza","Aleksander","Kalina"],["Chomiak","Cywka","Skrobek","Simon","Choroś","Wilusz"]],"Portugal":[["Francisco","Irina","Lisandro","Carminho","Isaac","Gabriel"],["Ribeiro","Alves","Pinheiro","Garcia","Vieira","Rodrigues"]],"Puerto Rico":[["Gregory","Brandon","Donald","Megan","Lisa","Christopher"],["Fitzpatrick","Jackson","Smith","Carr","Kidd","Whitaker"]],"Ruanda":[["James","Barbara","Renee","Frederick","Jeremy","Derek"],["Durham","Rhodes","Castillo","Case","Powell","Griffith"]],"Rumänien":[["Dumitru","Catinca","Cedrin","Jasmina","Georgia","Roxelana"],["Tomescu","Mazilescu","Voinea","Toma","Dumitrescu","Nistor"]],"Russland":[["Надежда","Авдей","Лавр","Мариан","Натан","Сидор"],["Егоров","Шарапов","Красильникова","Ефремов","Жданов","Иванова"]],"Réunion":[["Linda","Joseph","Joshua","Rebecca","Emily","Amy"],["Roberts","Avery","Tanner","Rodriguez","Davenport","Powell"]],"Salomonen":[["Ellen","Stephanie","Kathleen","Barbara","John","Christian"],["Glover","Hill","Turner","Johnson","Patterson","Lewis"]],"Sambia":[["John","Gail","Michelle","Brooke","Christopher","Catherine"],["Henry","Clark","Mann","Rogers","Daugherty","Swanson"]],"Samoa":[["Calvin","Debra","Dana","Tracy","Richard","Samantha"],["Hill","Moreno","Smith","Johnson","Dixon","Floyd"]],"San Marino":[["Angel","Andrew","Sarah","David","Jose","Christopher"],["Gomez","Collins","Woodward","Williams","Brown","Harvey"]],"Saudi-Arabien":[["Kelly","Valerie","Patricia","Kyle","Jamie","Nathaniel"],["Miller","Bowman","Davenport","Wood","Gonzalez","Mercer"]],"Schweden":[["Anna","Monika","Ingvar","Fred","Sofia"],["Johansson","Sandström","Abdullah","Khalil","Nilsson","Sjöberg"]],"Schweiz":[["Lindita","Dean","Miran","Eugenio","Annelise","Käthe"],["Kaufmann","Lanz","Roos","Ritter","Iten","Steinmann"]],"Senegal":[["Amanda","Nancy","Lauren","Vernon","Jennifer","Richard"],["Allen","Wilkinson","Reed","Clayton","Stone","Church"]],"Serbien":[["Jonathan","John","Susan","Jesse","Lindsay","Andrew"],["Rodriguez","Mendoza","Oliver","Brown","Bailey","Anderson"]],"Seychellen":[["Karen","Charles","Dakota","Jason","Martin"],["Pena","Martin","Potter","Johnson","Meyer","Martinez"]],"Sierra Leone":[["Kelly","Joshua","Mark","James","Alfred","Danielle"],["Rodriguez","Barker","Nolan","Rivera","Chandler","Parsons"]],"Simbabwe":[["Shelly","Christopher","Rodney","Melissa","Sean","Brian"],["Mccall","Mayo","Smith","Gray","Rodriguez","Jackson"]],"Singapur":[["Allison","Angela","Joshua","Rhonda","Tommy","Gordon"],["Smith","Miller","Murphy","Palmer","Anderson","Lambert"]],"Sint Maarten":[["Scott","Elizabeth","James","Angela","Keith","Johnny"],["Li","Rodriguez","Gregory","Wright","Rhodes","Neal"]],"Slowakei":[["Darina","Ľuboš","Jarolím","Miloš","Ctibor","Enna"],["Krížová","Mihalík","Kovalčíková","Michalech","Tomková","Mach"]],"Slowenien":[["Roman","Ivan","Metka","Simona","Jelena","Ivo"],["Gorenc","Zemljič","Kumer","čeh","Hafner","Vodopivec"]],"Somalia":[["Angelica","Jonathan","Amber","Aaron","Michael","Anthony"],["Ingram","Williams","Campbell","Bradford","Miller","Leonard"]],"Sonderverwaltungsregion Macau":[["Cassandra","Angela","Deborah","Billy","Xavier","Peter"],["Hardin","Mitchell","Carter","Gonzales","Lucas","Logan"]],"Spanien":[["Fernando","Berto","Viviana","Ariadna","Encarna","Julio"],["Cuevas","Paredes","Ocaña","Barrio","Ferreras","Egea"]],"Spitzbergen und Jan Mayen":[["Darrell","Timothy","Andrew","William","Emily"],["Wilson","Bright","Smith","Salinas","Alexander","Gordon"]],"Sri Lanka":[["Matthew","Bonnie","Jonathan","Peggy","Sheryl","Julie"],["Russell","Gibbs","Gordon","Sanchez","Torres","Allen"]],"St. Barthélemy":[["Willie","Maurice","Joseph","Dylan","Daniel","Mary"],["Fox","Moreno","Garcia","Andrade","Coleman","White"]],"St. Helena":[["Joshua","Isabel","Jessica","Jacqueline","John","Bernard"],["Schmidt","Stewart","Green","Perez","Aguilar","Richardson"]],"St. Kitts und Nevis":[["Isaiah","Ricardo","Lisa","Marcus","Ryan","Michael"],["Johnson","Diaz","Powell","Smith","Walters","Harris"]],"St. Lucia":[["James","William","Cynthia","Michael","Kelsey"],["Adams","Hughes","Johnson","Kelly","Marshall","Wilson"]],"St. Martin":[["Randall","Michael","David","Sara","Allen"],["Carter","Dawson","Sanders","Ray","Parks","Taylor"]],"St. Pierre und Miquelon":[["Joel","Christopher","Jose","David","Ashley","Jill"],["Williams","Willis","Harris","Houston","Church","Gibson"]],"St. Vincent und die Grenadinen":[["Lindsey","Sergio","Anthony","Nicole","Shane","Lisa"],["Malone","Thompson","Smith","Miller","Landry","Jimenez"]],"Sudan":[["Keith","Michaela","Allen","Charles","Craig","James"],["Murray","Lowe","Mitchell","Arnold","Harper","Austin"]],"Suriname":[["Michael","Angelica","Eric","Melissa","Anthony","Christopher"],["Wong","Gonzales","Mitchell","Walker","Williamson","Thomas"]],"Syrien":[["Mary","Juan","Caitlin","Timothy","Scott","John"],["Rice","Hendricks","Stewart","Brown","Espinoza","Walker"]],"São Tomé und Príncipe":[["Steven","James","Amy","Rachel","Stephanie","Veronica"],["Sanchez","House","Green","Lopez","Martin","Hayden"]],"Südafrika":[["Chad","Craig","Katherine","Donna","Christopher","Jeffrey"],["Phillips","Martinez","Smith","Rogers","Wilson","Williams"]],"Südgeorgien und die Südlichen Sandwichinseln":[["Steven","Emily","Rachel","Melissa","Kenneth","Stefanie"],["Oliver","Luna","Butler","Manning","Perkins","Bailey"]],"Südkorea":[["순옥","경숙","주원","정희","성현","영숙"],["김","이","심","박","고"]],"Südsudan":[["Patrick","William","Sabrina","Alexa","Molly","Amber"],["Bell","Bailey","Quinn","Lee","Perez","Smith"]],"Tadschikistan":[["Linda","Michael","Valerie","Stacey","Samuel","Matthew"],["Fleming","Ortiz","Fletcher","Moss","Schaefer","Weber"]],"Taiwan":[["Kimberly","Theresa","Lee","Tina","James","Anthony"],["Mccarthy","Brown","Lucas","Perez","Allen","Rosales"]],"Tansania":[["Megan","Brian","George","Miranda","Robert","Michael"],["Thomas","Smith","Watson","Frederick","Davis","Chandler"]],"Thailand":[["โกมล","นภนต์","วันฉัตร","เพ็ญยุภา","เกษรา","โสภณิตา"],["ตัณสถิตย์","ธนรักษ์","ถนัดรักษา","นุชแนวนุ่ม","ถนอมกุลบุตร","แจ้งสว่าง"]],"Timor-Leste":[["Alexander","Lisa","Andrew","Sarah","Jennifer","Mariah"],["Howard","Lowe","Coffey","Carpenter","Pearson","Rodriguez"]],"Togo":[["Abigail","Colton","Patricia","John","Cindy","Robert"],["Miller","Turner","Allen","Christian","Murray","Thompson"]],"Tokelau":[["Sydney","Taylor","Tyler","Ricardo","Richard","Barry"],["Murray","Williams","Davis","Rollins","Cole","Stewart"]],"Tonga":[["Kevin","Nathaniel","Melissa","Anne","Monica","Robert"],["Harris","Caldwell","Holmes","Williams","Davis","Woods"]],"Trinidad und Tobago":[["Steven","Edward","Nicholas","Jessica","Jonathan","Debra"],["Ortiz","Parker","Greer","Villanueva","Miller"]],"Tschad":[["Mark","Michael","Rose","Alicia","Elizabeth","Jamie"],["Mendez","Dawson","Sanchez","Holmes","Carr","Moss"]],"Tschechien":[["Kamila","Hynek","Viktor","Michaela","Antonín","Věra"],["Sedlák","Čermáková","Čermák","Šťastný","Sýkora","Holubová"]],"Tunesien":[["Jose","Tyler","Linda","David","Heather","Michael"],["Reese","Castillo","Weber","Beasley","Bartlett","Barnes"]],"Turkmenistan":[["Steve","Michael","Rose","Randall","Alan","Scott"],["Avila","Anderson","Stewart","James","Fletcher","Liu"]],"Turks- und Caicosinseln":[["Spencer","Kimberly","Jessica","Troy","Edward","Richard"],["Adams","Jones","Lee","Gonzales","Hayes","Ortiz"]],"Tuvalu":[["Sally","Tara","Tracy","Glenda","Amanda"],["Crawford","Kelley","Coleman","Solis","Dunn","Garcia"]],"Türkei":[["İlklima","Bezek","Karaca","Yargı","Asliye","Beren"],["Akça","Ergül","Erdoğan","Ülker","Akçay","Gülen"]],"USA":[["Nancy","Karen","Logan","Jacob","Jamie","John"],["Norton","Castillo","Thompson","Tanner","Webb","Moore"]],"Uganda":[["Ashley","Catherine","Kevin","Jeremy","Jennifer","Robert"],["Patel","Bell","Hogan","Gonzalez","Wu","Gill"]],"Ukraine":[["Йосип","Аніта","Ліза","Данило","Климент","Трохим"],["Захарченко","Салій","Андріїшин","Удовиченко","Їжакевич","Супруненко"]],"Ungarn":[["Anna","Róbert","Márta","Mária","Virág","Marcell"],["Jónás","Nagy","Balog","Farkas","Kerekes"]],"Uruguay":[["James","Pamela","Kent","Dennis","Wendy","Paul"],["Phillips","Rodgers","Roberts","Mendez","Raymond","Logan"]],"Usbekistan":[["Aliya","Dunyo","Samandar","Sardor","Farzona","Sanjar"],["Ahmadov","Samandarov","Odinaeva","Shohruxov","Akobirov","Muhammadyusupov"]],"Vanuatu":[["Gerald","Jean","Jessica","Kayla","Mike","Jacqueline"],["Douglas","Hoover","Flores","Weaver","Jones"]],"Vatikanstadt":[["Susan","Antonio","Michael","Tommy","Angela","Joseph"],["Morales","Wall","Ford","Green","Bennett","Cox"]],"Venezuela":[["Anthony","Samuel","William","Rodney","Jeffrey","Rebecca"],["Lopez","Hartman","Perez","Taylor","Contreras","Hernandez"]],"Vereinigte Arabische Emirate":[["Charles","Nathan","Ebony","Christina","Jason","Sarah"],["Cochran","Perez","Jones","George","Bennett","Adams"]],"Vietnam":[["Edward","Brenda","Ann","Frank","Joshua","Kyle"],["Kemp","Pacheco","Johnson","Baird","Adams","Murphy"]],"Wallis und Futuna":[["Dale","Ryan","Jesus","Hailey","Chad","Alison"],["Williams","Bryant","Miller","Oconnell","Lester","Carney"]],"Weihnachtsinsel":[["Kevin","Rita","Brandon","Elizabeth","Timothy","Brenda"],["Sellers","Hughes","Burton","French","Williams","May"]],"Westsahara":[["Linda","Rebekah","Nicole","Christian","Judy","Sarah"],["Shaw","Gonzales","Castro","Richards","West","Hubbard"]],"Zentralafrikanische Republik":[["Alexander","Rebecca","Amber","Steven","Adrienne","Jerry"],["Wilson","Moore","Walker","Gilbert","Horton","Woods"]],"Zypern":[["Kevin","Joyce","Amber","Felicia","Matthew","Thomas"],["Cabrera","Butler","Bailey","Black","Dixon","Brown"]],"Ägypten":[["Steven","Jessica","Michael","Anne","Craig"],["Hughes","Mendez","Murillo","Hawkins","Scott","Nelson"]],"Äquatorialguinea":[["Melissa","Samuel","Rebekah","Deborah","Craig","Micheal"],["Estrada","Wilson","Miranda","Martinez","Colon","Duran"]],"Äthiopien":[["Amy","Jeffrey","Anthony","Casey","Madison","Kelly"],["Rogers","Adams","Davis","Houston","White","Young"]],"Ålandinseln":[["Patrick","Betty","Brian","Laura","Amanda","Robin"],["Blanchard","Taylor","Stewart","Brooks","Peck","Pacheco"]],"Österreich":[["Emely","Richard","Marcus","Clemens","Noel","Mert"],["Mayrhofer","Tanzer","Kraxner","Jahn","Schindler","Lammer"]]};

  function countryFlag(iso){
    const code=String(iso||'').toUpperCase().slice(0,2);
    return [...code].map(ch=>String.fromCodePoint(127397+ch.charCodeAt(0))).join('');
  }
  const COUNTRY_OPTIONS = ALL_COUNTRIES.map(c=>({...c,flag:countryFlag(c.iso)}));
  const NAME_POOLS={
    USA:[['Jack','Mason','Ethan','Tyler','Cole','Owen','Logan'],['Miller','Johnson','Brown','Wilson','Davis','Walker','Bennett']],
    Canada:[['Liam','Noah','Carter','Lucas','Mason','Evan','Ryan'],['MacDonald','Campbell','Bennett','Smith','Turner','Martin','Reed']],
    Deutschland:[['Leon','Finn','Jonas','Paul','Luca','Noah','Elias'],['Müller','Schmidt','Wagner','Keller','Becker','Hoffmann','Krüger']],
    Kroatien:[['Luka','Ivan','Marko','Mateo','Ante','Josip','Dario'],['Kovač','Marić','Babić','Horvat','Radić','Perić','Vuković']],
    Schweden:[['Erik','Noah','Leo','Viktor','Oskar','Elias','Hugo'],['Lindberg','Nilsson','Bergström','Johansson','Larsson','Svensson','Lund']],
    Finnland:[['Eetu','Onni','Aapo','Mikko','Jere','Lauri','Elias'],['Nieminen','Virtanen','Korhonen','Laine','Heikkinen','Mäkinen','Salonen']],
    Schweiz:[['Luca','Noah','Nico','Jan','Simon','Joel','Tim'],['Meier','Keller','Müller','Frei','Weber','Gerber','Schmid']],
    Tschechien:[['Jakub','Jan','Adam','Martin','David','Petr','Filip'],['Novák','Černý','Dvořák','Procházka','Svoboda','Kučera','Veselý']],
    Slowakei:[['Martin','Lukas','Jakub','Samuel','Marek','Tomas','Filip'],['Kováč','Horváth','Varga','Kollár','Polák','Bartoš','Tóth']],
    Norwegen:[['Oskar','Sander','Emil','Henrik','Magnus','Isak','Mats'],['Hansen','Johansen','Larsen','Berg','Nilsen','Haugen','Solberg']],
    Dänemark:[['Mikkel','Emil','Victor','Magnus','Oscar','William','Frederik'],['Jensen','Nielsen','Hansen','Pedersen','Andersen','Christensen','Larsen']],
    Frankreich:[['Hugo','Louis','Theo','Lucas','Evan','Jules','Arthur'],['Martin','Bernard','Dubois','Robert','Moreau','Laurent','Girard']],
    Österreich:[['Lukas','David','Felix','Maximilian','Simon','Moritz','Paul'],['Gruber','Huber','Wagner','Moser','Hofer','Pichler','Leitner']],
    Slowenien:[['Luka','Miha','Jure','Rok','Jan','Tim','Zan'],['Kovač','Novak','Kranjc','Mlakar','Zupan','Vidmar','Kolar']],
    Italien:[['Luca','Matteo','Marco','Andrea','Davide','Francesco','Lorenzo'],['Rossi','Russo','Ferrari','Esposito','Romano','Conti','Marino']],
    Lettland:[['Janis','Kristaps','Rihards','Roberts','Miks','Davis','Edgars'],['Berzins','Ozols','Kalnins','Jansons','Liepa','Krumins','Vilsons']],
    Kasachstan:[['Arman','Daniyar','Nursultan','Ayan','Timur','Dias','Ruslan'],['Akhmetov','Saparov','Omarov','Iskakov','Nurgaliyev','Tulegenov','Bekov']],
    Polen:[['Kacper','Jakub','Mateusz','Piotr','Bartosz','Michal','Szymon'],['Kowalski','Nowak','Wisniewski','Wojcik','Kaminski','Lewandowski','Zielinski']],
    Ungarn:[['Bence','Mate','Adam','Daniel','Levente','Mark','Zoltan'],['Nagy','Kovacs','Toth','Szabo','Horvath','Varga','Farkas']],
    Großbritannien:[['Jack','Harry','Oliver','George','Charlie','Archie','James'],['Smith','Taylor','Brown','Wilson','Jones','Davies','Evans']],
    Niederlande:[['Daan','Sem','Thijs','Lars','Bram','Joris','Milan'],['de Jong','van Dijk','Bakker','Visser','Smit','Jansen','de Boer']],
    Japan:[['Ren','Haruto','Yuto','Sota','Riku','Kaito','Daiki'],['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Yamamoto']],
    Südkorea:[['Minjun','Jisoo','Seojun','Hyunwoo','Joonho','Taeyang','Donghyun'],['Kim','Lee','Park','Choi','Jung','Kang','Yoon']],
    Australien:[['Jack','Cooper','Lachlan','Liam','Finn','Jasper','Tyler'],['Smith','Brown','Wilson','Taylor','Walker','White','Harris']]
  };

  const state = {
    version:'1.0.0', firstRun:true, teamChosen:false, pendingTeamId:null, introStage:'welcome', manager:'Manager', active:'home', season:1, week:1,
    date:new Date('2026-08-15T18:00:00'), userTeamId:null, teams:{}, leagues:{}, market:[], coaches:[], news:[], newsUnread:true, newsIntroSeen:false,
    friendlies:[], transferOffers:[], transferInquiries:[], incomingOffers:[], incomingOffersCooldown:0, coachContacts:[], coachHistory:[], _coachPulse:0, _marketPulse:0, lastSavedAt:null, marketFilter:'all', calendarLeague:'all', selectedTeamFilter:'all', contractInbox:[], draftHistory:[], gamesSinceDraft:0, freeGoldDraftUsed:false, tactic:'1-2-2', tactics:{pressing:62,risk:50,tempo:58,passing:56}, notifications:2,
    trophies:0, fans:77, lastMatch:null, liveMatch:null, lineupPositions:{}, selectedCountry:null
  };

  function blankState(){
    return {
      version:APP_VERSION, firstRun:true, teamChosen:false, pendingTeamId:null, introStage:'club', manager:'Manager', active:'home', season:1, week:1,
      date:new Date('2026-08-15T18:00:00'), userTeamId:null, teams:{}, leagues:{}, market:[], coaches:[], news:[], newsUnread:true, newsIntroSeen:false,
      friendlies:[], transferOffers:[], transferInquiries:[], incomingOffers:[], incomingOffersCooldown:0, coachContacts:[], coachHistory:[], _coachPulse:0, _marketPulse:0, lastSavedAt:null, marketFilter:'all', calendarLeague:'all', selectedTeamFilter:'all', contractInbox:[], draftHistory:[], gamesSinceDraft:0, freeGoldDraftUsed:false, tactic:'1-2-2', tactics:{pressing:62,risk:50,tempo:58,passing:56}, notifications:2,
      trophies:0, fans:77, lastMatch:null, liveMatch:null, lineupPositions:{}, selectedCountry:null
    };
  }
  function clearSaveKeys(){
    try{
      const keys=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k && (/^streetKingsSave/i.test(k) || /^skm/i.test(k) || /^hockeyWorldCup27Save/i.test(k))) keys.push(k);
      }
      keys.forEach(k=>localStorage.removeItem(k));
      sessionStorage.clear();
    }catch(e){ console.warn('Save cleanup failed',e); }
  }
  function sundayResetBoundary(now=new Date()){
    const d=new Date(now);
    const day=d.getDay();
    const daysSinceSunday=day;
    const boundary=new Date(d);
    boundary.setHours(22,0,0,0);
    boundary.setDate(d.getDate()-daysSinceSunday);
    if(d < boundary) boundary.setDate(boundary.getDate()-7);
    return boundary;
  }
  function performWeeklyServerReset(){
    if(state.liveMatch){ state._pendingWeeklyReset=true; return false; }
    const boundary=sundayResetBoundary();
    const stamp=String(boundary.getTime());
    try{ if(localStorage.getItem(WEEKLY_RESET_KEY)===stamp) return false; }catch(_){}
    clearSaveKeys();
    try{localStorage.setItem(WEEKLY_RESET_KEY,stamp);}catch(_){}
    buildFreshCareer({save:false});
    state.version=APP_VERSION;
    state.weeklyResetNotice={boundary:boundary.toISOString(),message:'Sonntag 22:00 · Server-Neustart: Neue Mannschaft auswählen.'};
    saveState();
    render();
    setTimeout(()=>toast('SERVER-RESTART','Sonntag 22:00 · Ein neues Nationalteam kann gewählt werden.'),80);
    return true;
  }
  function checkWeeklyServerReset(){
    const now=new Date();
    const boundary=sundayResetBoundary(now);
    if(now.getDay()===0 && now.getHours()===22 && now.getMinutes()<2){
      if(state.liveMatch){state._pendingWeeklyReset=true;return;}
      performWeeklyServerReset();
      return;
    }
    if(state._pendingWeeklyReset && !state.liveMatch){ state._pendingWeeklyReset=false; performWeeklyServerReset(); }
  }

  function buildFreshCareer({save=false}={}){
    const fresh=blankState();
    Object.keys(state).forEach(k=>delete state[k]);
    Object.assign(state,fresh);
    const teams=buildTeams();
    teams.forEach(t=>state.teams[t.id]=t);
    const seedTeams=[...teams].sort((a,b)=>(b.quality||0)-(a.quality||0)).slice(0,24);
    state.leagues.L1=makeLeague(seedTeams.slice(0,8),'WORLD CUP A · TOP DIVISION',1);
    state.leagues.L2=makeLeague(seedTeams.slice(8,16),'WORLD CUP B · ELITE DIVISION',2);
    state.leagues.L3=makeLeague(seedTeams.slice(16,24),'WORLD CUP C · CHALLENGER',3);
    state.userTeamId=null;
    state.selectedCountry=null;
    state.market=generateMarket(60);
    state.coaches=generateCoaches();
    state.news=[
      {title:'WORLD CUP 27 · START',body:'24 Nationalteams und drei Leistungsklassen warten auf deinen Manager.',kind:'city',isNew:true},
      {title:'Transfermarkt geöffnet',body:'Fiktive Nationalspieler werden nach Nation getrennt. Wählst du USA, siehst du nur USA-Spieler.',kind:'market',isNew:true},
      {title:'Eiszeit & Taktik',body:'Coaches reagieren auf Teamstärke, Nation, Budget und Ambition.',kind:'coach',isNew:true}
    ];
    state.newsUnread=true; state.selectedCountry=null; state.friendlies=[]; state.firstRun=true; state.teamChosen=false; state.pendingTeamId=null; state.userTeamId=null; state.introStage='club'; state.active='home'; state.liveMatch=null; state.lastMatch=null; state._pendingWeeklyReset=false;
    if(save) saveState();
    return state;
  }
  function startNewGameFlow(){
    if(state.liveMatch) return toast('Spiel läuft noch','Neues Spiel erst nach dem Abpfiff starten.');
    clearSaveKeys();
    try{ localStorage.removeItem(APP_KEY); }catch(_){}
    buildFreshCareer({save:false});
    state.version=APP_VERSION;
    state.firstRun=true;
    state.teamChosen=false;
    state.userTeamId=null;
    state.pendingTeamId=null;
    state.introStage='club';
    state.active='home';
    state.liveMatch=null; state.lastMatch=null;
    render();
    window.scrollTo(0,0);
    setTimeout(()=>toast('NEUE MANAGERKARRIERE','Wähle jetzt deine neue Nation.'),80);
  }

    function flagSvg(team){
    const label=team?.flag||team?.country||'🏒';
    const escLabel=encodeURIComponent(label);
    return `data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='72'><rect width='96' height='72' rx='14' fill='%23071117'/><text x='48' y='49' text-anchor='middle' font-size='38'>${escLabel}</text></svg>`;
  }
  function crest(team){ return flagSvg(team); }
  function playerAvatar(p, accent='#61d7ff', small=false){
    const color=encodeURIComponent(accent||'#61d7ff');
    const number=encodeURIComponent(String((p?.rating||70)%100));
    const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${color}'/><stop offset='1' stop-color='%230b2940'/></linearGradient></defs><rect width='96' height='96' rx='14' fill='%23071117'/><circle cx='48' cy='25' r='14' fill='%23d8b08b'/><path d='M27 24c3-18 38-19 42 0v7H27z' fill='%2314191d'/><path d='M22 49c5-12 47-12 52 0l7 35H15z' fill='url(%23g)' stroke='%23d6f4ff' stroke-width='2'/><text x='48' y='76' text-anchor='middle' font-family='Arial' font-size='19' font-weight='800' fill='white'>${number}</text><path d='M11 87l25-7M85 87L60 80' stroke='white' stroke-width='4' stroke-linecap='round'/></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,'+svg;
  }

  function makePlayer(seed, teamColor='#61d7ff', forcedPos=null, base=67, nationality='Deutschland'){
    const pos=forcedPos||pick(POSITIONS), age=18+Math.floor(Math.random()*14);
    const rating=clamp(Math.round(base + (Math.random()*18-9)), 48, 94);
    const bias={G:{def:13,lead:5,control:2},LD:{def:12,pass:5,control:4},RD:{def:12,pass:5,control:4},LW:{pace:10,control:10,shoot:5,pass:3},C:{pass:11,control:10,shoot:6,lead:5},RW:{pace:10,control:10,shoot:5,pass:3}}[pos]||{};
    const skill={pace:0,shoot:0,pass:0,def:0,control:0,lead:0};
    Object.keys(skill).forEach(k=>skill[k]=clamp(Math.round(base-8+Math.random()*16+(bias[k]||0)),38,98));
    const pool=NAME_POOLS[nationality]||EXTRA_NAME_POOLS[nationality]||[FIRST,LAST];
    const name=`${pool[0][seed%pool[0].length]} ${pool[1][(seed*5+Math.floor(seed/4))%pool[1].length]}`;
    return {id:uid('p'),name,pos,age,rating,skill,salary:Math.round(1800+rating*rating*8+age*140),value:Math.round(65000+rating*rating*110+(30-age)*4200),form:Math.round(72+Math.random()*28),teamColor,skin:pick(SKIN),hair:pick(HAIR),games:0,goals:0,assists:0,yellow:0,marketHeat:Math.random(),contractYears:2,contractEndSeason:state.season+2,nationality,bio:`Fiktiver Nationalspieler aus ${nationality}. Spielstil: ${pos==='G'?'Goalie':pos==='C'?'Center':'Skater'} mit Entwicklungspotenzial.`,priceChange:0,priceChangePct:0,isG:pos==='G',isGK:pos==='G',shots:0,saves:0,penaltyMinutes:0};
  }

  function makeRoster(teamColor, quality, seedOffset=0, nationality='Deutschland'){
    const pos=['G','LD','RD','LW','C','RW','LD','RD','LW','C','RW','G'];
    return pos.map((p,i)=>makePlayer(seedOffset+i*7+Math.floor(Math.random()*3),teamColor,p,quality,nationality));
  }

  function applyNationalRoster(team){ return team; }

  function slugify(s){return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}

  function teamObj(name,city,quality,tier,color,seedOffset=0,country=null,flag='🏒'){
    const c=color || pick(TEAM_COLORS);
    const nation=country||name;
    return {id:uid('t'),name,city,country:nation,flag,quality,baseQuality:quality,teamColor:c,budget:tier===1?310000:tier===2?225000:160000,logo:'',roster:makeRoster(c,quality,seedOffset,nation),coach:null,coachBoost:0,
      form:['W','D','W','L','D'],stadium:{name:`${name} Ice Arena`,capacity:650,level:1,upgrades:{}},sponsor:null,
      stats:{played:0,wins:0,draws:0,losses:0,gf:0,ga:0,points:0,homeRevenue:0,shots:0,xg:0},youth:2,titles:0,finance:{ticketPrice:16,vipPrice:45,merchPrice:14,cateringPrice:8,debt:0,interest:0.08},teamValue:0,seasonOffers:[],facility:'National Performance Centre'};
  }

  function buildTeams(){
    return COUNTRY_OPTIONS.map((c,i)=>{
      const qualityScore=COUNTRY_QUALITY[c.iso] ?? (64 + ((i*7)%9));
      const tier=qualityScore>=79?1:(qualityScore>=70?2:3);
      const color=TEAM_COLORS[i%TEAM_COLORS.length];
      const t=teamObj(c.name,c.name,qualityScore,tier,color,i*113,c.name,c.flag);
      t.iso=c.iso; t.countryCode=c.iso; t.countryName=c.name; t.nation=c.name; t.divisionTier=tier;
      t.roster.forEach(p=>{p.teamId=t.id;p.teamColor=t.teamColor;p.nationality=t.country;p.countryCode=c.iso;});
      return t;
    });
  }

  function configureActiveLeaguesForSelectedTeam(selectedId){
    const selected=state.teams[selectedId]; if(!selected) return;
    const all=Object.values(state.teams||{});
    const others=all.filter(t=>t.id!==selectedId);
    const nearest=[...others].sort((a,b)=>Math.abs((a.quality||65)-(selected.quality||65))-Math.abs((b.quality||65)-(selected.quality||65)) || String(a.name).localeCompare(String(b.name)));
    const tier=selected.divisionTier||((selected.quality||65)>=79?1:(selected.quality||65)>=70?2:3);
    const groups=[[],[],[]]; groups[tier-1].push(selected);
    const used=new Set([selected.id]);
    for(let i=0;i<nearest.length && groups[0].length<8;i++){const t=nearest[i]; if(used.has(t.id))continue; if(t.divisionTier===1 || groups[1].length>=8 && groups[2].length>=8){groups[0].push(t);used.add(t.id);}}
    for(let i=0;i<nearest.length && groups[1].length<8;i++){const t=nearest[i]; if(used.has(t.id))continue; if(t.divisionTier!==1 || groups[0].length<8){groups[1].push(t);used.add(t.id);}}
    for(let i=0;i<nearest.length && groups[2].length<8;i++){const t=nearest[i]; if(used.has(t.id))continue; groups[2].push(t);used.add(t.id);}
    for(let g=0;g<3;g++){ for(const t of nearest){ if(groups[g].length>=8)break; if(used.has(t.id))continue; groups[g].push(t);used.add(t.id); } }
    state.leagues={};
    state.leagues.L1=makeLeague(groups[0].slice(0,8),'WORLD CUP A · TOP DIVISION',1);
    state.leagues.L2=makeLeague(groups[1].slice(0,8),'WORLD CUP B · ELITE DIVISION',2);
    state.leagues.L3=makeLeague(groups[2].slice(0,8),'WORLD CUP C · CHALLENGER',3);
  }

  function makeLeague(teams,name,level){
    const l={id:`L${level}`,name,level,teams:teams.map(t=>t.id),schedule:[],standings:{},currentRound:1};
    l.teams.forEach(id=>l.standings[id]={teamId:id,played:0,wins:0,draws:0,losses:0,gf:0,ga:0,gd:0,points:0});
    l.schedule=roundRobin(l.teams); return l;
  }

  function roundRobin(ids){
    const arr=[...ids], hasBye=arr.length%2===1; if(hasBye)arr.push(null); const n=arr.length, first=[];
    for(let r=0;r<n-1;r++){
      const games=[]; for(let i=0;i<n/2;i++){const a=arr[i],b=arr[n-1-i]; if(a&&b)games.push({id:uid('g'),round:r+1,home:r%2?a:b,away:r%2?b:a,played:false,result:null});}
      first.push(games); arr.splice(1,0,arr.pop());
    }
    const games=first.flat();
    const returnLeg=games.map(g=>({id:uid('g'),round:g.round+n-1,home:g.away,away:g.home,played:false,result:null}));
    return [...games,...returnLeg];
  }

  function generateMarket(n=48,nation=null){
    const countries=COUNTRY_OPTIONS.map(x=>x.name);
    const target=nation||state.selectedCountry||pick(countries);
    const out=[];
    for(let i=0;i<n;i++){
      const pos=pick(POSITIONS);
      const p=makePlayer(100+i,pick(TEAM_COLORS),pos,61+Math.random()*25,target);
      p.teamId=null; p.nationality=target; p.value=Math.round(p.value*(0.72+Math.random()*0.32)); p.currentPrice=p.value; p.listingEndsAt=Date.now()+90000+Math.random()*150000; p.watch=false; p.bids=0; p.sourceCountry=target;
      out.push(p);
    }
    return out;
  }

  function generateCoaches(){
    const first=['Mika','Sami','Lena','Rene','Jona','Chris','Timo','Daniel','Jan','Nils','Marco','Kevin','Felix','Noah','Elias','Luca','Patrick','Robin','Moritz','Tobias'];
    const last=['Jäger','Koch','Hartung','Falk','Reuter','Klein','Vogt','Neumann','Kaiser','Schmitt','Bauer','Lenz','Haas','Roth','Seidel','Meyer','Aydin','Kovac','Weber','Wagner'];
    const nation=['Deutschland','Österreich','Niederlande','England','Frankreich','Spanien','Brasilien','Portugal','Kroatien','Polen'];
    const spec=[
      ['Pressing','PRESSING',9],['Passspiel','PASS',8],['Defensive Ordnung','DEF',8],['Jugendarbeit','YOUTH',7],['Spielerentwicklung','DEV',8],['Mentalität','MENTAL',6],['Tempo','PACE',7],['Standards','SETPIECE',7],['Goalietraining','G',6],['Analyse','ANALYSIS',7]
    ];
    const coaches=[];
    for(let i=0;i<150;i++){
      const leagueLevel=i<30?1:i<80?2:3;
      const [specialty,code,base]=pick(spec);
      const boost=leagueLevel===1?clamp(base+Math.floor(Math.random()*8),8,18):leagueLevel===2?clamp(base+Math.floor(Math.random()*6),6,14):clamp(base+Math.floor(Math.random()*5),4,10);
      const age=35+Math.floor(Math.random()*31);
      const price=leagueLevel===1?50000+Math.floor(Math.random()*90000):leagueLevel===2?30000+Math.floor(Math.random()*50000):12000+Math.floor(Math.random()*28000);
      const fn=pick(first),ln=pick(last);
      const ambition=clamp(45+Math.floor(Math.random()*51),45,95); const patience=clamp(35+Math.floor(Math.random()*56),35,90); const salaryDemand=Math.round(price*(0.015+Math.random()*0.012)); const preferredStyle=pick(['PRESSING','POSSESSION','BALANCED','COUNTER','DEFENSIVE']);
      coaches.push({id:'coach_'+i,name:`${fn} ${ln}`,age,nationality:pick(nation),leagueLevel,specialty,code,boost,price,contractWeeks:16+Math.floor(Math.random()*9),eligible:leagueLevel===1?[1]:leagueLevel===2?[1,2]:[1,2,3],weakness:pick(['Medien','Motivation','Taktische Flexibilität','Nachwuchsarbeit','Defensivwechsel','Kaderbreite','Standards','Belastungssteuerung']),ambition,patience,salaryDemand,preferredStyle,minimumBudget:Math.round(price*2.5),bio:`${fn} ${ln} arbeitet seit ${age-25} Jahren im Eishockey. Spezialgebiet: ${specialty}. Er sucht ein World-Cup-Projekt, das zu seinem Ambitionslevel ${ambition}/100 passt.`});
    }
    return coaches;
  }

  function initState(){
    // V19 intentionally starts with a clean career. Older local saves are removed once.
    // We do NOT migrate an old selected team into the new career.
    try{
      const oldKeys=[];
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i);
        if(k && (/^streetKingsSave/i.test(k) || /^skm/i.test(k)) && k!==APP_KEY) oldKeys.push(k);
      }
      oldKeys.forEach(k=>localStorage.removeItem(k));
      sessionStorage.clear();
    }catch(e){ console.warn('Legacy save cleanup failed',e); }

    const raw=localStorage.getItem(APP_KEY);
    if(raw){
      try{
        const d=JSON.parse(raw);
        Object.assign(state,d);
        normalizeState();
        state.version=APP_VERSION;
        if(state.teamChosen && state.userTeamId && state.teams[state.userTeamId]){
          state.firstRun=false; state.introStage='done'; state.pendingTeamId=null;
        }else{
          state.firstRun=true; state.teamChosen=false; state.userTeamId=null; state.pendingTeamId=null; state.introStage='club';
        }
        return;
      }catch(e){
        console.warn('V18 Save konnte nicht geladen werden – starte sauber neu.',e);
        try{localStorage.removeItem(APP_KEY);}catch(_){}
      }
    }

    buildFreshCareer({save:false});
    state.version=APP_VERSION;
    state.firstRun=true;
    state.teamChosen=false;
    state.userTeamId=null;
    state.pendingTeamId=null;
    state.introStage='club';
  }

  function normalizeState(){
    state.active=state.active||'home'; state.tactic=state.tactic||'1-2-2'; state.tactics=state.tactics||{pressing:62,risk:50,tempo:58,passing:56}; state.lineupPositions=state.lineupPositions||{};
    const leagueSizes=Object.values(state.leagues||{}).map(l=>Array.isArray(l.teams)?l.teams.length:0).sort((a,b)=>a-b);
    const validStructure=Object.keys(state.teams||{}).length>=100 && leagueSizes.join(',')==='8,8,8';
    if(!validStructure){
      const oldManager=state.manager||'Manager';
      const oldBudget=Number(state.teams?.[state.userTeamId]?.budget||46357);
      state.teams={};state.leagues={};
      const teams=buildTeams(); teams.forEach(t=>state.teams[t.id]=t); state.userTeamId=null;
      const seedTeams=[...teams].sort((a,b)=>(b.quality||0)-(a.quality||0)).slice(0,24);
      state.leagues.L1=makeLeague(seedTeams.slice(0,8),'WORLD CUP A · TOP DIVISION',1);
      state.leagues.L2=makeLeague(seedTeams.slice(8,16),'WORLD CUP B · ELITE DIVISION',2);
      state.leagues.L3=makeLeague(seedTeams.slice(16,24),'WORLD CUP C · CHALLENGER',3);
      state.manager=oldManager;
      state.market=generateMarket(48); state.coaches=generateCoaches();
      state.news=[
        {title:'24 Nationen · 3 Divisionen',body:'Eishockey World Cup 27 ist gestartet. 24 fiktive Nationalteams treten in drei World-Cup-Divisionen an.',kind:'city'},
        {title:'Live-Simulation verbessert',body:'5 + 1, Puckbewegung, Spieleranimation und Spielereignisse laufen jetzt sichtbar.',kind:'result'},
        {title:'Transfermarkt geöffnet',body:'Neue fiktive Nationalspieler warten auf Angebote.',kind:'market'}
      ];
      state.friendlies=[];
      state.season=1;state.week=1;state.date=new Date('2026-08-15T18:00:00');state.lastMatch=null;state.liveMatch=null;
      state.version=APP_VERSION;
      state.teamChosen=false; state.firstRun=true; state.pendingTeamId=null; state.introStage='club';
      state.active='home';
      ensureManagerSystems();
      return;
    }
    Object.values(state.teams||{}).forEach(t=>{t.logo=clubLogoForTeam(t)||'';});
    if(state.teamChosen && state.teams && !state.teams[state.userTeamId]) state.userTeamId=null;
    if(!state.teamChosen) state.userTeamId=null;
    state.selectedCountry=state.selectedCountry || (state.teamChosen&&state.userTeamId?state.teams[state.userTeamId]?.country:null); state.market=Array.isArray(state.market)?state.market:generateMarket(60,state.selectedCountry); if(state.market.length<48) state.market=generateMarket(60,state.selectedCountry); state.coaches=Array.isArray(state.coaches)?state.coaches:generateCoaches(); if(state.coaches.length<150) state.coaches=generateCoaches(); state.transferOffers=Array.isArray(state.transferOffers)?state.transferOffers:[]; state.transferInquiries=Array.isArray(state.transferInquiries)?state.transferInquiries:[]; state.incomingOffers=Array.isArray(state.incomingOffers)?state.incomingOffers:[]; state.incomingOffersCooldown=Number(state.incomingOffersCooldown||0); state.contractInbox=Array.isArray(state.contractInbox)?state.contractInbox:[]; state.draftHistory=Array.isArray(state.draftHistory)?state.draftHistory:[]; state.gamesSinceDraft=Number(state.gamesSinceDraft||0); state.freeGoldDraftUsed=!!state.freeGoldDraftUsed; state.calendarLeague=state.calendarLeague||'all'; state.lastSavedAt=state.lastSavedAt||null; state.teamChosen = !!state.teamChosen; state.fans = state.fans || 77; state.news=Array.isArray(state.news)?state.news:[]; state.newsIntroSeen=!!state.newsIntroSeen; state.friendlies=Array.isArray(state.friendlies)?state.friendlies:[];
    state.pendingTeamId=state.pendingTeamId||null; if(state.teamChosen){state.firstRun=false;state.introStage='done';state.pendingTeamId=null;} else {state.introStage=state.introStage||'welcome';} state.coachContacts=Array.isArray(state.coachContacts)?state.coachContacts:[]; state.coachHistory=Array.isArray(state.coachHistory)?state.coachHistory:[]; state._coachPulse=Number(state._coachPulse||0); state._marketPulse=Number(state._marketPulse||0);
    ensureManagerSystems();
    state.date=new Date(state.date||Date.now());
    Object.values(state.teams||{}).forEach(t=>{
      t.roster ||= makeRoster(t.teamColor||'#39f2a5',t.quality||65); t.roster.forEach(p=>{p.teamId=t.id;p.teamColor=p.teamColor||t.teamColor;}); t.stats ||= {played:0,wins:0,draws:0,losses:0,gf:0,ga:0,points:0,homeRevenue:0,shots:0,xg:0}; t.form ||= ['W','D','W','L','S'];
      t.stadium ||= {name:`${t.name} Ice Arena`,capacity:180,level:1,upgrades:{}}; t.stadium.upgrades ||= {}; t.youth ||= 1; t.budget ||= 120000; t.logo=clubLogoForTeam(t)||t.logo||'';
      applyNationalRoster(t);
    });
    Object.values(state.leagues||{}).forEach(l=>{l.standings ||= {};l.schedule ||= [];});
    state.liveMatch=null; state.version=APP_VERSION; state.transferOffers.forEach(o=>{if(o.status==='pending'&&!o.responseAt)o.responseAt=Date.now()+9000;}); state.transferInquiries.forEach(q=>{if(q.status==='pending'&&!q.responseAt)q.responseAt=Date.now()+6500;});
  }

  function saveState(){
    state.version=APP_VERSION;
    state.lastSavedAt=Date.now();
    state.transferOffers=Array.isArray(state.transferOffers)?state.transferOffers:[];
    state.transferInquiries=Array.isArray(state.transferInquiries)?state.transferInquiries:[];
    const clean={...state,liveMatch:null,date:new Date(state.date).toISOString()}; if(clean.teamChosen){clean.firstRun=false;clean.introStage='done';clean.pendingTeamId=null;}
    try{localStorage.setItem(APP_KEY,JSON.stringify(clean));return true;}catch(e){console.warn('Save fehlgeschlagen',e);return false;}
  }

  function currentTeam(){return state.teams[state.userTeamId];}
  function currentLeague(){return Object.values(state.leagues).find(l=>l.teams.includes(state.userTeamId)) || state.leagues.L3;}
  function standings(l){return Object.values(l.standings).sort((a,b)=>b.points-a.points||b.gd-a.gd||b.gf-a.gf);}
  function nextUserGame(){
    const league=currentLeague(); return league?.schedule.find(g=>!g.played && (g.home===state.userTeamId || g.away===state.userTeamId));
  }
  function teamStrength(t){
    const starters=t.roster.slice(0,6); const base=avg(starters,p=>p.rating); const coach=state.coaches.find(c=>c.id===t.coach); const boost=coach?coach.boost:0; const form=(t.form||[]).filter(x=>x==='W').length-(t.form||[]).filter(x=>x==='L').length;
    return base*(1+boost/100)*(1+form*0.012);
  }
  function marketLabel(pos){return pos==='G'?'G':pos;}

  function toast(title,body=''){const el=$('#toast');if(!el)return;$('#toastTitle',el).textContent=title;$('#toastBody',el).textContent=body;el.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.classList.remove('show'),3200);}

  function addNews(title,body,kind='news'){
    state.news.unshift({title,body,kind,createdAt:Date.now(),isNew:true}); state.news=state.news.slice(0,20); state.newsUnread=true; state.selectedCountry=null; saveState();
  }

  function hardResetGame(){ startNewGameFlow(); }
  function resetState(){ startNewGameFlow(); }

  function ensureManagerSystems(){
    if(!Array.isArray(state.coaches) || state.coaches.length<150) state.coaches=generateCoaches();
    if(!Array.isArray(state.market) || state.market.length<48) state.market=generateMarket(48);
    state.transferOffers=Array.isArray(state.transferOffers)?state.transferOffers:[];
    state.transferInquiries=Array.isArray(state.transferInquiries)?state.transferInquiries:[];
    state.incomingOffers=Array.isArray(state.incomingOffers)?state.incomingOffers:[];
    state.coachContacts=Array.isArray(state.coachContacts)?state.coachContacts:[]; state.coachHistory=Array.isArray(state.coachHistory)?state.coachHistory:[]; state._coachPulse=Number(state._coachPulse||0); state._marketPulse=Number(state._marketPulse||0);
    state.contractInbox=Array.isArray(state.contractInbox)?state.contractInbox:[];
  }

  const EMOJI = {
    home:'🏠', team:'👥', tactics:'🎯', games:'⚽', league:'🏆', transfers:'↔️',
    market:'💰', city:'🏙️', news:'📰', sponsors:'💼', stadium:'🏟️', finances:'💶',
    stats:'📊', draft:'🌱', coaches:'🧑‍💼', settings:'⚙️', youth:'🧒', scouting:'🔎',
    club:'🏰', save:'💾', back:'◀️', next:'▶️', menu:'☰', trophy:'🏆'
  };
  const emoji = key => `<span class="emoji-icon" aria-hidden="true">${EMOJI[key]||'•'}</span>`;

  function renderShell(){
    const t=currentTeam(), l=currentLeague();
    const bottom=[['home','home','Home'],['team','team','Nation'],['games','games','Spiele'],['market','market','Markt'],['more','menu','Menü']];
    return `<div class="mobile-app">
      <header class="mobile-topbar">
        <button class="brand-lockup" data-page="home" aria-label="Home">
          <img src="assets/screens/hockey-world-cup-27.jpg" alt="Eishockey World Cup">
          <span><strong>EISHOCKEY WORLD CUP 27</strong><em>MANAGER</em></span>
        </button>
        <div class="top-head-right">
          <div class="club-mini"><img class="club-crest" src="${crest(t)}" alt="${esc(t.name)}"><span><b>${esc(t.name)}</b><small>${esc(t.city)}</small></span></div>
          <div class="money-mini"><small>S${state.season} · W${state.week}</small><b>${money(t.budget)}</b></div>
          <button class="round-icon" data-notify aria-label="Benachrichtigungen">●</button>
        </div>
      </header>
      <main id="view" class="view"></main>
      <nav class="bottom-nav">${bottom.map(([k,ico,label])=>`<button data-bottom="${k}" class="${state.active===k?'active':''}"><span>${emoji(ico)}</span><small>${label}</small></button>`).join('')}</nav>
    </div>`;
  }

  function pageHead(title,sub,action=''){return `<div class="page-head"><div><div class="eyebrow">EISHOCKEY WORLD CUP 27 · ${esc(currentTeam().country).toUpperCase()}</div><h1>${title}</h1><p>${sub}</p></div>${action?`<div class="page-action">${action}</div>`:''}</div>`;}
  function card(title,body,cls=''){return `<section class="card ${cls}"><div class="card-title"><h2>${title}</h2></div>${body}</section>`;}

  function renderHome(){
    const t=currentTeam(),l=currentLeague(),ng=nextUserGame(); const opp=ng?state.teams[ng.home===t.id?ng.away:ng.home]:null;
    const stand=standings(l), liveListings=state.market.slice().sort((a,b)=>b.currentPrice-a.currentPrice).slice(0,4);
    const quick=[['team','team','Nation'],['tactics','tactics','Team'],['games','games','Spielen'],['league','league','Liga'],['transfers','transfers','Transfers'],['market','market','Transfermarkt'],['city','city','Stadt'],['news','news','News']];
    return `<section class="home-screen">
      ${state.weeklyResetNotice?`<div class="weekly-reset-banner"><b>↻ SERVER-NEUSTART</b><span>Sonntag 22:00 · danach neue Nation wählen</span></div>`:''}
      <div class="home-meta"><div><span>SAISON ${state.season}</span><b>· WOCHE ${state.week}</b></div><div><strong>${money(t.budget)}</strong><span> · 😎 ${Math.round(teamStrength(t))}</span></div></div>
      <section class="home-hero exact-sheet-hero">
        <div class="hero-overlay"></div>
        <div class="home-cover-wordmark">EISHOCKEY<br><span>WORLD CUP 27</span></div>
        <div class="hero-words"><span>WORLD CUP 27 · INTERNATIONAL</span></div>
        <div class="hero-tag">SMALL TOWN<br>BIG DREAMS</div>
      </section>
      <div class="next-match-banner">
        <div><small>NÄCHSTES SPIEL</small><b>${ng&&opp?`VS ${esc(opp.name)}`:'SAISONABSCHLUSS'}</b><span>${ng?'World Cup Division · 18:00 · Ice Arena World Cup Arena':'Neue Saison vorbereiten'}</span></div>
        <button class="gold-btn" data-simulate="1">${ng?'LIVE':'START'}</button>
      </div>
      <div class="quick-grid">${quick.map(([p,i,lbl])=>`<button data-page="${p}"><span>${emoji(i)}</span><b>${lbl}</b></button>`).join('')}</div>
      ${renderSponsorHome(t)}
      ${renderLineupCard()}
      <div class="design-split"><div>${card('TABELLE · '+esc(l.name),`<div class="table-list compact">${stand.slice(0,6).map((s,i)=>{const tt=state.teams[s.teamId];return `<div class="table-row ${tt.id===t.id?'me':''}"><b>${i+1}</b><img class="club-crest" src="${crest(tt)}" alt=""><span>${esc(tt.name)}</span><small>${s.points} P</small></div>`}).join('')}</div><button class="ghost-btn wide" data-page="league">MEHR</button>`)}</div><div>${card('LIVE-MARKT',`<div class="market-mini-list">${liveListings.map(p=>`<button class="market-mini" data-player="${p.id}"><img src="${playerAvatar(p,p.teamColor,true)}"><span><b>${esc(p.name.split(' ')[0])}</b><small>${marketLabel(p.pos)} · ${p.rating}</small></span><strong>${money(p.currentPrice)}</strong></button>`).join('')}</div><button class="ghost-btn wide" data-page="market">TRANSFERMARKT ÖFFNEN</button>`)}</div></div>
      ${card(`NEWS AUS DEM WORLD CUP ${state.newsUnread?'<span class="new-badge">NEU</span>':''}`,`<div class="news-stack">${state.news.slice(0,3).map(n=>`<article class="${n.isNew?'news-is-new':''}"><div class="news-thumb ${n.kind}">${n.kind==='market'?'↔':n.kind==='stadium'?'▤':'✦'}</div><div><div class="news-line-title"><strong>${esc(n.title)}</strong>${n.isNew?'<span class="new-badge">NEU</span>':''}</div><p>${esc(n.body)}</p></div></article>`).join('')}</div>`)}
    </section>`;
  }

  function renderSponsorHome(t){
    const s=t.sponsor||SPONSORS[0];
    return `<section class="card sponsor-home-card"><div class="sponsor-home-top"><div><div class="section-kicker">HAUPTSPONSOR</div><h2>${esc(s.name)}</h2><p>${money(s.pay)} / Woche · Bonus +${Math.round(s.bonus*100)}%</p></div><div class="sponsor-emoji-big">${s.emoji||'🏷️'}</div></div><button class="ghost-btn wide" data-page="sponsors">SPONSOR-MENÜ ÖFFNEN</button></section>`;
  }

  function renderNextMatchCard(ng,opp){
    const t=currentTeam(); if(!ng||!opp)return card('Nächstes Spiel','<div class="empty">Keine Ligaspiele offen.</div>');
    const home=ng.home===t.id;
    return `<section class="card next-match"><div class="section-kicker">NÄCHSTES SPIEL · SPIELTAG ${ng.round}</div><div class="match-versus"><div><img class="club-crest" src="${crest(t)}" alt=""><strong>${esc(t.name)}</strong><small>${esc(t.city)}</small></div><div class="versus-text">VS</div><div><img class="club-crest" src="${crest(opp)}" alt=""><strong>${esc(opp.name)}</strong><small>${esc(opp.city)}</small></div></div><div class="match-meta"><span>◷ ${dateDE(new Date(state.date.getTime()+7*86400000))} · 18:00</span><span>⌖ ${home?esc(t.stadium.name):esc(opp.stadium.name)}</span><span>${pick(WEATHER).icon} ${pick(WEATHER).name}</span></div><button class="gold-btn wide" data-simulate="1">LIVE-SPIEL STARTEN · 2:00</button></section>`;
  }

  function formationPositions(){
    const map={
      '1-2-2':[{x:50,y:88},{x:22,y:61},{x:78,y:61},{x:27,y:30},{x:50,y:24},{x:73,y:30}],
      '1-1-2':[{x:50,y:88},{x:50,y:58},{x:23,y:34},{x:50,y:26},{x:77,y:34},{x:50,y:18}],
      '1-3-1':[{x:50,y:88},{x:20,y:57},{x:38,y:45},{x:62,y:45},{x:80,y:57},{x:50,y:20}]
    }; return map[state.tactic]||map['1-2-2'];
  }

  function renderLineupCard(){
    const t=currentTeam(),players=t.roster.slice(0,6),defaults=formationPositions();
    state.lineupPositions[t.id]=state.lineupPositions[t.id]||{};
    const coordsFor=(p,i)=>state.lineupPositions[t.id][p.id]||defaults[i];
    return `<section class="card lineup-card"><div class="section-head"><div><div class="section-kicker">AUFSTELLUNG</div><h2>5 + 1 · ${esc(state.tactic)}</h2><small class="drag-hint">Spieler gedrückt halten und ziehen</small></div><button class="ghost-btn" data-page="tactics">Taktik</button></div><div class="field-mobile" data-lineup-field><div class="field-mark center"></div><div class="field-mark box top"></div><div class="field-mark box bottom"></div><div class="field-mark line"></div>${players.map((p,i)=>{const c=coordsFor(p,i);return `<button class="field-player draggable-player" style="left:${c.x}%;top:${c.y}%" data-player="${p.id}" data-drag-player="${p.id}" aria-label="${esc(p.name)} verschieben"><span class="drag-grip">✥</span><img src="${playerAvatar(p,t.teamColor,true)}"><b>${esc(p.name.split(' ')[0])}</b><span>${marketLabel(p.pos)} ${p.rating}</span></button>`}).join('')}</div><div class="team-bars"><div><span>OFF</span><b>${Math.round(avg(players,p=>p.skill.shoot))}</b><i><em style="width:${avg(players,p=>p.skill.shoot)}%"></em></i></div><div><span>PASS</span><b>${Math.round(avg(players,p=>p.skill.pass))}</b><i><em style="width:${avg(players,p=>p.skill.pass)}%"></em></i></div><div><span>DEF</span><b>${Math.round(avg(players,p=>p.skill.def))}</b><i><em style="width:${avg(players,p=>p.skill.def)}%"></em></i></div></div></section>`;
  }

  function renderTeam(){
    const t=currentTeam();
    return `${pageHead('Nationalteam','Kader, Spielerentwicklung und Startelf',`<button class="gold-btn" data-page="draft">DRAFT</button>`)}
      <div class="kpi-strip"><span><b>${Math.round(teamStrength(t))}</b><small>OVR</small></span><span><b>${t.roster.length}/12</b><small>KADER</small></span><span><b>${money(t.roster.reduce((s,p)=>s+p.value,0))}</b><small>WERT</small></span></div>
      ${card('Trainer',`${t.coach?(()=>{const c=state.coaches.find(x=>x.id===t.coach);return `<div class="coach-current"><strong>${esc(c?.name||'Coach')}</strong><span>${esc(c?.specialty||'')} · +${c?.boost||0}%</span><small>Vertrag ${c?.contractWeeks||16} Wochen</small></div>`})():`<div class="row-card"><div><strong>Noch kein Coach verpflichtet</strong><small>${state.coaches.length} Coaches stehen zur Auswahl.</small></div></div>`}<button class="gold-btn wide" data-page="coaches">COACHES ÖFFNEN · ${state.coaches.length}</button>`)}
      ${card('Kader',`<div class="player-list">${t.roster.map((p,i)=>`<article class="player-row"><button class="player-main" data-player="${p.id}"><img src="${playerAvatar(p,t.teamColor,true)}"><div><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.age} J. · Form ${p.form}%</span>${p.value?`<small class="value-line">${money(p.value)} ${p.priceChange==null?'':`<em class="${p.priceChange>=0?'up':'down'}">${p.priceChange>=0?'+':''}${money(p.priceChange)} · ${p.priceChangePct>=0?'▲':'▼'} ${Math.abs(p.priceChangePct||0).toFixed(1)}%</em>`}</small>`:''}</div></button><div class="player-rating"><b>${p.rating}</b><small>${i<6?'STARTER':'BANK'}</small></div><button class="small-btn danger" data-sell="${p.id}" ${i<6?'disabled':''}>VERK.</button></article>`).join('')}</div>`)}
      ${card('Ausrüstung',`<div class="kit-showcase hockey-kits"><div><span class="kit-icon">🥅</span><small>HOME</small></div><div><span class="kit-icon">🧊</span><small>AUSWÄRTS</small></div><div><span class="kit-icon">🏒</span><small>THIRD</small></div><div><span class="kit-icon">🧤</span><small>KEEPER</small></div></div><div class="kit-sponsor-line"><span>HAUPTSPONSOR</span><b>${esc((t.sponsor||SPONSORS[0]).name)}</b></div>`)}
      ${card('Entwicklung',`<div class="stats-bars"><div><span>Tempo</span><b>${Math.round(avg(t.roster,p=>p.skill.pace))}</b><i><em style="width:${avg(t.roster,p=>p.skill.pace)}%"></em></i></div><div><span>Schuss</span><b>${Math.round(avg(t.roster,p=>p.skill.shoot))}</b><i><em style="width:${avg(t.roster,p=>p.skill.shoot)}%"></em></i></div><div><span>Pass</span><b>${Math.round(avg(t.roster,p=>p.skill.pass))}</b><i><em style="width:${avg(t.roster,p=>p.skill.pass)}%"></em></i></div><div><span>Def</span><b>${Math.round(avg(t.roster,p=>p.skill.def))}</b><i><em style="width:${avg(t.roster,p=>p.skill.def)}%"></em></i></div></div>`)}
    `;
  }

  function renderTactics(){
    const formations=['1-2-2','1-1-2','1-3-1'];
    return `${pageHead('Taktik','Touch-Steuerung für dein 5er-System')}
      ${card('Formation',`<div class="segmented">${formations.map(f=>`<button class="seg ${state.tactic===f?'active':''}" data-tactic="${f}">${f}</button>`).join('')}</div>${renderLineupCard()}`)}
      ${card('Matchplan',`<div class="range-row"><label>Pressing <b>${state.tactics.pressing}</b></label><input type="range" min="20" max="95" value="${state.tactics.pressing}" data-range="pressing"></div><div class="range-row"><label>Risiko <b>${state.tactics.risk}</b></label><input type="range" min="15" max="90" value="${state.tactics.risk}" data-range="risk"></div><div class="range-row"><label>Tempo <b>${state.tactics.tempo}</b></label><input type="range" min="25" max="95" value="${state.tactics.tempo}" data-range="tempo"></div><div class="range-row"><label>Passspiel <b>${state.tactics.passing}</b></label><input type="range" min="25" max="95" value="${state.tactics.passing}" data-range="passing"></div>`)}
    `;
  }

  function renderLeague(){
    const blocks=Object.values(state.leagues).sort((a,b)=>a.level-b.level).map(l=>{const stand=standings(l);return card(`DIVISION ${l.level} · ${esc(l.name)}`,`<div class="league-list">${stand.map((s,i)=>{const t=state.teams[s.teamId];return `<div class="league-row ${t.id===state.userTeamId?'me':''}"><b>${i+1}</b><img class="club-crest" src="${crest(t)}" alt=""><div><strong>${esc(t.name)}</strong><span>${esc(t.city)}</span></div><span class="mini-form">${(t.form||[]).slice(-5).join(' ')}</span><strong>${s.points}</strong><small>${s.gf}:${s.ga}</small></div>`}).join('')}</div><div class="promotion"><span><b>▲</b> Top 2</span><span class="muted">Aufstieg</span><span><b class="red-txt">▼</b> Bottom 2</span><span class="muted">Abstieg</span></div>`,l.level===currentLeague().level?'me-league':'');});
    return `${pageHead('World Cup Liga','Alle World-Cup-Divisionen',`<button class="ghost-btn" data-page="calendar">KALENDER</button>`)}<div class="stack">${blocks.join('')}</div>`;
  }

  function renderGames(){
    const l=currentLeague(),t=currentTeam(),leagueGames=l.schedule.filter(g=>g.home===t.id||g.away===t.id).slice(0,8), friendlies=state.friendlies.filter(g=>!g.played);
    const games=[...leagueGames.map(g=>({...g,type:'Liga'})),...friendlies.map(g=>({...g,type:'Freundschaft'}))].sort((a,b)=>(a.played?1:0)-(b.played?1:0)).slice(0,10);
    return `${pageHead('Spiele','Liga, Freundschaft und Live-Simulation',`<div class="page-action-stack"><button class="ghost-btn" data-page="calendar">KALENDER</button><button class="gold-btn" data-add-game>SPIEL HINZUFÜGEN</button></div>`)}
      ${card('Nächste Spiele',`<div class="fixture-list">${games.map(g=>{const home=state.teams[g.home], away=state.teams[g.away];return `<button class="fixture-row" data-fixture="${g.id}" data-fixture-type="${g.type}"><div><span class="date-box">${g.played?'FT':dateDE(new Date(state.date.getTime()+Math.max(1,g.round-state.week)*7*86400000))}</span></div><div><strong>${esc(home?.name||'Team')} <span>vs</span> ${esc(away?.name||'Team')}</strong><small>${g.type} · ${g.played?`${g.result?.hg ?? ''}:${g.result?.ag ?? ''}`:'18:00'}</small></div><b>${g.played?'›':'LIVE'}</b></button>`}).join('')}</div>`)}
    `;
  }

  function renderMarket(){
    const filters=['all','G','LD','LD','RD','C','LW','RW','RW'];
    const clubTargets=[];
    Object.values(state.teams).forEach(tm=>{
      if(tm.id===state.userTeamId)return;
      (tm.roster||[]).forEach(p=>clubTargets.push({...p,sourceType:'club',sourceTeamId:tm.id,sourceTeamName:tm.name}));
    });
    const nation=currentTeam()?.country||state.selectedCountry;
    const freeTargets=(state.market||[]).map(p=>({...p,sourceType:'market',sourceTeamId:null,sourceTeamName:`${nation||'Nationaler Markt'} · Freier Nationalmarkt`}));
    let list=[...clubTargets,...freeTargets].filter(p=>(!nation||p.nationality===nation) && (state.marketFilter==='all'||p.pos===state.marketFilter)).sort((a,b)=>b.rating-a.rating);
    const top=list.slice(0,90);
    return `${pageHead('Transfermarkt',`Nur ${esc(nation||'deine Nation')} · fiktive Nationalspieler · jede Verpflichtung ist eine Verhandlung`,`<div class="page-action-stack"><button class="ghost-btn" data-page="settings">💾 SAVE</button><button class="gold-btn" data-market-refresh>REFRESH</button></div>`)}
      <div class="market-live"><span class="live-dot"></span><strong>LIVE-TRANSFERMARKT</strong><span>Nur Spieler deiner gewählten Nation werden angezeigt.</span></div>
      ${card('Filter',`<div class="scroll-tabs">${filters.map(f=>`<button class="seg ${state.marketFilter===f?'active':''}" data-marketfilter="${f}">${f==='all'?'Alle':marketLabel(f)}</button>`).join('')}</div>`)}
      ${card('Spieler',`<div class="market-list">${top.map(p=>`<article class="market-row"><img src="${playerAvatar(p,p.teamColor,true)}"><div class="market-player"><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.age||'—'} J. · Form ${p.form||'—'}%</span><div><b>${p.rating}</b><small>${esc(p.sourceTeamName||'Freier Nationalmarkt')}</small></div></div><div class="market-price"><b>${money(p.value||p.currentPrice||0)}</b><small>Marktwert</small><button class="small-btn gold" data-offer-player="${p.id}">ANGEBOT</button><button class="small-btn" data-inquire-player="${p.id}">ANFRAGE</button></div><button class="heart ${p.watch?'on':''}" data-watch="${p.id}">♥</button></article>`).join('')}</div>`)}
      ${card('Transfer-Regeln',`<div class="transfer-rules"><span>🌍 Nation: <b>${esc(nation||'—')}</b></span><span>📄 Keine Sofortkäufe</span><span>🤝 Nationalteam kann ablehnen oder kontern</span><span>📅 Vertragsgespräche werden im Kalender gespeichert</span></div>`)}
    `;
  }

  function sponsorAsset(id){const s=SPONSORS.find(x=>x.id===id);return s?.asset||'';}

  function transferTargetList(){
    const current=state.userTeamId;
    const nation=currentTeam()?.country||state.selectedCountry;
    const clubTargets=[];
    Object.values(state.teams).forEach(tm=>{
      if(tm.id===current)return;
      (tm.roster||[]).forEach(p=>{ if(!nation || p.nationality===nation) clubTargets.push({...p,sourceType:'club',sourceTeamId:tm.id,sourceTeamName:tm.name}); });
    });
    const freeTargets=(state.market||[]).filter(p=>!nation||p.nationality===nation).map(p=>({...p,sourceType:'market',sourceTeamId:null,sourceTeamName:`${nation||'Nationaler Markt'} · Freier Markt`}));
    const rest=clubTargets.sort((a,b)=>b.rating-a.rating);
    return [...rest.slice(0,70),...freeTargets.slice(0,48)];
  }
  function transferStatusLabel(s){return ({pending:'PRÜFUNG',countered:'GEGENANGEBOT',accepted:'ANGENOMMEN',rejected:'ABGELEHNT',expired:'ABGELAUFEN'}[s]||s||'—');}
  function renderTransferOfferRow(o){
    const p=o.playerSnapshot||{},due=o.responseAt?Math.max(0,Math.ceil((o.responseAt-Date.now())/1000)):0;
    const action=o.status==='countered'?`<button class="small-btn gold" data-accept-counter="${o.id}">ANNEHMEN</button>`:'';
    return `<article class="offer-row ${o.status}"><div class="offer-main"><strong>${esc(p.name||'Spieler')}</strong><span>${marketLabel(p.pos)} · ${p.rating||'—'} · ${esc(o.sourceTeamName||'Berater')}</span><small>${money(o.fee||0)} Ablöse · ${money(o.salary||0)}/W · ${o.years||1} J.</small></div><div class="offer-state"><b>${transferStatusLabel(o.status)}</b><small>${o.status==='pending'?`Antwort in ${due}s`:o.status==='countered'?`Forderung ${money(o.counterFee||0)}`:esc(o.responseText||'')}</small>${action}</div></article>`;
  }
  function renderTransferCalendar(){
    const all=[...(state.transferOffers||[]),...(state.transferInquiries||[])].filter(x=>x.status==='pending').sort((a,b)=>(a.responseAt||0)-(b.responseAt||0)).slice(0,8);
    return card('TRANSFER-KALENDER',`<div class="transfer-calendar"><div class="calendar-now"><span>SPIELTAG</span><b>${dateDE(state.date)}</b><small>${timeDE(state.date)}</small></div>${all.length?all.map(o=>`<div class="calendar-item"><span class="cal-day">${dateDE(new Date(state.date.getTime()+((o.dueGameDays||1)*86400000)))}</span><div><strong>${esc(o.type==='inquiry'?'Anfrage':'Angebot · '+(o.playerSnapshot?.name||'Spieler'))}</strong><small>${esc(o.sourceTeamName||'Berater')} · Antwort ausstehend</small></div><span class="cal-dot"></span></div>`).join(''):'<div class="empty">Keine offenen Termine.</div>'}</div>`);
  }
  function renderTransfers(){
    const t=currentTeam(),targets=transferTargetList(),offers=[...(state.transferOffers||[])].sort((a,b)=>(b.sentAt||0)-(a.sentAt||0));
    return `${pageHead('Transfers','Verhandeln · Anfragen · Tausch · Vertragsangebote',`<button class="gold-btn" data-page="market">MARKT</button>`)}
      ${card('Dein Kader',`<div class="transfer-summary"><span><b>${t.roster.length}/12</b><small>KADER</small></span><span><b>${money(t.budget)}</b><small>BUDGET</small></span><span><b>${offers.filter(x=>['pending','countered'].includes(x.status)).length}</b><small>OFFENE VORGÄNGE</small></span></div>`)}
      ${renderTransferCalendar()}
      ${card('ANGEBOTE & ANGORTEN',`<div class="offer-list">${offers.map(renderTransferOfferRow).join('')||'<div class="empty">Noch keine Angebote. Öffne den Transfermarkt und verhandle mit einem Nation.</div>'}</div>`)}
      ${card('TRANSFER-LIRWE · NATIONE + FREIER MARKT',`<div class="transfer-target-list">${targets.slice(0,88).map(p=>`<article class="transfer-target"><img src="${playerAvatar(p,p.teamColor,true)}"><div class="transfer-target-info"><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.age||'—'} J. · ${p.rating} OVR</span><small>${esc(p.sourceTeamName||'Freier Nationalmarkt')} · Marktwert ${money(p.value||0)}</small></div><div class="transfer-target-actions"><button class="small-btn gold" data-offer-player="${p.id}">ANGEBOT</button><button class="small-btn" data-inquire-player="${p.id}">ANFRAGE</button>${p.sourceType==='club'?`<button class="small-btn" data-trade-player="${p.id}">HANDEL</button>`:''}</div></article>`).join('')}</div>`)}
    `;
  }

  function renderSponsors(){
    const t=currentTeam();
    return `${pageHead('Sponsoren','Partner aus World-Cup-Partner · 56 Optionen')}
      <div class="sponsor-current">${t.sponsor?`<div><span>HAUPTSPONSOR</span><strong>${esc(t.sponsor.name)}</strong><small>${money(t.sponsor.pay)} / Woche · +${Math.round(t.sponsor.bonus*100)}% Bonus</small></div><div class="sponsor-emoji-big">${t.sponsor.emoji||'🏷️'}</div><div class="sponsor-badge" style="--a:${t.sponsor.accent}">${esc(t.sponsor.name.split(' ')[0])}</div>`:'<div><strong>Kein Hauptsponsor</strong></div>'}</div>
      <div class="stack">${SPONSORS.map(s=>`<section class="card sponsor-card"><div class="sponsor-emoji">${s.emoji||'🏷️'}</div><div class="sponsor-badge" style="--a:${s.accent}">${esc(s.name.split(' ')[0])}</div><div class="sponsor-info"><strong>${esc(s.name)}</strong><span>Stufe ${s.tier} · ${money(s.pay)} / Woche</span><span>Bonus +${Math.round(s.bonus*100)}%</span></div><button class="small-btn ${t.sponsor?.id===s.id?'':'gold'}" data-sponsor="${s.id}">${t.sponsor?.id===s.id?'AKTIV':'VERTRAG'}</button></section>`).join('')}</div>`;
  }

  function renderStadium(){
    const t=currentTeam();
    const ups=[['capacity','Kapazität','Mehr Zuschauer'],['stands','Tribüne','Mehr Stimmung'],['lighting','Flutlicht','Abendspiele'],['catering','Catering','Mehr Umsatz'],['merch','Merch','Nationsumsatz'],['vip','VIP','Premiumgäste'],['surface','Kunstrasen','Wetterbonus'],['fence','Banden','Sponsorplätze'],['media','Medien','News-Reichweite'],['academy','Jugendzentrum','Talentbonus']];
    const u=k=>t.stadium.upgrades[k]||0;
    const level=Math.max(1,t.stadium.level||1);
    const buildKey=state.stadiumBuildKey||'';
    return `${pageHead('Arena','Umbau direkt im Arena sichtbar',`<button class="ghost-btn" data-rename-stadium>UMBENENNEN</button>`)}
      ${card(esc(t.stadium.name),`<div class="stadium-build-scene ${buildKey?'building':''}">
        <div class="scene-sky"><span class="moon">◐</span></div>
        <div class="scene-lights left ${u('lighting')?'on':''}"></div><div class="scene-lights right ${u('lighting')?'on':''}"></div>
        <div class="scene-stand stand-back" style="--rows:${Math.min(6,1+u('stands'))}"><i></i><i></i><i></i></div>
        <div class="scene-pitch hockey-rink"><div class="rink-blue-line left"></div><div class="rink-blue-line right"></div><div class="rink-red-line"></div><div class="rink-center-circle"></div><div class="rink-faceoff top-left"></div><div class="rink-faceoff bottom-left"></div><div class="rink-faceoff top-right"></div><div class="rink-faceoff bottom-right"></div><div class="scene-goal left"></div><div class="scene-goal right"></div></div>
        <div class="scene-stand stand-front" style="--rows:${Math.min(5,1+u('stands'))}"></div>
        <div class="scene-fence ${u('fence')?'sponsor-ready':''}"></div>
        ${u('vip')?'<div class="scene-vip">VIP</div>':''}${u('catering')?'<div class="scene-kiosk">☕</div>':''}${u('merch')?'<div class="scene-kiosk merch">👕</div>':''}
        <div class="construction ${buildKey?'active':''}"><span>🏗️</span><b>UMBAU</b><small>${buildKey?esc(ups.find(x=>x[0]===buildKey)?.[1]||buildKey):'Arena bereit'}</small></div>
      </div><div class="kpi-strip"><span><b>${t.stadium.capacity}</b><small>PLÄTZE</small></span><span><b>${level}</b><small>LEVEL</small></span><span><b>${money(t.budget)}</b><small>BUDGET</small></span></div><div class="build-progress"><span style="width:${Math.min(100,level*10)}%"></span></div>`)}
      ${card('Ausbau',`<div class="upgrade-list">${ups.map(([k,label,desc])=>{const lvl=u(k),cost=Math.round(9000*Math.pow(1.8,lvl));return `<div class="upgrade-row"><div><strong>${label}</strong><span>${desc} · Lvl ${lvl}</span></div><b>${money(cost)}</b><button class="small-btn gold" data-upgrade="${k}">+</button></div>`}).join('')}</div>`)}
    `;
  }

  function renderFinances(){
    const t=currentTeam(),wages=t.roster.reduce((s,p)=>s+p.salary,0),sponsor=t.sponsor?.pay||0,f=t.finance||{},debt=f.debt||0;
    return `${pageHead('Finanzen','Budget, Cashflow, Kredite und Nationswirtschaft',`<button class="ghost-btn" data-export>EXPORT</button>`)}<div class="kpi-strip"><span><b>${money(t.budget)}</b><small>BUDGET</small></span><span><b>${money(sponsor)}</b><small>SPONSOR/W</small></span><span><b>${money(wages)}</b><small>GEHÄLTER/W</small></span><span><b>${money(debt)}</b><small>KREDIT</small></span></div>${card('Einnahmen',`<div class="finance-row"><span>Tickets</span><b class="green-txt">${money((t.stadium.capacity||180)*(f.ticketPrice||9))}</b></div><div class="finance-row"><span>VIP</span><b class="green-txt">${money(Math.round(t.stadium.capacity*.08*(f.vipPrice||28)))}</b></div><div class="finance-row"><span>Merch</span><b class="green-txt">${money(Math.round(t.stadium.capacity*.18*(f.merchPrice||5)))}</b></div><div class="finance-row"><span>Catering</span><b class="green-txt">${money(Math.round(t.stadium.capacity*.35*(f.cateringPrice||4)))}</b></div><div class="finance-row"><span>Sponsor</span><b class="green-txt">${money(sponsor)}</b></div>`)}${card('Kredit',`<div class="finance-row"><span>Offen</span><b class="red-txt">${money(debt)}</b></div><div class="action-grid"><button class="action-tile" data-credit><b>+50K</b><small>KREDIT AUFNEHMEN</small></button><button class="action-tile" data-repay-credit><b>−</b><small>KREDIT TILGEN</small></button></div>`)}${card('Finanzaktionen',`<div class="action-grid"><button class="action-tile" data-page="sponsors"><b>SP</b><small>SPONSOREN</small></button><button class="action-tile" data-page="stadium"><b>+</b><small>AUSBAU</small></button><button class="action-tile" data-export><b>JSON</b><small>SAVE</small></button></div>`)}`;
  }

  function renderStats(){
    const t=currentTeam(), all=[...t.roster].sort((a,b)=>b.goals-a.goals||b.rating-a.rating);
    return `${pageHead('Statistiken','Spieler, Form und Saisonfortschritt')}
      <div class="kpi-strip"><span><b>${t.stats.played}</b><small>SPIELE</small></span><span><b>${t.stats.gf}</b><small>TORE</small></span><span><b>${t.stats.ga}</b><small>GEGENTORE</small></span><span><b>${t.stats.xg.toFixed(1)}</b><small>xG</small></span></div>
      ${card('Spieler-Stats',`<div class="player-stats">${all.map(p=>`<div class="stat-row"><img src="${playerAvatar(p,t.teamColor,true)}"><div><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.rating}</span></div><b>${p.goals}</b><small>T</small><b>${p.assists}</b><small>A</small><span>${p.form}%</span></div>`).join('')}</div>`)}
    `;
  }

  function renderDraft(){
    const t=currentTeam(),ready=state.gamesSinceDraft>=5 || !state.draftHistory.length;
    const cfg=[['silver','SILBER',800000,2,50,70,1],['gold','GOLD',2000000,3,72,78,1],['premium','WORLD CUP ELITE',5000000,6,78,96,3]];
    return `${pageHead('Draft','Scout-Talente auswählen · Drafts werden als Transferfenster behandelt',`<span class="rank-pill">${ready?'BEREIT':'NOCH '+(5-state.gamesSinceDraft)+' SPIELE'}</span>`)}${card('Draft-Regeln',`<div class="draft-rules"><span>🥈 Silber: 2 Kandidaten · 1 Auswahl</span><span>🥇 Gold: 3 Kandidaten · 1 Auswahl · einmalig kostenlos</span><span>🏆 World Cup Elite: 6 Kandidaten · bis zu 3 Auswahlen</span></div>`)}<div class="stack">${cfg.map(x=>`<section class="card draft-card"><div class="card-title"><h2>${x[1]}</h2><span class="tag">${x[3]} TALENTE</span></div><p>${x[2]===0?'KORWENLOS':money(x[2])} · Rating ${x[4]}–${x[5]}</p><button class="gold-btn wide" data-draft="${x[0]}" ${ready?'':'disabled'}>${ready?'DRAFT ÖFFNEN':'NOCH NICHT BEREIT'}</button></section>`).join('')}</div>`;
  }

  function ensureCoachProfile(c){
    if(!c) return c;
    c.ambition=Number(c.ambition||60); c.patience=Number(c.patience||60); c.salaryDemand=Number(c.salaryDemand||Math.round((c.price||40000)*0.02));
    c.preferredStyle=c.preferredStyle||'BALANCED'; c.minimumBudget=Number(c.minimumBudget||Math.round((c.price||40000)*2.5));
    return c;
  }
  function clubStandingSnapshot(){
    const t=currentTeam(),l=currentLeague(); const st=standings(l); const idx=Math.max(0,st.findIndex(x=>x.teamId===t.id));
    const rank=idx+1,total=Math.max(1,st.length); const pct=total===1?1:1-(idx/(total-1));
    return {rank,total,pct,points:st[idx]?.points||0,leagueLevel:l.level};
  }
  function coachInterest(c,team=currentTeam(),league=currentLeague()){
    if(!c||!team||!league) return 0;
    ensureCoachProfile(c);
    const snap=clubStandingSnapshot();
    let score=42;
    score += (3-c.leagueLevel)*6;
    score += snap.pct*28;
    score += clamp((teamStrength(team)-62)*0.85,-16,20);
    score += clamp(((team.budget||0)-60000)/12000,-12,18);
    score += clamp(((team.fans||77)-75)*0.22,-10,18);
    score += clamp(((team.stadium?.level||1)-1)*2.5,-2,12);
    if(team.coach && team.coach===c.id) score+=18;
    score += c.patience>70 && snap.rank>=Math.ceil(snap.total*.65) ? 8 : 0;
    score -= c.ambition>82 && snap.rank>3 ? (snap.rank-3)*2.8 : 0;
    score -= c.ambition>90 && league.level===3 ? 8 : 0;
    if(team.budget < c.minimumBudget) score-=10;
    return Math.round(clamp(score,5,98));
  }
  function coachInterestLabel(v){return v>=78?'WILL KOMMEN':v>=62?'INTERESSE':v>=48?'NUR MIT BESSEREM ANGEBOT':'KEIN INTERESSE';}
  function coachStyleMatch(c){const style=state.tactic==='1-2-2'?'BALANCED':(state.tactic||'1-2-2').toUpperCase();return c.preferredStyle===style?12:(c.preferredStyle==='BALANCED'?5:0);}
  function openCoachNegotiation(id){
    const c=state.coaches.find(x=>x.id===id); const t=currentTeam(),l=currentLeague(); if(!c||!t)return;
    ensureCoachProfile(c);
    const interest=clamp(coachInterest(c)+coachStyleMatch(c),5,98);
    const demand=Math.max(c.salaryDemand,Math.round(c.price*(interest<55?0.021:interest<75?0.018:0.016)));
    const term=Math.max(12,Math.min(28,c.contractWeeks||16));
    openModal(`COACH · ${esc(c.name)}`,`<div class="coach-negotiation">
      <div class="coach-neg-head"><div class="coach-avatar big">${esc(c.name.split(' ').map(x=>x[0]).join(''))}</div><div><strong>${esc(c.name)}</strong><span>${esc(c.nationality)} · ${c.age} J. · ${esc(c.specialty)}</span><small>Ambition ${c.ambition}/100 · Geduld ${c.patience}/100</small></div></div>
      <div class="coach-interest-meter"><div><span>Interesse an deinem Nation</span><b>${interest}% · ${coachInterestLabel(interest)}</b></div><i><em style="width:${interest}%"></em></i></div>
      <div class="coach-demand-grid"><span><small>Dein Stand</small><b>Platz ${clubStandingSnapshot().rank}</b></span><span><small>Wunschgehalt</small><b>${money(demand)}/W</b></span><span><small>Vertrag</small><b>${term} Wochen</b></span></div>
      <p class="modal-copy">${interest>=78?'Er hält dein Projekt für sehr interessant und ist grundsätzlich bereit.':interest>=62?'Er ist interessiert, will aber sehen, ob dein Angebot zum Projekt passt.':interest>=48?'Er würde verhandeln, erwartet aber bessere Bedingungen.':'Er hält deinen aktuellen Stand für nicht passend zu seinen Zielen.'}</p>
      <label class="input-label">Gehalt / Woche<input class="text-input" id="coachOfferSalary" type="number" min="500" step="100" value="${demand}"></label>
      <label class="input-label">Vertragsdauer<select class="text-input" id="coachOfferWeeks"><option ${term===12?'selected':''}>12</option><option ${term===16?'selected':''}>16</option><option ${term===20?'selected':''}>20</option><option ${term===24?'selected':''}>24</option><option ${term===28?'selected':''}>28</option></select></label>
      <div class="coach-demand-note">Spezialgebiet: <b>${esc(c.specialty)}</b> · Stil: <b>${esc(c.preferredStyle)}</b> · Schwäche: <b>${esc(c.weakness)}</b></div>
      <div class="modal-actions"><button class="ghost-btn" data-close>ABBRECHEN</button><button class="gold-btn" data-confirm-hire-coach="${c.id}">ANGEBOT ABGEBEN</button></div>
    </div>`,{kicker:`COACH-MARKT · DIVISION ${l.level}`});
  }
  function confirmHireCoach(id){
    const c=state.coaches.find(x=>x.id===id),t=currentTeam(); if(!c||!t)return; if(t.coach){toast('Bereits Coach aktiv','Entlasse zuerst deinen aktuellen Coach.');return;}
    const interest=clamp(coachInterest(c)+coachStyleMatch(c),5,98),salary=Math.max(500,Math.round(parseNum('#coachOfferSalary',c.salaryDemand))),weeks=clamp(Number($('#coachOfferWeeks')?.value||16),12,28);
    const demand=Math.max(1,c.salaryDemand); const budgetGate=t.budget < c.minimumBudget; let chance=0.15 + interest/125 + Math.max(0,salary/demand-0.95)*0.34 + (weeks>=16?.05:0) - (budgetGate?.12:0);
    chance=clamp(chance,0.05,0.97);
    if(interest<45 && Math.random()>0.18){closeModal();toast('Coach sagt ab',`${c.name} sucht aktuell ein anderes Projekt.`);state.coachContacts.unshift({coachId:id,date:Date.now(),result:'abgelehnt'});saveState();return;}
    if(Math.random()>chance){
      const counter=Math.round(Math.max(demand,salary*1.1));
      openModal(`GEGENANGEBOT · ${esc(c.name)}`,`<div class="coach-counter"><strong>${esc(c.name)} will kommen – aber zu seinen Bedingungen.</strong><p>${interest>=60?'Das Projekt überzeugt ihn.':'Er sieht Potenzial, fordert aber mehr Sicherheit.'}</p><div class="coach-demand-grid"><span><small>Neues Gehalt</small><b>${money(counter)}/W</b></span><span><small>Vertrag</small><b>${weeks+4} Wochen</b></span><span><small>Einmalige Vermittlung</small><b>${money(Math.round(c.price*.35))}</b></span></div><div class="modal-actions"><button class="ghost-btn" data-close>ABLEHNEN</button><button class="gold-btn" data-accept-coach-counter="${id}" data-counter-salary="${counter}" data-counter-weeks="${weeks+4}">AKZEPTIEREN</button></div></div>`,{kicker:'COACH VERHANDLUNG'}); return;
    }
    finalizeCoachHire(c,salary,weeks);
  }
  function finalizeCoachHire(c,salary,weeks){
    const t=currentTeam(); if(t.budget<c.price){toast('Budget fehlt',money(c.price));return;}
    t.budget-=c.price; t.coach=c.id; t.coachContractEnd=state.season*34+state.week+Math.ceil(weeks/1.0); t.coachSalary=salary; t.coachMorale=72;
    state.coachContacts.unshift({coachId:c.id,date:Date.now(),result:'verpflichtet',salary,weeks}); addNews('Neuer Coach',`${c.name} übernimmt ${t.name} und verlangt ${money(salary)}/W.`,'coach'); saveState(); closeModal(); renderPage(); toast('Coach verpflichtet',`${c.name} · ${money(salary)}/W`);
  }
  function acceptCoachCounter(id){const c=state.coaches.find(x=>x.id===id),t=currentTeam();if(!c||!t)return;const salary=Number(document.querySelector('[data-counter-salary]')?.dataset.counterSalary||0);const weeks=Number(document.querySelector('[data-counter-weeks]')?.dataset.counterWeeks||0);const fee=Math.round(c.price*.35);if(t.budget<fee){toast('Budget fehlt','Die Vermittlungsgebühr fehlt.');return;}finalizeCoachHire(c,salary||c.salaryDemand,weeks||20);}
  function updateCoachAfterMatch(){
    const t=currentTeam(); if(!t||!t.coach)return; const c=state.coaches.find(x=>x.id===t.coach); if(!c)return; ensureCoachProfile(c);
    const interest=coachInterest(c); const snap=clubStandingSnapshot(); t.coachMorale=clamp(Number(t.coachMorale||70)+(snap.rank<=3?2:-2),20,95);
    if(t.coachContractEnd && t.coachContractEnd-state.week<3){
      const leaveChance=snap.rank>=Math.max(4,Math.ceil(snap.total*.7)) ? (100-t.coachMorale)/170 : 0.05;
      if(Math.random()<leaveChance){addNews('Coach verlässt den Nation',`${c.name} beendet seine Zeit bei ${t.name}.`,'coach');t.coach=null;t.coachSalary=0;t.coachContractEnd=0;toast('Coach geht',`${c.name} sucht eine neue Aufgabe.`);}
      else addNews('Coach spricht über Zukunft',`${c.name} will bald über einen neuen Vertrag sprechen.`,'coach');
    }
    if(interest<38 && Math.random()<.18){addNews('Coach unzufrieden',`${c.name} hält die sportliche Entwicklung für enttäuschend.`,'coach');}
  }

  function renderCoaches(){
    const t=currentTeam(),l=currentLeague();
    const available=state.coaches.filter(c=>c.eligible?.includes(l.level)).map(c=>{ensureCoachProfile(c);return c;}).sort((a,b)=>coachInterest(b)-coachInterest(a));
    const cards=available.slice(0,30).map(c=>{
      const interest=clamp(coachInterest(c)+coachStyleMatch(c),5,98), status=coachInterestLabel(interest);
      const stance=interest>=78?'Kommt gerne':interest>=62?'Gesprächsbereit':interest>=48?'Nur mit Bedingungen':'Passt aktuell nicht';
      const btn=interest>=48?`<button class="small-btn gold" data-coach="${c.id}">${interest>=70?'VERHANDELN':'ANFRAGEN'}</button>`:`<button class="small-btn" data-coach="${c.id}">ABSAGE</button>`;
      return `<section class="card coach-card dynamic-coach-card"><div class="coach-avatar">${esc(c.name.split(' ').map(x=>x[0]).join(''))}</div><div class="coach-main"><strong>${esc(c.name)}</strong><span>${esc(c.specialty)} · +${c.boost}%</span><small>${esc(c.nationality)} · ${c.age} J. · ${money(c.salaryDemand)}/W Wunsch</small><em>${esc(stance)} · ${esc(c.weakness)}</em><div class="coach-mini-meter"><i><b style="width:${interest}%"></b></i><strong>${interest}%</strong></div><p>${esc(c.bio)}</p></div>${btn}</section>`;
    }).join('');
    const active=t.coach?state.coaches.find(x=>x.id===t.coach):null;
    const activeCard=active?`<div class="coach-current dynamic-active"><div class="coach-avatar big">${esc(active.name.split(' ').map(x=>x[0]).join(''))}</div><div><strong>${esc(active.name)}</strong><span>${esc(active.specialty)} · +${active.boost}%</span><small>Gehalt ${money(t.coachSalary||active.salaryDemand)}/W · Vertrag bis ${t.coachContractEnd||'—'} · Stimmung ${t.coachMorale||70}%</small><div class="coach-current-bar"><i style="width:${t.coachMorale||70}%"></i></div></div><button class="small-btn" data-firecoach>ENTLASSEN</button></div>`:'<div class="empty">Noch kein Coach verpflichtet. Dein Tabellenplatz beeinflusst, wer Interesse zeigt.</div>';
    return `${pageHead('Coaches','150 Trainer beobachten dein Nationalteam · Interesse ändert sich mit Tabellenplatz, Budget und Projekt',`<span class="rank-pill">${state.coaches.length} COACHES</span>`)}${card('Dein Trainerstab',activeCard)}${card('Coach-Markt',`<div class="coach-market-intro"><span>Aktueller Stand: <b>Platz ${clubStandingSnapshot().rank}</b> · ${esc(l.name)} · Budget ${money(t.budget)}</span><small>Jeder Coach bewertet dein Nationalteam individuell. Manche wollen sofort kommen, manche nur bei besserem Angebot.</small></div><div class="stack">${cards}</div>`)}`;
  }

  function renderSettings(){
    const t=currentTeam(),saved=state.lastSavedAt?`${dateDE(new Date(state.lastSavedAt))} · ${timeDE(new Date(state.lastSavedAt))}`:'noch nie';
    return `${pageHead('Einstellungen','Profile, Savegames und Spielstart')}
      ${card('Managerprofil',`<label class="input-label">Managername<input class="text-input" id="managerName" value="${esc(state.manager)}"></label><label class="input-label">Nationsname<input class="text-input" id="teamName" value="${esc(t.name)}"></label><label class="input-label">Arena<input class="text-input" id="stadiumName" value="${esc(t.stadium.name)}"></label><button type="button" class="gold-btn wide" data-settings-save>SPEICHERN</button><div class="save-status">Zuletzt gespeichert: <b>${esc(saved)}</b></div>`)}
      ${card('Spielstand',`<div class="action-grid"><button type="button" class="action-tile" data-export><b>↑</b><small>EXPORTIEREN</small></button><button type="button" class="action-tile" data-import><b>↓</b><small>IMPORTIEREN</small></button></div><div class="save-help">Export erstellt eine echte JSON-Datei. Import prüft den Spielstand vor der Übernahme.</div>`)}
      ${card('Hinweis · Server-Neustart',`<div class="weekly-reset-notice"><div class="weekly-reset-icon">↻</div><div><strong>Jeden Sonntag um 22:00 Uhr</strong><p>Der Browser simuliert den wöchentlichen Server-Neustart. Die aktuelle Karriere wird zurückgesetzt und du wählst anschließend eine neue Mannschaft.</p><small>Der Reset wird auch ausgeführt, wenn du die Seite erst nach 22:00 Uhr wieder öffnest.</small></div></div>`)}
      ${card('Karriere',`<div class="reset-career-box"><div><strong>NEUE MANAGERKARRIERE</strong><p>Die aktuelle Karriere wird vollständig gelöscht. Danach öffnet sich direkt die Nationsauswahl.</p></div><button type="button" class="gold-btn wide danger-start" data-new-game-flow>↻ KARRIERE NEU STARTEN · TEAM WÄHLEN</button></div>`)}
      ${card('Über das Spiel',`<p class="muted">Eishockey World Cup 27 · Manager · Browser Edition · 5 + 1 Hockey · Touch-first UI</p>`)}
    `;
  }

  function renderCity(){
    const t=currentTeam();
    return `${pageHead('Stadt','World Cup Arena · International',`<span class="rank-pill">WORLD CUP</span>`)}
      ${card('World Cup Arena',`<div class="city-scene"><img src="assets/screens/hockey-world-cup-27.jpg" alt="Eishockey World Cup 27"><div class="city-sign">WORLD CUP 27</div></div><div class="region-stats"><span><b>3</b><small>DIVISIONEN</small></span><span><b>24</b><small>NATIONEN</small></span><span><b>${state.fans||77}</b><small>FANS</small></span></div>`)}
      ${card('World-Cup-Zentrale',`<div class="region-list"><button data-page="league"><span class="emoji-mini">${emoji("league")}</span><span><b>WORLD CUP A–C</b><small>24 Nationen · 3 Divisionen</small></span><i>›</i></button><button data-page="market"><span class="emoji-mini">${emoji("market")}</span><span><b>Transfermarkt</b><small>48+ Spieler · Auktionen</small></span><i>›</i></button><button data-page="sponsors"><span class="emoji-mini">${emoji("sponsors")}</span><span><b>Sponsoren</b><small>Partner aus dem World-Cup-Umfeld</small></span><i>›</i></button></div>`)}
    `;
  }

  function renderNews(){
    const wasUnread=!!state.newsUnread;
    if(wasUnread){ setTimeout(()=>{state.newsUnread=false;(state.news||[]).forEach(n=>n.isNew=false);saveState();},80); }
    return `${pageHead('News','World-Cup- und Transfermeldungen',`<span class="rank-pill">${wasUnread?'NEU · ':''}LIVE</span>`)}
      ${card('Aktuell',`<div class="news-full">${state.news.map((n,i)=>`<article class="${n.isNew?'news-is-new':''}"><div class="news-thumb ${n.kind}">${n.kind==='market'?'↔':n.kind==='stadium'?'▤':n.kind==='result'?'⚽':'✦'}</div><div><div class="news-line-title"><strong>${esc(n.title)}</strong>${n.isNew?'<span class="new-badge">NEU</span>':''}</div><p>${esc(n.body)}</p><small>${n.createdAt?dateDE(new Date(n.createdAt)):dateDE(new Date())} · ${n.createdAt?timeDE(new Date(n.createdAt)):timeDE(new Date())}</small></div></article>`).join('')}</div>`)}
    `;
  }


  function renderCalendar(){
    const opts=['all','L1','L2','L3'];
    const games=Object.values(state.leagues).flatMap(l=>l.schedule.map(g=>({...g,league:l}))).filter(g=>state.calendarLeague==='all'||g.league.id===state.calendarLeague).sort((a,b)=>a.round-b.round);
    const rows=games.slice(0,80).map(g=>{const h=state.teams[g.home],a=state.teams[g.away];return `<div class="calendar-row"><span class="calendar-round">TAG ${g.round}</span><div><strong>${esc(h.name)} <span>vs</span> ${esc(a.name)}</strong><small>${esc(g.league.name)} · ${g.played?`FT ${g.result?.hg??0}:${g.result?.ag??0}`:'offen'}</small></div>${g.played?'<b>✓</b>':'<span>›</span>'}</div>`}).join('');
    return `${pageHead('Kalender','Spielplan aller drei Divisionen',`<div class="scroll-tabs">${opts.map(o=>`<button class="seg ${state.calendarLeague===o?'active':''}" data-calendar-league="${o}">${o==='all'?'ALLE':o}</button>`).join('')}</div>`)}${card('SAISONKALENDER',`<div class="calendar-list">${rows||'<div class="empty">Keine Spiele.</div>'}</div>`)}${card('HEUTIGER SPIELTAG',`<div class="matchday-summary"><b>${dateDE(state.date)}</b><span>Spieltag ${state.week}</span><small>Andere Spiele werden nach deinem Match automatisch simuliert.</small></div>`)}`;
  }

  function renderPlayerOffers(){
    const offers=state.incomingOffers||[];
    return `${pageHead('Spielerangebote','Andere Nationen beobachten deinen Kader',`<span class="rank-pill">${offers.filter(x=>x.status==='pending').length} OFFEN</span>`)}${card('Eingehende Angebote',`<div class="offer-list">${offers.map(o=>`<article class="incoming-row ${o.status}"><img src="${playerAvatar(o.playerSnapshot,currentTeam().teamColor,true)}"><div><strong>${esc(o.playerSnapshot.name)}</strong><span>${marketLabel(o.playerSnapshot.pos)} · OVR ${o.playerSnapshot.rating}</span><small>${esc(o.fromTeamName)} · Ablöse ${money(o.fee)} · ${o.status}</small></div>${o.status==='pending'?`<div class="transfer-target-actions"><button class="small-btn gold" data-incoming-accept="${o.id}">ANNEHMEN</button><button class="small-btn" data-incoming-reject="${o.id}">ABLEHNEN</button></div>`:`<span class="offer-state-tag">${esc(o.responseText||o.status)}</span>`}</article>`).join('')||'<div class="empty">Noch keine Anfragen. Nach einigen Spieltagen melden sich Nationen.</div>'}</div>`)} `;
  }

  function contractDemand(p){
    const yearsLeft=Math.max(0,(p.contractEndSeason||state.season+2)-state.season);
    const rating=Number(p.rating||60), form=Number(p.form||60), age=Number(p.age||25);
    let mult=1 + clamp((rating-60)*0.012,-.18,.35) + clamp((form-60)*0.002,-.10,.10);
    if(yearsLeft<=1) mult+=.10; if(age<=22) mult+=.06; if(age>=32) mult-=.05;
    return Math.max(500,Math.round((p.salary||1800)*mult));
  }
  function openContractRenewal(id){
    const t=currentTeam(),p=t.roster.find(x=>x.id===id); if(!p)return;
    const demand=contractDemand(p), yearsLeft=Math.max(0,(p.contractEndSeason||state.season+2)-state.season), form=Number(p.form||60);
    openModal(`VERTRAGSVERHANDLUNG · ${esc(p.name)}`,`<div class="contract-paper"><div class="contract-head"><span>WORLD CUP 27 · SPIELERAGENT</span><b>${yearsLeft<=1?'VERTRAG LÄUFT BALD AUS':'VORZEITIG'}</b></div><div class="contract-club"><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.rating} OVR · Form ${form}%</span><small>Aktuell: ${money(p.salary)}/W · Ende Saison ${p.contractEndSeason||state.season+2}</small></div><div class="contract-grid"><label class="input-label">Gehalt / Woche<input class="text-input" id="renewSalary" type="number" min="500" step="100" value="${demand}"></label><label class="input-label">Neue Laufzeit<select class="text-input" id="renewYears"><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label><label class="input-label">Einsatzbonus (€)<input class="text-input" id="renewBonus" type="number" min="0" step="100" value="${Math.round((p.salary||1800)*.05)}"></label></div><div class="contract-meta"><span>💬 Spielerseite</span><b>Forderung ca. ${money(demand)}/W</b><span>📈 Marktstatus</span><b>${yearsLeft<=1?'Zeitdruck':'Spieler fühlt sich wohl'}</b></div><div class="contract-paper-note">Ein zu niedriges Angebot kann abgelehnt werden oder ein Gegenangebot auslösen. Ein gutes Angebot bindet den Spieler länger und schützt seinen Marktwert.</div><div class="modal-actions"><button class="ghost-btn" data-close>ABBRECHEN</button><button class="gold-btn" data-confirm-renew="${p.id}">VERLÄNGERUNG ANBIETEN</button></div></div>`,{kicker:'VERTRÄGE · VERHANDLUNG'});
  }
  function signRenewal(p,salary,years,bonus){
    p.salary=salary; p.contractYears=years; p.contractBonus=bonus; p.contractEndSeason=Math.max(state.season+1,p.contractEndSeason||state.season)+years; p.morale=clamp((p.morale||72)+4,0,100);
    addNews('Vertrag verlängert',`${p.name} verlängert bei ${currentTeam().name} bis Saison ${p.contractEndSeason}.`,'contract'); saveState(); closeModal(); renderPage(); toast('Vertrag verlängert',`${p.name} · ${money(salary)}/W · ${years} Jahre`);
  }
  function confirmRenewContract(id){
    const p=currentTeam().roster.find(x=>x.id===id); if(!p)return;
    const salary=Math.max(500,Math.round(parseNum('#renewSalary',contractDemand(p)))),years=clamp(Number($('#renewYears')?.value||2),1,4),bonus=Math.max(0,Math.round(parseNum('#renewBonus',0)));
    const demand=contractDemand(p),ratio=salary/demand,loyalty=clamp(Number(p.morale||70)/100,.4,1); let chance=.20+Math.min(.65,Math.max(0,ratio-.82)*.72)+(years>=2?.08:0)+(loyalty-.5)*.12;
    if(ratio>=1.02)chance+=.12; if((p.contractEndSeason||state.season+2)-state.season<=1)chance+=.10; chance=clamp(chance,.05,.97);
    const roll=Math.random();
    if(roll<=chance){signRenewal(p,salary,years,bonus);return;}
    if(ratio>=.72){
      const counter=Math.round(demand*(1.05+Math.random()*.12));
      openModal(`GEGENANGEBOT · ${esc(p.name)}`,`<div class="contract-paper"><div class="contract-head"><span>SPIELERAGENT</span><b>NEUE FORDERUNG</b></div><p class="modal-copy"><b>${esc(p.name)}</b> möchte bleiben, akzeptiert aber dein Angebot nicht. Sein Agent fordert:</p><div class="contract-grid"><div class="contract-stat"><small>Gehalt</small><strong>${money(counter)}/W</strong></div><div class="contract-stat"><small>Laufzeit</small><strong>${years} Jahre</strong></div><div class="contract-stat"><small>Bonus</small><strong>${money(Math.max(bonus,Math.round(counter*.06)))}</strong></div></div><div class="modal-actions"><button class="ghost-btn" data-close>VERHANDLUNG ABBRECHEN</button><button class="gold-btn" data-accept-renew-counter="${p.id}" data-counter-salary="${counter}" data-counter-years="${years}" data-counter-bonus="${Math.max(bonus,Math.round(counter*.06))}">GEGENANGEBOT ANNEHMEN</button></div></div>`,{kicker:'VERTRAG · GEGENANGEBOT'}); return;
    }
    closeModal(); toast('Spieler lehnt ab',`${p.name} will zu diesen Bedingungen nicht verlängern.`);
  }
  function acceptRenewCounter(id){
    const p=currentTeam().roster.find(x=>x.id===id); if(!p)return; const b=document.querySelector('[data-accept-renew-counter]'); const salary=Number(b?.dataset.counterSalary||contractDemand(p)); const years=Number(b?.dataset.counterYears||2); const bonus=Number(b?.dataset.counterBonus||0); signRenewal(p,salary,years,bonus);
  }

  function renderContracts(){
    const t=currentTeam();
    return `${pageHead('Verträge','Gehalt, Laufzeit und Verlängerungen')}${card('Kaderverträge',`<div class="contracts-list">${t.roster.map(p=>`<article class="contract-row"><div><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.contractYears||2} Jahre</span><small>${money(p.salary)} / Woche · Ende Saison ${p.contractEndSeason||state.season+2}</small></div><button type="button" class="small-btn gold" data-renew-contract="${p.id}">VERLÄNGERN</button></article>`).join('')}</div>`)}${card('Vertragsregeln',`<div class="transfer-rules"><span>📄 Mindestlaufzeit 1 Jahr</span><span>💶 Gehalt wird verhandelt</span><span>📅 Vertragsende beeinflusst Marktwert</span></div>`)}`;
  }

  function renderTeamOverview(){
    const leagues=Object.values(state.leagues).sort((a,b)=>a.level-b.level);
    return `${pageHead('Nationen','Alle Nationalteams, Kader und World-Cup-Daten')}${leagues.map(l=>card(`DIVISION ${l.level} · ${esc(l.name)}`,`<div class="team-overview-list">${l.teams.map(id=>{const t=state.teams[id];return `<button class="team-overview-row" data-team-overview="${t.id}"><img class="club-crest" src="${crest(t)}"><div><strong>${esc(t.name)}</strong><span>${esc(t.city)} · OVR ${Math.round(teamStrength(t))}</span></div><small>${money(t.budget)}</small><b>›</b></button>`}).join('')}</div>`)).join('')}`;
  }

  function openTeamOverview(id){
    const t=state.teams[id];if(!t)return;const l=Object.values(state.leagues).find(x=>x.teams.includes(id));const top=[...(t.roster||[])].sort((a,b)=>b.rating-a.rating).slice(0,6);
    openModal(esc(t.name),`<div class="team-profile-card"><img class="club-crest" src="${crest(t)}"><strong>${esc(t.name)}</strong><span>${esc(t.city)} · ${esc(l?.name||'Liga')}</span></div><div class="kpi-strip"><span><b>${Math.round(teamStrength(t))}</b><small>OVR</small></span><span><b>${money(t.budget)}</b><small>BUDGET</small></span><span><b>${t.stadium.capacity}</b><small>PLÄTZE</small></span></div><div class="player-list compact-list">${top.map(p=>`<button class="player-row" data-player="${p.id}"><img src="${playerAvatar(p,t.teamColor,true)}"><div><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.rating} OVR</span></div><b>${money(p.value)}</b></button>`).join('')}</div>`,{kicker:'NATIONSÜBERSICHT'});
  }

  function renderPreMatch(){
    return pageHead('Matchday','Wähle ein Spiel aus dem Kalender oder Spiele-Menü.', `<button class="ghost-btn" data-page="games">SPIELE</button>`)+card('MATCH CENTER',`<div class="prematch-cover"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"><div><strong>VOR DEM BULLY</strong><span>Die Partie startet aus dem Spielebereich. Das Cover bleibt dabei sichtbar und blockiert die Navigation nicht.</span></div></div><div class="empty">Kein ausgewähltes Spiel. Öffne ein anstehendes Spiel.</div>`);
  }

  function renderMore(){
    const items=[['news','news','News'],['transfers','transfers','Transfers'],['offers','news','Spielerangebote'],['contracts','contracts','Verträge'],['overview','club','Nationen'],['calendar','games','Kalender'],['tactics','tactics','Taktik'],['league','league','Liga'],['sponsors','sponsors','Sponsoren'],['stadium','stadium','Arena'],['finances','finances','Finanzen'],['stats','stats','Statistiken'],['draft','draft','Draft'],['coaches','coaches','Coaches'],['city','city','Stadt'],['settings','settings','Einstellungen']];
    return `${pageHead('Navigation','Alle Manager-Systeme')}
      ${card('SPIEL · NAVIGATION',`<div class="nav-game-card"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27 · Spiel"><div class="nav-game-copy"><div class="section-kicker">SPIELTAG · WORLD CUP 27</div><strong>LIVE-SPIEL</strong><p>Hier findest du dein nächstes Spiel. Öffne den Spielebereich und starte die Partie von dort.</p></div><button class="gold-btn wide" data-page="games">🏒 SPIEL ÖFFNEN</button></div>`)}
      ${card(`MENÜ ${state.newsUnread?'<span class="new-badge">NEWS NEU</span>':''}`,`<div class="menu-grid">${items.map(([k,i,l])=>`<button data-page="${k}"><span>${emoji(i)}</span><b>${l}</b>${k==='news'&&state.newsUnread?'<span class="menu-new">NEU</span>':''}</button>`).join('')}</div>`)}
      ${card('REGION',`<div class="region-card"><strong>World Cup Arena</strong><span>International · World Cup 27</span><p>Scouting, Sponsoren und Gegner kommen aus den teilnehmenden Nationen und entwickeln sich mit deiner Karriere.</p></div>`)};`;
  }

  function showNewsLaunchPopup(){
    if(!state.teamChosen || state.newsIntroSeen || state.liveMatch) return;
    const items=(state.news||[]).slice(0,2);
    if(!items.length){state.newsIntroSeen=true;saveState();return;}
    const body=`<div class="launch-news-intro"><div class="launch-news-cover"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"><span>AKTUELLE MELDUNGEN · WORLD CUP 27</span></div><div class="launch-news-list">${items.map((n,i)=>`<article class="launch-news-item"><div class="news-thumb ${n.kind}">${n.kind==='market'?'↔':n.kind==='stadium'?'▤':n.kind==='result'?'⚽':'✦'}</div><div><div class="news-line-title"><strong>${esc(n.title)}</strong>${n.isNew?'<span class="new-badge">NEU</span>':''}</div><p>${esc(n.body)}</p><button class="ghost-btn" data-news-read="${i}">WEITER LESEN</button></div></article>`).join('')}</div><button class="gold-btn wide" data-news-go-navigation>WEITER · ZUR NAVIGATION</button></div>`;
    openModal('AKTUELLE NEWS',body,{kicker:'START · NEWS'});
  }



  function renderPage(){
    const map={home:renderHome,team:renderTeam,tactics:renderTactics,league:renderLeague,games:renderGames,calendar:renderCalendar,market:renderMarket,transfers:renderTransfers,offers:renderPlayerOffers,contracts:renderContracts,overview:renderTeamOverview,sponsors:renderSponsors,stadium:renderStadium,finances:renderFinances,stats:renderStats,draft:renderDraft,coaches:renderCoaches,settings:renderSettings,more:renderMore,city:renderCity,news:renderNews,prematch:renderPreMatch};
    $('#view').innerHTML=(map[state.active]||renderHome)();
    if(state.active==='news' && state.newsUnread){ state.newsUnread=false; (state.news||[]).forEach(n=>n.isNew=false); saveState(); }
    bindPriorityTouchControls();
  }

  function ensureNationLogoCSS(){ if(document.getElementById('club-logo-fix-css')) return; const st=document.createElement('style'); st.id='club-logo-fix-css'; st.textContent='.club-crest{width:42px;height:42px;object-fit:contain;display:block;flex:0 0 auto}.team-select-card .club-crest{width:56px;height:56px;margin:auto}.match-versus img.club-crest,.live-score img.club-crest{width:54px;height:54px;object-fit:contain}.league-row img.club-crest,.table-row img.club-crest{width:34px;height:34px;object-fit:contain}'; document.head.appendChild(st); }

  function renderTeamOnboarding(){
    const nations=COUNTRY_OPTIONS.map(c=>state.teams && Object.values(state.teams).find(t=>t.countryCode===c.iso)).filter(Boolean);
    const cards=nations.map(t=>`<button type="button" class="team-select-card ${state.pendingTeamId===t.id?'selected':''}" data-select-team="${t.id}"><div class="country-flag">${esc(t.flag)}</div><strong>${esc(t.name)}</strong><small>${esc(t.country)}</small><em>OVR ${Math.round(teamStrength(t))}</em></button>`).join('');
    return `<div class="onboarding-screen hockey-onboarding"><section class="onboarding-card"><div class="hockey-cover-onboard"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"><div class="cover-gradient"></div><div class="cover-title">EISHOCKEY<br><span>WORLD CUP 27</span></div></div><div class="eyebrow">START · DEINE KARRIERE</div><h1>WÄHLE DEINE NATION</h1><p>${nations.length} Länder mit Flaggen-Emoji. Alle Spieler sind fiktiv. Der Transfermarkt bleibt strikt auf deine gewählte Nation beschränkt.</p><label class="input-label">MANAGERNAME<input class="text-input" id="welcomeManager" value="${esc(state.manager||'Manager')}" autocomplete="name"></label><div class="nation-search-wrap"><input class="text-input" id="nationSearch" placeholder="Nation suchen …" autocomplete="off"></div><div class="onboarding-scroll nation-directory">${cards}</div><div class="onboarding-footer"><div id="onboardingChoice">${state.pendingTeamId?`Ausgewählt: <b>${esc(state.teams[state.pendingTeamId]?.name||'Nationalteam')}</b>`:'Noch keine Nation ausgewählt.'}</div><button type="button" class="gold-btn wide" data-club-continue ${state.pendingTeamId?'':'disabled'}>WEITER</button></div><div class="onboarding-hint">🏒 3 Drittel · 1:00 pro Drittel · Live-Simulation · Spieltagsergebnisse vor deiner Partie · Nations-Transfermarkt</div></section></div>`;
  }

  function render(){
    ensureNationLogoCSS();
    if(!state.teamChosen){
      $('#modalRoot').innerHTML='';
      $('#app').innerHTML=renderTeamOnboarding();
      bindPriorityTouchControls();
      return;
    }
    $('#app').innerHTML=renderShell();
    renderPage();
  }

  function bindPriorityTouchControls(){
    // iOS/Safari-safe direct handlers for the controls that must never depend on
    // delegated event bubbling. Each render creates fresh DOM nodes, so binding
    // directly here avoids the old pointer/touch/click race.
    const activate=(el,fn)=>{
      if(!el || el.dataset.priorityBound==='1') return;
      el.dataset.priorityBound='1';
      let locked=false;
      const run=(e)=>{
        if(e){e.preventDefault(); e.stopPropagation();}
        if(locked)return;
        locked=true;
        fn(e);
        setTimeout(()=>{locked=false;},450);
      };
      el.addEventListener('touchend',run,{passive:false});
      el.addEventListener('pointerup',run,{passive:false});
      el.addEventListener('click',run);
    };
    $$('.team-select-card').forEach(el=>activate(el,()=>choosePendingTeam(el.dataset.selectTeam)));
    $$('[data-club-continue]').forEach(el=>activate(el,()=>commitTeamSelection()));
    $$('[data-new-game-flow],[data-reset],[data-confirm-reset]').forEach(el=>activate(el,()=>startNewGameFlow()));
    $$('[data-close],.close-btn').forEach(el=>activate(el,()=>closeModal()));
  }

  function openModal(title,body,opts={}){
    const root=$('#modalRoot'); if(!root)return;
    const showClose=opts.hideClose!==true && !state.liveMatch;
    root.innerHTML=`<div class="modal-layer ${opts.full?'full':''}" id="activeModal"><div class="modal-sheet"><div class="modal-bar"><div>${opts.kicker?`<span>${esc(opts.kicker)}</span>`:''}<strong>${title}</strong></div>${showClose?`<button type="button" class="close-btn" data-close aria-label="Fenster schließen">×</button>`:''}</div><div class="modal-body">${body}</div>${opts.footer??''}</div></div>`;
    if(!opts.lock)$('#activeModal')?.addEventListener('click',e=>{if(e.target.id==='activeModal')closeModal();});
    bindPriorityTouchControls();
  }
  function closeModal(){$('#modalRoot').innerHTML='';}

  function showWelcome(){
    if(!state.firstRun || state.teamChosen || state.introStage!=='welcome') return;
    openModal('WILLKOMMEN BEIM EISHOCKEY WORLD CUP 27',`<div class="welcome-intro"><div class="welcome-intro-logo"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"></div><h2>EISHOCKEY WORLD CUP 27 · MANAGER</h2><p><b>INTERNATIONAL EDITION · 2027</b></p><p>Wähle anschließend dein Nationalteam und starte deine Managerkarriere im Eishockey World Cup 27.</p><div class="welcome-save-note">💾 Unter <b>Einstellungen</b> kannst du jederzeit speichern, exportieren, importieren oder ein neues Spiel starten.</div><button class="gold-btn wide" data-intro-next>LOSLEGEN</button></div>`,{lock:true,kicker:'START · WILLKOMMEN'});
  }
  function showNationSelection(){
    state.introStage='club'; state.pendingTeamId=state.pendingTeamId||null;
    const leagueData=[['L1','WORLD CUP A · TOP DIVISION'],['L2','WORLD CUP B · ELITE DIVISION'],['L3','WORLD CUP C · CHALLENGER']];
    const tabs=leagueData.map(([id,label])=>`<div class="team-select-group"><h3>${label}</h3><div class="team-select-grid">${state.leagues[id].teams.map(tid=>{const t=state.teams[tid];return `<button type="button" class="team-select-card ${state.pendingTeamId===tid?'selected':''}" data-select-team="${tid}"><img class="club-crest" src="${crest(t)}" alt="${esc(t.name)}"><strong>${esc(t.name)}</strong><small>${esc(t.city)}</small><em>OVR ${Math.round(teamStrength(t))}</em></button>`}).join('')}</div></div>`).join('');
    openModal('DEINE NATION · WÄHLE DEIN NATIONALTEAM',`<div class="welcome-art"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"><strong>WORLD CUP 27 · INTERNATIONAL</strong><span>24 NATIONS · 3 DIVISIONEN</span></div><p class="modal-copy">Bevor du startest, wählst du den Nation, den du als Manager übernimmst. Tippe zuerst auf ein Nationalteam. Erst danach wird <b>WEITER</b> freigeschaltet.</p><label class="input-label">Managername<input class="text-input" id="welcomeManager" value="${esc(state.manager)}"></label><div class="team-select-scroll">${tabs}</div><div class="club-selection-footer"><span>${state.pendingTeamId?`Ausgewählt: <b>${esc(state.teams[state.pendingTeamId]?.name||'Nationalteam')}</b>`:'Noch kein Team ausgewählt.'}</span><button type="button" class="gold-btn wide" data-club-continue ${state.pendingTeamId?'':'disabled'}>WEITER</button></div>`,{lock:true,kicker:'START · NATION WÄHLEN',full:false});
  }
  function choosePendingTeam(id){
    const t=state.teams[id]; if(!t)return; state.pendingTeamId=t.id; state.selectedCountry=t.country;
    $$('.team-select-card').forEach(b=>b.classList.toggle('selected',b.dataset.selectTeam===id));
    const note=document.querySelector('.club-selection-footer span'); if(note)note.innerHTML=`Ausgewählt: <b>${esc(t.name)}</b> · ${esc(t.city)}`;
    const btn=document.querySelector('[data-club-continue]'); if(btn){btn.disabled=false;btn.classList.remove('disabled');}
  }
  function commitTeamSelection(){
    const t=state.teams[state.pendingTeamId];
    if(!t){toast('Nation auswählen','Bitte zuerst ein Land antippen.');return;}
    configureActiveLeaguesForSelectedTeam(t.id);
    state.userTeamId=t.id;
    state.selectedCountry=t.country;
    state.market=generateMarket(60,t.country);
    state.manager=(document.querySelector('#welcomeManager')?.value||state.manager||'Manager').trim()||'Manager';
    t.sponsor=t.sponsor||{...SPONSORS[0]};
    state.teamChosen=true; state.firstRun=false; state.introStage='done'; state.pendingTeamId=null; state.active='home';
    saveState();
    render();
    setTimeout(()=>{toast('NATION GEWÄHLT',`${t.name} · ${t.city}`); showNewsLaunchPopup();},80);
  }

  function openPlayer(id){
    let p=currentTeam().roster.find(x=>x.id===id)||state.market.find(x=>x.id===id);
    if(!p){for(const tm of Object.values(state.teams||{})){p=tm.roster?.find(x=>x.id===id);if(p)break;}}
    if(!p)return;
    const own=p.teamId===currentTeam().id;
    openModal(esc(p.name),`<div class="player-modal"><img src="${playerAvatar(p,p.teamColor)}"><div><span>${marketLabel(p.pos)} · ${p.age} J. · ${esc(p.nationality||'DE')}</span><strong>${p.rating} OVR</strong><p>Form ${p.form}% · Marktwert ${money(p.value)} · ${money(p.salary)}/W</p><small>${esc(p.bio||'Fiktiver Nationalspieler.')}</small></div></div><div class="attrs-grid">${Object.entries({Tempo:p.skill.pace,Schuss:p.skill.shoot,Pass:p.skill.pass,Def:p.skill.def,Kontrolle:p.skill.control,Mental:p.skill.lead}).map(([k,v])=>`<div><b>${v}</b><span>${k}</span></div>`).join('')}</div><div class="profile-meta"><span>📄 Vertrag <b>${p.contractYears||2} Jahre</b></span><span>🏒 Spiele <b>${p.games||0}</b></span><span>🥅 Tore <b>${p.goals||0}</b></span><span>🅰️ Vorlagen <b>${p.assists||0}</b></span></div>${own?`<button type="button" class="gold-btn wide" data-renew-contract="${p.id}">VERTRAG VERLÄNGERN / NEU VERHANDELN</button>`:''}`,{kicker:own?'SPIELER · VERTRAG':'SPIELERPROFIL'});
  }

  function addFriendly(){
    const t=currentTeam(), candidates=Object.values(state.teams).filter(x=>x.id!==t.id);
    const body=`<p class="modal-copy">Wähle einen Gegner aus der Region. Freundschaftsspiele verändern die Ligatabelle nicht, bringen aber Einnahmen und Form.</p><select class="text-input" id="friendlyOpp">${candidates.map(x=>`<option value="${x.id}">${esc(x.name)} · ${esc(x.city)}</option>`).join('')}</select><label class="check-row"><input id="friendlyHome" type="checkbox" checked> Heimspiel</label><button class="gold-btn wide" data-create-friendly>SPIEL ANSETZEN</button>`;
    openModal('SPIEL HINZUFÜGEN',body,{kicker:'FREUNDSCHAFT'});
  }

  function createFriendly(){
    const oppId=$('#friendlyOpp')?.value, home=$('#friendlyHome')?.checked; if(!oppId)return;
    const t=currentTeam(); const game={id:uid('f'),home:home?t.id:oppId,away:home?oppId:t.id,round:0,played:false,result:null,type:'Freundschaft',createdAt:Date.now()};
    state.friendlies.push(game); addNews('Freundschaftsspiel angesetzt',`${state.teams[game.home].name} vs. ${state.teams[game.away].name}`,'games'); saveState(); closeModal(); state.active='games'; render(); toast('Spiel angesetzt','Der Termin liegt im Spiele-Menü.');
  }

  function simulateButton(){
    if(state.liveMatch)return;
    const leagueGame=nextUserGame();
    if(leagueGame){
      prepareLeagueMatchday(leagueGame);
      startLiveMatch(leagueGame,'league');
      return;
    }
    const friendly=state.friendlies.find(g=>!g.played); if(friendly){startLiveMatch(friendly,'friendly');return;}
    finishSeason();
  }

  function leagueForGame(game){
    if(!game)return null;
    for(const [id,l] of Object.entries(state.leagues||{})){
      if((l.schedule||[]).some(g=>g.id===game.id)) return {id,l};
    }
    return null;
  }

  function prepareLeagueMatchday(game){
    const found=leagueForGame(game);
    if(!found||game.played)return;
    const key=`${found.id}:${game.round}`;
    state.matchdayPrepared=state.matchdayPrepared||{};
    if(state.matchdayPrepared[key])return;
    const results=simulateOtherGames(game.round,game.id,true);
    state.matchdayPrepared[key]=true;
    state.matchdayBrief=Array.isArray(results)?results.slice(0,8):[];
    saveState();
  }

  function finishSeason(){
    const l=currentLeague(), sorted=standings(l), idx=sorted.findIndex(x=>x.teamId===state.userTeamId); let text=`Platz ${idx+1}.`;
    if(idx<=1 && l.level>1){moveLeague(l.level,l.level-1);text+=' Aufstieg!';currentTeam().titles += idx===0?1:0;}
    else if(idx>=sorted.length-2 && l.level<3){moveLeague(l.level,l.level+1);text+=' Abstieg.';}
    state.season++;state.week=1;state.date=new Date(state.date.getTime()+35*86400000);
    Object.values(state.leagues).forEach(ll=>{Object.keys(ll.standings).forEach(id=>ll.standings[id]={teamId:id,played:0,wins:0,draws:0,losses:0,gf:0,ga:0,gd:0,points:0});ll.schedule=roundRobin(ll.teams);});
    currentTeam().roster.forEach(p=>{if(p.age<23 && Math.random()<.65)p.rating=clamp(p.rating+1,45,97);p.form=clamp(p.form+Math.round(Math.random()*8-4),55,99);});
    addNews('Neue Saison',text,'trophy');saveState();render();toast('Saison abgeschlossen',text);
  }

  function moveLeague(from,to){
    const a=state.leagues['L'+from], b=state.leagues['L'+to]; a.teams=a.teams.filter(id=>id!==state.userTeamId); if(!b.teams.includes(state.userTeamId))b.teams[b.teams.length-1] && b.teams.push(state.userTeamId); const excess=a.teams[a.teams.length-1]; if(excess && !b.teams.includes(excess))b.teams[b.teams.length-1]=excess;
  }

  function matchStrengthSnapshot(home,away,weather){
    const h=teamStrength(home)*(weather?.mult||1)*(home.id===state.userTeamId?1.06:1); const a=teamStrength(away)*(weather?.mult||1); return {h,a};
  }

  function liveClock(ms){const s=Math.max(0,Math.floor(ms/1000));return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}

  function createLiveSim(H,A){
    const homeBases=[[8,50],[28,30],[28,70],[48,35],[53,50]], awayBases=[[92,50],[72,70],[72,30],[52,65],[47,50]];
    const makeSide=(team,side,bases)=>team.roster.slice().sort((a,b)=>Number(!!b.isG)-Number(!!a.isG)).slice(0,6).map((p,i)=>({id:p.id,name:p.name,pos:p.pos,rating:p.rating,side,index:i,x:bases[i][0],y:bases[i][1],bx:bases[i][0],by:bases[i][1]}));
    return {players:{home:makeSide(H,'home',homeBases),away:makeSide(A,'away',awayBases)},ball:{x:53,y:50,side:'home',index:4,mode:'hold',sx:53,sy:50,tx:53,ty:50,start:0,duration:0},nextDecisionAt:performance.now()+900,lastCommentAt:0,action:null,phase:'kickoff'};
  }

  const PERIOD_MS=60000, PERIOD_BREAK_MS=3000, TOTAL_MATCH_MS=PERIOD_MS*3+PERIOD_BREAK_MS*2;

  function openPreMatch(game,type){
    const H=state.teams[game.home],A=state.teams[game.away];if(!H||!A)return;const weather=pick(WEATHER),hs=Math.round(teamStrength(H)*(H.id===state.userTeamId?1.05:1)),as=Math.round(teamStrength(A));
    openModal('SPIELVORDEREITUNG',`<div class="pregame-card"><div class="pregame-cover"><img src="assets/screens/hockey-world-cup-27.jpg" alt="EISHOCKEY WORLD CUP 27"><span>EISHOCKEY WORLD CUP 27 · MATCHDAY</span></div><div class="pregame-teams"><div><img class="club-crest" src="${crest(H)}"><strong>${esc(H.name)}</strong><small>HEIM</small><b>${hs} OVR</b></div><span>VS</span><div><img class="club-crest" src="${crest(A)}"><strong>${esc(A.name)}</strong><small>AUSWÄRTS</small><b>${as} OVR</b></div></div><div class="pregame-stats"><span>🌤️ ${weather.icon} ${weather.name}</span><span>🏟️ ${esc(game.home===H.id?H.stadium.name:A.stadium.name)}</span><span>📅 ${dateDE(state.date)} · 18:00</span></div><div class="pregame-form"><div><b>FORM</b><span>${(H.form||[]).slice(-5).join(' ')}</span></div><div><b>FORM</b><span>${(A.form||[]).slice(-5).join(' ')}</span></div></div><button class="gold-btn wide" data-start-match="${game.id}" data-start-match-type="${type}">SPIEL STARTEN · 3:00</button><p class="modal-copy">Die Partie wird live simuliert. Alle anderen Spiele des Spieltags werden jetzt zuerst automatisch simuliert und erscheinen kurz vor dem Bully.</p></div>`,{kicker:'MATCHDAY'});
  }

  function startLiveMatch(game,type){
    if(type==='league') prepareLeagueMatchday(game);
    const H=state.teams[game.home], A=state.teams[game.away], weather=pick(WEATHER); if(!H||!A)return;
    state.liveMatch={
      gameId:game.id,type,home:H.id,away:A.id,hg:0,ag:0,weather,
      started:performance.now(),elapsed:0,matchClock:0,phase:'first',period:1,breakShown:{},
      duration:TOTAL_MATCH_MS,
      events:[...(Array.isArray(state.matchdayBrief)?state.matchdayBrief.map(x=>({t:0,text:x.text,kind:'round'})):[]),{t:0,text:`BULLY · ${weather.icon} ${weather.name}` ,kind:'start'}],
      possession:50,shotsH:0,shotsA:0,cornersH:0,cornersA:0,penaltiesH:0,penaltiesA:0,fouls:0,powerPlay:null,
      savesH:0,savesA:0,yellowH:0,yellowA:0,
      sim:createLiveSim(H,A)
    };
    renderLiveMatch();
    cancelAnimationFrame(window.__liveRAF);
    window.__liveRAF=requestAnimationFrame(runLiveFrame);
  }

  function runLiveFrame(now){
    const lm=state.liveMatch;if(!lm)return;
    try{
      lm.elapsed=now-lm.started;
      const p1End=PERIOD_MS, p2End=PERIOD_MS*2+PERIOD_BREAK_MS, p3End=TOTAL_MATCH_MS;
      if(lm.elapsed>=p3End){
        lm.elapsed=p3End; lm.matchClock=PERIOD_MS*3; lm.phase='third'; lm.period=3;
        updateLiveDOM(now); finishLiveMatch(); return;
      }
      if(lm.elapsed<PERIOD_MS){
        lm.matchClock=lm.elapsed;lm.phase='first';lm.period=1;
      }else if(lm.elapsed<PERIOD_MS+PERIOD_BREAK_MS){
        lm.matchClock=PERIOD_MS;lm.phase='break1';lm.period=1;
        if(!lm.breakShown[1]){lm.breakShown[1]=true;addLiveEvent(`1. DRITTEL ENDE · ${lm.hg}:${lm.ag}`,'halftime');showPeriodBreakOverlay(1);}
        updateLiveDOM(now);window.__liveRAF=requestAnimationFrame(runLiveFrame);return;
      }else if(lm.elapsed<PERIOD_MS*2+PERIOD_BREAK_MS){
        lm.matchClock=PERIOD_MS+(lm.elapsed-(PERIOD_MS+PERIOD_BREAK_MS));lm.phase='second';lm.period=2;hideHalftimeOverlay();
      }else if(lm.elapsed<PERIOD_MS*2+PERIOD_BREAK_MS*2){
        lm.matchClock=PERIOD_MS*2;lm.phase='break2';lm.period=2;
        if(!lm.breakShown[2]){lm.breakShown[2]=true;addLiveEvent(`2. DRITTEL ENDE · ${lm.hg}:${lm.ag}`,'halftime');showPeriodBreakOverlay(2);}
        updateLiveDOM(now);window.__liveRAF=requestAnimationFrame(runLiveFrame);return;
      }else{
        if(lm.phase==='break2')hideHalftimeOverlay();
        lm.matchClock=PERIOD_MS*2+(lm.elapsed-(PERIOD_MS*2+PERIOD_BREAK_MS*2));lm.phase='third';lm.period=3;
      }
      if(lm.powerPlay && lm.powerPlay.until<=now){ lm.powerPlay=null; addLiveEvent('POWERPLAY ENDE · Vollzählig.','neutral'); }
      updateLiveSimulation(now);
      updateLiveDOM(now);
      window.__liveRAF=requestAnimationFrame(runLiveFrame);
    }catch(err){
      console.error('Live-Simulation Fehler:',err);
      lm.matchClock=PERIOD_MS*3;lm.phase='third';lm.period=3;
      try{finishLiveMatch(true);}catch(finalErr){
        console.error('Live-Abpfiff Fehler:',finalErr);
        cancelAnimationFrame(window.__liveRAF);window.__liveRAF=null;state.liveMatch=null;saveState();renderPage();toast('Spiel beendet','Das Ergebnis wurde sicher gespeichert.');
      }
    }
  }

  function findSimPlayer(lm,side,index){return lm.sim.players[side]?.[index]||null}
  function currentHolder(lm){return findSimPlayer(lm,lm.sim.ball.side,lm.sim.ball.index)}
  function otherSide(side){return side==='home'?'away':'home'}
  function attackDir(side){return side==='home'?1:-1}
  function distance(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
  function nearestOpponent(lm,p){
    const opp=lm.sim.players[otherSide(p.side)]||[];
    return opp.reduce((best,x)=>!best||distance(p,x)<distance(p,best)?x:best,null);
  }
  function addLiveEvent(text,kind='neutral'){
    const lm=state.liveMatch;if(!lm)return;
    lm.events.unshift({t:Math.floor(lm.matchClock/1000),text,kind});
    lm.events=lm.events.slice(0,12);
    updateLiveFeedOnly();
    const label=$('#liveActionLabel');if(label){label.textContent=kind==='goal'?'TOR!':kind.toUpperCase();}
  }
  function currentGoalX(side){return side==='home'?100:0}

  function setupBallTravel(lm,toSide,toIndex,duration,mode,tx=null,ty=null){
    const b=lm.sim.ball, holder=currentHolder(lm);
    b.mode=mode;b.sx=b.x;b.sy=b.y;
    const target=findSimPlayer(lm,toSide,toIndex);
    b.tx=tx??target?.x??b.x;b.ty=ty??target?.y??b.y;
    b.start=performance.now();b.duration=duration;b.side=toSide;b.index=toIndex;b.arc=(mode==='shot'||mode==='cross'||mode==='corner')?.35:.08;
    if(holder){holder.bx=holder.x;holder.by=holder.y;}
  }

  function choosePassTarget(lm,holder){
    const mates=(lm.sim.players[holder.side]||[]).filter(p=>p.index!==holder.index);
    if(!mates.length)return null;
    const dir=attackDir(holder.side);
    const opp=lm.sim.players[otherSide(holder.side)]||[];
    const score=p=>{
      const forward=dir*(p.x-holder.x);
      const lane=opp.length?Math.min(...opp.map(o=>distance(p,o))):40;
      const lateral=Math.abs(p.y-holder.y);
      return forward*2.0 + lane*1.35 - lateral*0.16 - distance(p,holder)*0.12 + Math.random()*2.5;
    };
    return mates.sort((a,b)=>score(b)-score(a))[0] || mates[0];
  }

  function chooseSetPiece(lm,holder,now,type){
    const side=holder.side, dir=attackDir(side);
    const nearGoal=(dir>0&&holder.x>88)||(dir<0&&holder.x<12);
    if(type==='corner'){
      const x=dir>0?97:3, y=Math.random()<.5?8:92;
      lm.sim.action={type:'corner',side,index:holder.index,startX:x,startY:y,tx:dir>0?83:17,ty:50,start:now,duration:1100};
      lm.sim.ball.x=x;lm.sim.ball.y=y;lm.sim.ball.sx=x;lm.sim.ball.sy=y;lm.sim.ball.mode='corner';lm.sim.ball.tx=dir>0?78:22;lm.sim.ball.ty=50;lm.sim.ball.start=now;lm.sim.ball.duration=1100;lm.sim.ball.arc=.7;
      lm[side==='home'?'cornersH':'cornersA']++;
      addLiveEvent(`ANLAUF! ${side==='home'?'World Cup Arena':'Away Arena'} bringt den Puck vor das Tor.`,'corner');
      return;
    }
    if(type==='throw'){
      const x=dir>0?Math.random()*90+4:Math.random()*90+6; const y=Math.random()<.5?3:97;
      const target=choosePassTarget(lm,holder)||holder;
      lm.sim.action={type:'throw',side,index:target.index,startX:x,startY:y,tx:target.x,ty:target.y,start:now,duration:800};
      lm.sim.ball.x=x;lm.sim.ball.y=y;lm.sim.ball.sx=x;lm.sim.ball.sy=y;lm.sim.ball.mode='throw';lm.sim.ball.tx=target.x;lm.sim.ball.ty=target.y;lm.sim.ball.start=now;lm.sim.ball.duration=800;lm.sim.ball.arc=.45;
      addLiveEvent(`BULLY · ${target.name.split(' ')[0]} bekommt den Ball.`,'throw');
      return;
    }
    const tx=dir>0?78:22,ty=clamp(50+(Math.random()-.5)*25,25,75);
    lm.sim.action={type:'free',side,index:holder.index,startX:holder.x,startY:holder.y,tx,ty,start:now,duration:950};
    lm.sim.ball.mode='free';lm.sim.ball.sx=holder.x;lm.sim.ball.sy=holder.y;lm.sim.ball.tx=tx;lm.sim.ball.ty=ty;lm.sim.ball.start=now;lm.sim.ball.duration=950;lm.sim.ball.arc=.45;
    addLiveEvent(`POWERPLAY · ${holder.name.split(' ')[0]} bringt ihn scharf rein.`,'free');
  }

  function chooseLiveAction(now){
    const lm=state.liveMatch,sim=lm.sim,b=sim.ball,holder=currentHolder(lm);if(!holder)return;
    const goalX=currentGoalX(holder.side),goalDist=Math.abs(goalX-b.x),opp=nearestOpponent(lm,holder);
    const underPressure=opp&&distance(holder,opp)<11;
    const nearSideline=b.y<7||b.y>93, nearGoal=(holder.side==='home'?b.x>88:b.x<12);
    const r=Math.random();

    if(r<0.045){
      const side=holder.side, penaltySeconds=15000;
      lm.powerPlay={side,until:now+penaltySeconds}; lm[side==='home'?'penaltiesH':'penaltiesA']++;
      addLiveEvent(`STRAFZEIT · ${side==='home'?state.teams[lm.home]?.name||'Heim':state.teams[lm.away]?.name||'Gäste'} · 2 MINUTEN POWERPLAY`,'card');
      resetForRestart(lm,otherSide(side),'faceoff',now);return;
    }
    if(r<0.095){ addLiveEvent(`ICING · Bully in der ${holder.side==='home'?'Heim-':'Gäste-'}Zone.`,'tackle'); resetForRestart(lm,otherSide(holder.side),'faceoff',now); return; }
    if(r<0.135){ addLiveEvent(`ABSEITS · Bully an der blauen Linie.`,'neutral'); resetForRestart(lm,otherSide(holder.side),'faceoff',now); return; }
    if(r<0.19){ addLiveEvent(`BULLY · Puck wird neu eingeworfen.`,'throw'); resetForRestart(lm,pick(['home','away']),'faceoff',now); return; }

    if(goalDist<30 && r<0.58){
      const tx=goalX===100?99:1, ty=clamp(50+(Math.random()-.5)*35,18,82);
      sim.action={type:'shot',side:holder.side,index:holder.index,startX:b.x,startY:b.y,tx,ty,start:now,duration:650+Math.random()*300};
      b.mode='shot';b.sx=b.x;b.sy=b.y;b.tx=tx;b.ty=ty;b.start=now;b.duration=sim.action.duration;b.arc=.62;
      lm[holder.side==='home'?'shotsH':'shotsA']++;
      addLiveEvent(`SCHUSS! ${holder.name.split(' ')[0]} zieht ab.`,'shot');return;
    }

    if(underPressure&&r<0.30){
      const side=otherSide(holder.side), defenders=lm.sim.players[side]||[];
      const target=defenders.reduce((best,p)=>!best||distance(p,holder)<distance(best,holder)?p:best,null);
      if(target){
        sim.action={type:'tackle',side,index:target.index,startX:b.x,startY:b.y,tx:target.x,ty:target.y,start:now,duration:430};
        setupBallTravel(lm,side,target.index,430,'tackle',target.x,target.y);
        addLiveEvent(`ZWEIKAMPF! ${target.name.split(' ')[0]} geht dazwischen.`,'tackle');return;
      }
    }

    if(nearGoal&&r<0.76){
      const tx=goalX===100?90:10,ty=clamp(50+(Math.random()-.5)*40,18,82);
      const target=choosePassTarget(lm,holder)||holder;
      sim.action={type:'cross',side:holder.side,index:holder.index,startX:b.x,startY:b.y,tx:target.x,ty:ty,start:now,duration:900};
      b.mode='cross';b.sx=b.x;b.sy=b.y;b.tx=tx;b.ty=ty;b.start=now;b.duration=900;b.arc=.9;
      addLiveEvent(`${holder.name.split(' ')[0]} schlägt die Pass in den Slot.`,'cross');return;
    }

    if(r<0.74){
      const target=choosePassTarget(lm,holder);
      if(target&&target!==holder){
        const d=distance(holder,target);
        // Receiver moves only a little into a passing lane; other teammates hold shape.
        const laneX=clamp(target.x+attackDir(holder.side)*(2+Math.random()*4),8,92);
        const laneY=clamp(target.y+(Math.random()-.5)*5,12,88);
        sim.action={type:'pass',side:target.side,index:target.index,startX:b.x,startY:b.y,tx:laneX,ty:laneY,start:now,duration:420+d*8};
        setupBallTravel(lm,target.side,target.index,sim.action.duration,'pass',target.x,target.y);
        addLiveEvent(`${holder.name.split(' ')[0]} spielt den Pass auf ${target.name.split(' ')[0]}.`,'pass');return;
      }
    }

    // Carry/dribble
    const step=(5+Math.random()*10)*attackDir(holder.side);
    holder.x=clamp(holder.x+step,6,94);
    holder.y=clamp(holder.y+(Math.random()-.5)*16,10,90);
    sim.action={type:'dribble',side:holder.side,index:holder.index,startX:b.x,startY:b.y,tx:holder.x,ty:holder.y,start:now,duration:620+Math.random()*400};
    b.mode='dribble';b.sx=b.x;b.sy=b.y;b.tx=holder.x;b.ty=holder.y;b.start=now;b.duration=sim.action.duration;b.arc=.02;
    addLiveEvent(`${holder.name.split(' ')[0]} nimmt Tempo auf und dribbelt.`,'dribble');
  }

  function updateLiveSimulation(now){
    const lm=state.liveMatch,sim=lm.sim,b=sim.ball,holder=currentHolder(lm);
    const homeShape=[[7,50],[27,30],[27,70],[47,37],[49,63]];
    const awayShape=[[93,50],[73,70],[73,30],[53,63],[51,37]];

    // Maintain a compact 5-a-side shape. Only the ball holder, one support runner,
    // and the nearest defender react strongly to the ball; everyone else preserves spacing.
    const holderSide=b.side;
    const holderIndex=b.index;
    const holderObj=currentHolder(lm);
    const supportCandidates=holderObj?(sim.players[holderSide]||[]).filter(p=>p.index!==holderIndex):[];
    let support=supportCandidates.length?supportCandidates.reduce((best,p)=>{
      const d=distance(p,holderObj);return !best||d<best.d?{p,d}:best;
    },null)?.p:null;
    const forwardRunner=supportCandidates.length?supportCandidates.filter(p=>p!==support).reduce((best,p)=>{
      const prog=attackDir(holderSide)*p.x;return !best||prog>best.prog?{p,prog}:best;
    },null)?.p:null;

    for(const side of ['home','away']){
      const players=sim.players[side]||[];
      const base=side==='home'?homeShape:awayShape;
      const attacking=side===holderSide;
      const dir=attackDir(side);
      players.forEach((p,i)=>{
        const [bx,by]=base[i];
        const ballShiftX=clamp((b.x-50)*0.12*dir,-7,7);
        const ballShiftY=clamp((b.y-50)*0.10,-7,7);
        let targetX=bx+ballShiftX;
        let targetY=by+ballShiftY;

        // Team in possession stretches the pitch without collapsing toward the ball.
        if(attacking){
          targetX+=dir*5;
          if(p===holderObj){targetX=b.x;targetY=b.y;}
          else if(p===support){
            targetX=clamp((holderObj?.x||bx)+dir*12,10,90);
            targetY=clamp(by+(b.y-by)*0.32,15,85);
          }else if(p===forwardRunner){
            targetX=clamp((holderObj?.x||bx)+dir*24,14,86);
            targetY=clamp(by+(Math.random()-.5)*2,12,88);
          }
        }else{
          // Defending side: one presser, one cover player, three retain shape.
          const opponents=sim.players[otherSide(side)]||[];
          const nearest=opponents.reduce((best,o)=>!best||distance(p,o)<distance(best,o)?o:best,null);
          const pressTarget=holderObj&&nearest&&nearest.side===holderObj.side;
          const isPress=(pressTarget && distance(p,holderObj)<30 && (i===1||i===2));
          if(isPress){
            targetX=clamp((p.x*0.35)+(b.x*0.65)-dir*3,8,92);
            targetY=clamp((p.y*0.35)+(b.y*0.65),14,86);
          }else if(i===3 && holderObj){
            targetX=clamp(b.x-dir*16,12,88);
            targetY=clamp(by+(b.y-by)*0.20,18,82);
          }
        }

        if(sim.action && sim.action.side===side && sim.action.index===i){
          // Active ball carrier follows the action; receivers move into their lane, not onto the ball.
          if(sim.action.type==='dribble'||sim.action.type==='tackle'){targetX=b.x;targetY=b.y;}
          else if(sim.action.type==='pass') {targetX=sim.action.tx;targetY=sim.action.ty;}
        }

        const smooth=(p===holderObj?0.32:(support===p||forwardRunner===p?0.12:0.075));
        p.x+= (targetX-p.x)*smooth;
        p.y+= (targetY-p.y)*smooth;
        p.x=clamp(p.x,4,96);p.y=clamp(p.y,6,94);
      });
    }

    // Ball movement is tied to the active action, not to a free camera pan.
    if(sim.action){
      const a=sim.action,prog=clamp((now-a.start)/a.duration,0,1);
      const e=prog<.5?2*prog*prog:1-Math.pow(-2*prog+2,2)/2;
      b.x=a.startX+(a.tx-a.startX)*e;b.y=a.startY+(a.ty-a.startY)*e;
      b.z=Math.sin(Math.PI*e)*(b.arc||0);
      const actor=findSimPlayer(lm,a.side,a.index);
      if(actor&&(a.type==='dribble'||a.type==='tackle')){actor.x=b.x;actor.y=b.y;}
      if(prog>=1)resolveLiveAction(now,a);
    }else{
      const liveHolder=currentHolder(lm);
      if(liveHolder&&b.mode==='hold'){b.x=liveHolder.x+attackDir(liveHolder.side)*1.1;b.y=liveHolder.y-2.5;b.z=0;}
      if(now>=sim.nextDecisionAt)chooseLiveAction(now);
    }

    // Occasional match atmosphere without affecting positioning.
    if(!sim.nextIncidentAt)sim.nextIncidentAt=now+4500+Math.random()*6500;
    if(now>sim.nextIncidentAt&&!sim.action){
      const h=currentHolder(lm);
      if(h&&Math.random()<0.5)addLiveEvent(`TRIBÜNENRAUSCHEN · ${h.side==='home'?'Heimfans':'Gästeblock'} werden laut.`,'crowd');
      sim.nextIncidentAt=now+6000+Math.random()*9000;
    }
    lm.possession=clamp(lm.possession+(b.side==='home'?0.055:-0.055),30,70);
  }

  function resolveLiveAction(now,a){
    const lm=state.liveMatch,sim=lm.sim,b=sim.ball;
    if(!sim.action)return;
    const keeperH=sim.players.home?.[0], keeperA=sim.players.away?.[0];
    if(a.type==='faceoff'){
      const side=a.side||pick(['home','away']); const idx=side==='home'?4:4; b.mode='hold';b.side=side;b.index=idx;b.x=50;b.y=50;b.z=0;sim.nextDecisionAt=now+350+Math.random()*450;addLiveEvent(`BULLY · ${state.teams[side==='home'?lm.home:lm.away]?.name||'Team'} gewinnt den ersten Puck.`,'throw'); sim.action=null; return;
    }
    if(a.type==='shot'){
      const keeper=otherSide(a.side)==='home'?keeperH:keeperA;
      const shooter=findSimPlayer(lm,a.side,a.index);
      const power=shooter?.rating||68;
      const distToGoal=Math.abs(currentGoalX(a.side)-b.x);
      const powerBonus=(lm.powerPlay&&lm.powerPlay.side===a.side&&lm.powerPlay.until>now)?0.10:0;
      const onTarget=0.48+clamp((power-60)/220,-.12,.14)-distToGoal/260+powerBonus;
      const roll=Math.random();
      if(roll<onTarget){
        const saveRoll=Math.random();
        if(saveRoll<0.30){
          if(a.side==='home')lm.savesA++;else lm.savesH++;
          if(keeper){keeper.x=a.side==='home'?94:6;keeper.y=b.y;keeper.saveAnim=now;}
          addLiveEvent(`PARADE! ${keeper?.name?.split(' ')[0]||'Der Keeper'} lenkt den Ball um den Pfosten.`,'save');
          resetForRestart(lm,otherSide(a.side),'corner',now); 
        }else if(saveRoll<0.40){
          addLiveEvent('PFORWEN! Der Ball klatscht gegen den Pfosten.','chance');
          resetForRestart(lm,otherSide(a.side),'goalKick',now);
        }else{
          if(a.side==='home')lm.hg++;else lm.ag++;
          if(shooter){const real=state.teams[a.side==='home'?lm.home:lm.away].roster.find(p=>p.id===shooter.id);if(real){real.goals++;real.form=clamp(real.form+3,50,100);}}
          addLiveEvent(`TOOOR!!! ${shooter?.name?.split(' ')[0]||'Angreifer'} trifft · ${lm.hg}:${lm.ag}`,'goal');
          const flash=$('#liveGoalFlash');if(flash){flash.classList.remove('show');void flash.offsetWidth;flash.classList.add('show');}
          celebrateGoal(lm,a.side,now);
          setTimeout(()=>resetAfterGoal(a.side),900);
          sim.action=null;return;
        }
      }else{
        addLiveEvent(Math.random()<.55?'KNAPP! Der Abschluss geht am Tor vorbei.':'BLOCK! Die Abwehr wirft sich dazwischen.','chance');
        resetForRestart(lm,otherSide(a.side),'goalKick',now);
      }
    }else if(a.type==='pass'||a.type==='throw'){
      b.mode='hold';b.side=a.side;b.index=a.index;b.x=a.tx;b.y=a.ty;b.z=0;sim.nextDecisionAt=now+180+Math.random()*420;
      if(a.type==='throw')addLiveEvent(`Bully · Puck wieder im Spiel.`,'throw');
    }else if(a.type==='cross'||a.type==='corner'||a.type==='free'){
      // Cross/set-piece creates an immediate attacking duel or header.
      const attacking=a.side, opponents=sim.players[otherSide(attacking)]||[];
      const target=findSimPlayer(lm,attacking,Math.min(a.index+1,4))||currentHolder(lm);
      if(Math.random()<0.5){
        const shooter=target||currentHolder(lm);
        const tx=currentGoalX(attacking)===100?98:2;
        sim.action={type:'header',side:attacking,index:shooter?.index||4,startX:b.x,startY:b.y,tx,ty:50+(Math.random()-.5)*25,start:now,duration:600};
        b.mode='shot';b.sx=b.x;b.sy=b.y;b.tx=tx;b.ty=50+(Math.random()-.5)*25;b.start=now;b.duration=600;b.arc=.48;
        lm[attacking==='home'?'shotsH':'shotsA']++;
        addLiveEvent(`SCHLAG! ${shooter?.name?.split(' ')[0]||'Angreifer'} zieht ab.`,'header');
      }else{
        const def=opponents[Math.floor(Math.random()*opponents.length)];
        b.mode='hold';b.side=def?.side||otherSide(attacking);b.index=def?.index||0;b.x=def?.x||b.x;b.y=def?.y||b.y;b.z=0;sim.nextDecisionAt=now+300;
        addLiveEvent('GEKLÄRT! Die Abwehr bekommt den Ball weg.','clear');
      }
    }else if(a.type==='tackle'){
      b.mode='hold';b.side=a.side;b.index=a.index;b.z=0;sim.nextDecisionAt=now+250;
    }else if(a.type==='dribble'||a.type==='header'){
      if(a.type==='header'){
        const power=state.teams[a.side==='home'?lm.home:lm.away].roster[a.index]?.rating||68;
        if(Math.random()<0.18+(power-60)/240){
          if(a.side==='home')lm.hg++;else lm.ag++;
          addLiveEvent(`TOOOR!!! Kopfballtreffer · ${lm.hg}:${lm.ag}`,'goal');
          const flash=$('#liveGoalFlash');if(flash){flash.classList.remove('show');void flash.offsetWidth;flash.classList.add('show');}
          celebrateGoal(lm,a.side,now);setTimeout(()=>resetAfterGoal(a.side),900);sim.action=null;return;
        }else{
          addLiveEvent('PARADE! Der Keeper ist dran.','save');resetForRestart(lm,otherSide(a.side),'corner',now);
        }
      }else{
        b.mode='hold';b.side=a.side;b.index=a.index;b.z=0;sim.nextDecisionAt=now+220+Math.random()*420;
      }
    }
    sim.action=null;
  }

  function resetForRestart(lm,side,type,now){
    const sim=lm.sim;
    if(type==='faceoff'){
      sim.action={type:'faceoff',side,index:4,start:now,duration:420};
      sim.ball={x:50,y:50,side,index:4,mode:'faceoff',sx:50,sy:50,tx:50,ty:50,z:.1,start:now,duration:420};
    }else{
      sim.ball={x:50,y:50,side,index:4,mode:'hold',sx:50,sy:50,tx:50,ty:50,z:0,start:0,duration:0};
    }
    sim.nextDecisionAt=now+650+Math.random()*700;
  }
  function resetAfterGoal(scoringSide){
    const lm=state.liveMatch,sim=lm.sim,side=otherSide(scoringSide),homeBases=[[8,50],[27,30],[27,70],[46,34],[50,55]],awayBases=[[92,50],[73,70],[73,30],[54,66],[50,45]];
    sim.players.home.forEach((p,i)=>{p.x=homeBases[i][0];p.y=homeBases[i][1]});
    sim.players.away.forEach((p,i)=>{p.x=awayBases[i][0];p.y=awayBases[i][1]});
    sim.ball={x:50,y:50,side,index:4,mode:'hold',sx:50,sy:50,tx:50,ty:50,z:0,start:0,duration:0};sim.nextDecisionAt=performance.now()+1100;
  }
  function celebrateGoal(lm,side,now){
    const players=lm.sim.players[side]||[];
    players.slice(1).forEach((p,i)=>{p.x=side==='home'?Math.min(92,72+i*4):Math.max(8,28-i*4);p.y=50+(i-1.5)*7;p.celebrate=now;});
    const label=$('#liveActionLabel');if(label){label.textContent='TOR!';label.classList.add('goal');setTimeout(()=>label.classList.remove('goal'),850);}
  }

  function renderLiveMatch(){
    const lm=state.liveMatch,H=state.teams[lm.home],A=state.teams[lm.away];
    const makePlayers=(side,team)=>lm.sim.players[side].map((p,i)=>`<div class="live-player ${side}" data-side="${side}" data-index="${i}"><img src="${playerAvatar(p,team.teamColor,true)}" alt=""><b>${esc(p.name.split(' ')[0])}</b></div>`).join('');
    openModal('LIVE-SPIEL',`
      <div class="live-score"><div><img class="club-crest" src="${crest(H)}" alt=""><strong>${esc(H.name)}</strong></div><div><span class="live-time" id="liveTime">00:00</span><b id="liveScore">0 : 0</b><small id="liveHalfLabel">${esc(lm.weather.name)} · 1. DRITTEL</small></div><div><img class="club-crest" src="${crest(A)}" alt=""><strong>${esc(A.name)}</strong></div></div>
      <div class="live-action-banner" id="liveActionBanner"><span id="liveActionLabel">BULLY</span><small id="liveActionText">Der Ball rollt.</small></div>
      <div class="live-field-wrap">
        <div class="live-field" id="liveField">
          <div class="field-mark center"></div><div class="field-mark line"></div><div class="field-mark box top"></div><div class="field-mark box bottom"></div><div class="field-mark goal left"></div><div class="field-mark goal right"></div>
          ${makePlayers('home',H)}${makePlayers('away',A)}
          <div class="live-ball" id="liveBall"></div>
          <div class="live-goal-flash" id="liveGoalFlash"></div>
          <div class="setpiece-zone" id="setpieceZone"></div>
        </div>
        <div class="live-minimap" id="liveMinimap"></div>
      </div>
      <div class="live-stat-row"><span>Puckbesitz <b id="livePoss">50% · 50%</b></span><span>Schüsse <b id="liveShots">0 · 0</b></span><span>Strafzeiten <b id="liveCorners">0 · 0</b></span></div>
      <div class="live-feed" id="liveFeed">${lm.events.map(e=>`<article class="event ${e.kind}"><small>0:00</small><span>${esc(e.text)}</span></article>`).join('')}</div>
      <div class="live-progress"><div><span id="livePhaseText">1. DRITTEL · ECHTZEIT</span><b id="liveRemaining">01:00</b></div><i><em id="liveBar"></em></i></div>
      <div class="halftime-overlay" id="halfTimeOverlay" aria-hidden="true">
        <div class="halftime-box"><div class="halftime-title">1. DRITTEL ENDE</div><div class="halftime-score"><span>${esc(H.name)}</span><strong id="halfScore">0 : 0</strong><span>${esc(A.name)}</span></div>
        <div class="halftime-stats"><span><b id="halfPossH">50%</b><small>Puckbesitz</small><b id="halfPossA">50%</b></span><span><b id="halfShotsH">0</b><small>Schüsse</small><b id="halfShotsA">0</b></span><span><b id="halfCornersH">0</b><small>Strafzeiten</small><b id="halfCornersA">0</b></span></div><p>Kurze Pause · Taktik wird neu sortiert …</p></div>
      </div>
    </div>`,{lock:true,full:true,kicker:'VORRWAND · LIVEBEOBACHTUNG'});
    updateLiveDOM();
  }

  function showPeriodBreakOverlay(period){
    const lm=state.liveMatch;if(!lm)return;const o=$('#halfTimeOverlay');if(!o)return;
    o.classList.add('show');o.setAttribute('aria-hidden','false');
    const h=Math.round(lm.possession),a=100-h;
    $('#halfScore')&&($('#halfScore').textContent=`${lm.hg} : ${lm.ag}`);
    $('#halfPossH')&&($('#halfPossH').textContent=`${h}%`);$('#halfPossA')&&($('#halfPossA').textContent=`${a}%`);
    $('#halfShotsH')&&($('#halfShotsH').textContent=lm.shotsH);$('#halfShotsA')&&($('#halfShotsA').textContent=lm.shotsA);
    $('#halfCornersH')&&($('#halfCornersH').textContent=lm.penaltiesH||0);$('#halfCornersA')&&($('#halfCornersA').textContent=lm.penaltiesA||0);
    const title=$('.halftime-title');if(title)title.textContent=`${period}. DRITTEL ENDE`;
    const p=$('.halftime-box p');if(p)p.textContent=`Kurze Pause · Gleich startet das ${period+1}. Drittel.`;
  }
  function hideHalftimeOverlay(){const o=$('#halfTimeOverlay');if(o){o.classList.remove('show');o.setAttribute('aria-hidden','true');}}
  function updateLiveFeedOnly(){const feed=$('#liveFeed'),lm=state.liveMatch;if(feed&&lm)feed.innerHTML=lm.events.map(e=>`<article class="event ${e.kind}"><small>${Math.floor(e.t/60)}:${String(e.t%60).padStart(2,'0')}</small><span>${esc(e.text)}</span></article>`).join('');}
  function updateLiveDOM(){
    const lm=state.liveMatch;if(!lm)return;
    const left=Math.max(0,PERIOD_MS*3-lm.matchClock);
    const time=$('#liveTime'),score=$('#liveScore'),rem=$('#liveRemaining'),bar=$('#liveBar'),poss=$('#livePoss'),shots=$('#liveShots'),corners=$('#liveCorners');
    if(time)time.textContent=liveClock(lm.matchClock);
    if(score)score.textContent=`${lm.hg} : ${lm.ag}`;
    if(rem)rem.textContent=lm.phase==='halftime'?'PAUSE':liveClock(left);
    if(bar)bar.style.width=`${clamp(lm.matchClock/(PERIOD_MS*3)*100,0,100)}%`;
    if(poss)poss.textContent=`${Math.round(lm.possession)}% · ${100-Math.round(lm.possession)}%`;
    if(shots)shots.textContent=`${lm.shotsH} · ${lm.shotsA}`;
    if(corners)corners.textContent=`${lm.cornersH} · ${lm.cornersA}`;
    const half=$('#liveHalfLabel'); if(half)half.textContent=`${esc(lm.weather.name)} · ${lm.phase==='third'?'3. DRITTEL':lm.phase==='second'?'2. DRITTEL':(lm.phase==='break1'||lm.phase==='break2')?`${lm.period}. DRITTEL ENDE`:'1. DRITTEL'}`;
    const phase=$('#livePhaseText'); if(phase)phase.textContent=(lm.phase==='third'?'3. DRITTEL · ECHTZEIT':lm.phase==='second'?'2. DRITTEL · ECHTZEIT':(lm.phase==='break1'||lm.phase==='break2')?`${lm.period}. DRITTEL · PAUSE`:'1. DRITTEL · ECHTZEIT');
    ['home','away'].forEach(side=>lm.sim.players[side].forEach((p,i)=>{const el=$(`.live-player[data-side="${side}"][data-index="${i}"]`);if(el){el.style.left=`${p.x}%`;el.style.top=`${p.y}%`;el.classList.toggle('active',side===lm.sim.ball.side&&i===lm.sim.ball.index);if(p.celebrate&&performance.now()-p.celebrate<1000)el.classList.add('celebrate');else el.classList.remove('celebrate')}}));
    const b=lm.sim.ball,ball=$('#liveBall');
    if(ball){ball.style.left=`${b.x}%`;ball.style.top=`${b.y}%`;ball.style.setProperty('--ballZ',String(b.z||0));ball.classList.toggle('in-flight',b.mode!=='hold');}
    const action=lm.sim.action,label=$('#liveActionLabel'),text=$('#liveActionText');
    if(label)label.textContent=action?({pass:'PASS',dribble:'PUCKKONTROLLE',shot:'SCHUSS',tackle:'ZWEIKAMPF',corner:'ANLAUF',free:'POWERPLAY',throw:'BULLY',cross:'PASS',header:'SCHLAG'}[action.type]||action.type.toUpperCase()):'LIVE';
    if(text)text.textContent=action?`Ball unterwegs · ${action.type==='shot'?'Torabschluss!':'Spielzug läuft …'}`:'Spielaufbau';
    updateLiveFeedOnly();
  }

  function findGame(id,type){
    if(type==='friendly')return state.friendlies.find(g=>g.id===id);
    for(const l of Object.values(state.leagues)){const g=l.schedule.find(x=>x.id===id);if(g)return g;} return null;
  }

  function applyResultForLeague(game,hg,ag,weather,leagueId){
    const l=state.leagues[leagueId]; if(!l||game.played)return;
    game.played=true; game.result={hg,ag,weather:weather?.name||'Normal'};
    const rowH=l.standings[game.home], rowA=l.standings[game.away]; if(!rowH||!rowA)return;
    rowH.played++; rowA.played++; rowH.gf+=hg; rowH.ga+=ag; rowA.gf+=ag; rowA.ga+=hg; rowH.gd=rowH.gf-rowH.ga; rowA.gd=rowA.gf-rowA.ga;
    if(hg>ag){rowH.wins++;rowH.points+=3;rowA.losses++;} else if(ag>hg){rowA.wins++;rowA.points+=3;rowH.losses++;} else {rowH.draws++;rowA.draws++;rowH.points++;rowA.points++;}
    const H=state.teams[game.home],A=state.teams[game.away]; if(H&&A){H.stats.played++;A.stats.played++;H.stats.gf+=hg;H.stats.ga+=ag;A.stats.gf+=ag;A.stats.ga+=hg;H.form=(H.form||[]).concat(hg>ag?'W':hg===ag?'D':'L').slice(-5);A.form=(A.form||[]).concat(ag>hg?'W':ag===hg?'D':'L').slice(-5);H.roster.slice(0,6).forEach(p=>p.games++);A.roster.slice(0,6).forEach(p=>p.games++);}
  }
  function simulateOtherGames(round,excludeId,collect=false){
    const results=[];
    for(const [leagueId,l] of Object.entries(state.leagues||{})){
      for(const g of l.schedule||[]){
        if(g.played||g.id===excludeId||g.round!==round)continue;
        const H=state.teams[g.home],A=state.teams[g.away]; if(!H||!A)continue;
        const hs=teamStrength(H),as=teamStrength(A),total=Math.max(1,hs+as);
        let hg=Math.max(0,Math.round((Math.random()*2.6)*(hs/total)*1.25)),ag=Math.max(0,Math.round((Math.random()*2.6)*(as/total)*1.25));
        if(Math.random()<.28){if(hs>as)hg++;else ag++;}
        const weather=pick(WEATHER);
        applyResultForLeague(g,hg,ag,weather,leagueId);
        results.push({leagueId,round,text:`ERGEBNIS · ${H.name} ${hg}:${ag} ${A.name}`});
      }
    }
    return results;
  }

  function finishLiveMatch(fromError=false){
    const lm=state.liveMatch; if(!lm||lm.finishing)return; lm.finishing=true;
    cancelAnimationFrame(window.__liveRAF); window.__liveRAF=null;
    const game=findGame(lm.gameId,lm.type);
    if(!game){state.liveMatch=null;saveState();renderPage();return;}
    const weather=lm.weather||pick(WEATHER);
    let resultError=null;
    try{
      applyFinalResult(game,lm.hg,lm.ag,weather,lm.type,lm.shotsH,lm.shotsA);
    }catch(err){
      resultError=err;
      console.error('Abpfiff konnte nicht vollständig verarbeitet werden:',err);
      // Minimaler Fallback: Ergebnis trotzdem sichern.
      try{
        if(!game.played){
          if(lm.type==='league'){
            const league=leagueForGame(game);
            if(league)applyResultForLeague(game,lm.hg,lm.ag,weather,league.id);
          }else{
            game.played=true; game.result={hg:lm.hg,ag:lm.ag,weather:weather.name};
          }
        }
      }catch(fallbackErr){ console.error('Ergebnis-Fallback fehlgeschlagen:',fallbackErr); }
    }finally{
      state.lastMatch={home:lm.home,away:lm.away,hg:lm.hg,ag:lm.ag,weather:weather.name,type:lm.type,date:Date.now()};
      state.liveMatch=null;
      state.matchdayBrief=[];
      saveState();
    }
    const note=resultError?'<p>Das Spiel wurde beendet und das Ergebnis sicher gespeichert.</p>':'<p>Die Partie ist beendet. Tabelle, Form und Statistiken wurden aktualisiert.</p>';
    openModal('ABPFIFF',`<div class="fulltime-card"><div class="fulltime-score"><strong>${esc(state.teams[lm.home]?.name||'Heim')}</strong><b>${lm.hg} : ${lm.ag}</b><strong>${esc(state.teams[lm.away]?.name||'Gast')}</strong></div>${note}<button class="gold-btn wide" data-close>WEITER</button></div>`,{kicker:'ENDRWAND'});
  }

  function checkSeasonCompletion(){
    const l=currentLeague();
    if(!l)return false;
    const remaining=(l.schedule||[]).some(g=>!g.played);
    if(remaining)return false;
    // Saisonabschluss niemals mitten in einem laufenden Match auslösen.
    if(state.liveMatch)return false;
    setTimeout(()=>{
      if(state.liveMatch)return;
      const nowLeague=currentLeague();
      if(nowLeague && !(nowLeague.schedule||[]).some(g=>!g.played)) finishSeason();
    },120);
    return true;
  }

  function applyFinalResult(game,hg,ag,weather,type,shotsH=0,shotsA=0){
    const H=state.teams[game.home],A=state.teams[game.away];if(!H||!A||game.played)return;
    let league=null,leagueId=null;for(const [id,l] of Object.entries(state.leagues)){if(l.schedule.some(g=>g.id===game.id)){league=l;leagueId=id;break;}}
    if(type==='league'){applyResultForLeague(game,hg,ag,weather,leagueId);state.gamesSinceDraft++;state.week=Math.max(state.week,game.round+1);state.date=new Date(state.date.getTime()+7*86400000);}else{game.played=true;game.result={hg,ag,weather:weather.name};const fin=H.finance||{};H.budget+=2500;H.roster.slice(0,6).forEach(p=>p.games++);A.roster.slice(0,6).forEach(p=>p.games++);evolveTeamPlayers(H);evolveTeamPlayers(A);}
    maybeGenerateIncomingOffers();
    updateCoachAfterMatch();
    checkSeasonCompletion();
  }

  function findTransferTarget(id){
    const marketHit=state.market.find(p=>p.id===id); if(marketHit)return {...marketHit,sourceType:'market',sourceTeamId:null,sourceTeamName:'Freier Nationalmarkt'};
    for(const tm of Object.values(state.teams)){const p=(tm.roster||[]).find(x=>x.id===id);if(p)return {...p,sourceType:'club',sourceTeamId:tm.id,sourceTeamName:tm.name};}
    return null;
  }
  function parseNum(sel,fallback=0){const raw=String($(sel)?.value||'').replace(/\./g,'').replace(',','.');const n=Number(raw);return Number.isFinite(n)?n:fallback;}
  function ownTradeCandidates(){return currentTeam().roster.slice(5).map(p=>`<option value="${p.id}">${esc(p.name)} · ${marketLabel(p.pos)} · ${money(p.value)}</option>`).join('');}
  function offerModal(playerId,mode='offer'){
    const p=findTransferTarget(playerId);if(!p)return;
    const suggested=Math.max(10000,Math.round((p.value||p.currentPrice||50000)*0.82)),suggestedSalary=Math.max(900,Math.round((p.salary||2200)*1.12));
    const sourceLabel=p.sourceType==='club'?p.sourceTeamName:'Freier Nationalmarkt / Spielerberater';
    if(mode==='inquiry'){
      openModal(`ANFRAGE · ${esc(p.name)}`,`<div class="contract-paper"><div class="contract-head"><span>EISHOCKEY WORLD CUP 27 TRANSFERDÜRO</span><b>UNVERDINDLICH</b></div><div class="contract-club"><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.rating} OVR · ${esc(sourceLabel)}</span></div><label class="input-label">Nachricht<textarea class="text-input contract-textarea" id="inquiryText">Wir interessieren uns für ${esc(p.name)}. Ist der Nation grundsätzlich gesprächsbereit?</textarea></label><label class="check-row"><input type="checkbox" id="inquiryScouting" checked> Scoutingbericht beilegen</label><button class="gold-btn wide" data-send-inquiry="${p.id}">ANFRAGE SENDEN</button></div>`,{kicker:'TRANSFER-ANFRAGE'});return;
    }
    openModal(`${mode==='trade'?'TAUSCH & ANGEBOT':'VERTRAGSANGEBOT'} · ${esc(p.name)}`,`<div class="contract-paper"><div class="contract-head"><span>EISHOCKEY WORLD CUP 27 TRANSFERVERTRAG</span><b>ENGURF</b></div><div class="contract-club"><strong>${esc(p.name)}</strong><span>${marketLabel(p.pos)} · ${p.rating} OVR · ${esc(sourceLabel)}</span><small>Marktwert: ${money(p.value||p.currentPrice||0)}</small></div><div class="contract-grid"><label class="input-label">Ablöse (€)<input class="text-input" id="offerFee" type="number" inputmode="numeric" min="0" step="5000" value="${suggested}"></label><label class="input-label">Gehalt / Woche<input class="text-input" id="offerSalary" type="number" inputmode="numeric" min="500" step="100" value="${suggestedSalary}"></label><label class="input-label">Vertragsjahre<select class="text-input" id="offerYears"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option></select></label><label class="input-label">Bonus bei Einsatz (€)<input class="text-input" id="offerBonus" type="number" inputmode="numeric" min="0" step="100" value="250"></label></div>${mode==='trade'?`<label class="check-row"><input type="checkbox" id="offerTrade" checked> Tauschspieler mit anbieten</label><label class="input-label">Tauschspieler<select class="text-input" id="offerTradePlayer"><option value="">Keinen Spieler anbieten</option>${ownTradeCandidates()}</select></label>`:''}<label class="input-label">Zusätzliche Nationbarung<textarea class="text-input contract-textarea" id="offerNote" maxlength="280" placeholder="z.B. Stammplatz, Wohnungshilfe, Rückkaufklausel …"></textarea></label><div class="contract-meta"><span>📅 Antwortfenster</span><b>2–5 Tage</b></div><button class="gold-btn wide" data-send-offer="${p.id}" data-offer-mode="${mode}">VERTRAGSANGEBOT SENDEN</button><small class="contract-footnote">Die Ablöse wird erst bei Zustimmung fällig. Der andere Manager kann ablehnen oder ein Gegenangebot schicken.</small></div>`,{kicker:'VERTRAG · '+sourceLabel});
  }
  function sendInquiry(id){const p=findTransferTarget(id);if(!p)return;const q={id:uid('inq'),type:'inquiry',playerId:p.id,playerSnapshot:{...p},sourceTeamId:p.sourceTeamId,sourceTeamName:p.sourceTeamName||'Spielerberater',message:($('#inquiryText')?.value||'').trim()||'Ist der Nation gesprächsbereit?',status:'pending',sentAt:Date.now(),responseAt:Date.now()+6500+Math.random()*4500,dueGameDays:2,scouting:!!$('#inquiryScouting')?.checked};state.transferInquiries.unshift(q);saveState();closeModal();render();toast('Anfrage gesendet',`${p.name} · Antwort folgt im Kalender.`);}
  function sendTransferOffer(id,mode='offer'){
    const p=findTransferTarget(id),t=currentTeam();if(!p)return;const fee=Math.max(0,Math.round(parseNum('#offerFee',0))),salary=Math.max(0,Math.round(parseNum('#offerSalary',0))),years=clamp(Number($('#offerYears')?.value||2),1,5),bonus=Math.max(0,Math.round(parseNum('#offerBonus',0)));
    if(!salary||!fee){toast('Angebot unvollständig','Ablöse und Gehalt eintragen.');return;}if(fee>t.budget){toast('Ablöse zu hoch','Die Ablöse überschreitet dein Budget.');return;}
    let tradePlayerId=null,tradeValue=0;if(mode==='trade'&&p.sourceType==='club'&&$('#offerTrade')?.checked){tradePlayerId=$('#offerTradePlayer')?.value||null;const tp=t.roster.find(x=>x.id===tradePlayerId);tradeValue=tp?.value||0;}
    const o={id:uid('off'),type:'offer',mode,playerId:p.id,playerSnapshot:{...p},sourceType:p.sourceType,sourceTeamId:p.sourceTeamId,sourceTeamName:p.sourceTeamName||'Spielerberater',fee,salary,years,bonus,note:($('#offerNote')?.value||'').trim(),tradePlayerId,tradeValue,status:'pending',sentAt:Date.now(),responseAt:Date.now()+8000+Math.random()*9000,dueGameDays:Math.floor(2+Math.random()*4),counterFee:Math.round(Math.max(p.value||p.currentPrice||50000,fee)*1.05),counterSalary:Math.round(salary*1.1),responseText:'Manager prüft das Angebot.'};
    state.transferOffers.unshift(o);saveState();closeModal();render();toast('Angebot verschickt',`${p.name} · Antwort wird im Kalender erwartet.`);
  }
  function applyAcceptedTransfer(o,acceptedFee,acceptedSalary){
    const t=currentTeam(),p=findTransferTarget(o.playerId);if(!p||t.roster.length>=12)return false;const netFee=Math.max(0,acceptedFee-Math.round((o.tradeValue||0)*0.55));if(t.budget<netFee)return false;
    const sourceTeam=p.sourceTeamId?state.teams[p.sourceTeamId]:null;
    if(sourceTeam){const idx=sourceTeam.roster.findIndex(x=>x.id===o.playerId);if(idx<0)return false;sourceTeam.roster.splice(idx,1);}else state.market=state.market.filter(x=>x.id!==o.playerId);
    if(o.tradePlayerId&&sourceTeam){const ti=t.roster.findIndex(x=>x.id===o.tradePlayerId);if(ti>=5){const tp=t.roster.splice(ti,1)[0];tp.teamId=sourceTeam.id;tp.teamColor=sourceTeam.teamColor;sourceTeam.roster.push(tp);}}
    t.budget-=netFee;t.roster.push({...p,id:uid('p'),teamId:t.id,teamColor:t.teamColor,currentPrice:undefined,listingEndsAt:undefined,salary:acceptedSalary,value:p.value||acceptedFee});return true;
  }
  function resolveTransferOffer(o){
    const p=findTransferTarget(o.playerId);if(!p){o.status='rejected';o.responseText='Spieler ist nicht mehr verfügbar.';return;}
    const ratio=o.fee/Math.max(1,p.value||o.fee),salaryRatio=o.salary/Math.max(1,p.salary||1500);let acceptance=clamp(0.25+ratio*.55+(o.years>=2?.05:0)+Math.min(.16,Math.max(0,salaryRatio-1)*.08)+(o.tradePlayerId?.10:0),.08,.92);const roll=Math.random();
    if(roll<acceptance){if(applyAcceptedTransfer(o,o.fee,o.salary)){o.status='accepted';o.responseText='Angebot angenommen.';addNews('Transfer angenommen',`${p.name} wechselt zu ${currentTeam().name}.`,'market');}else{ o.status='countered';o.counterFee=Math.round(Math.max(o.fee+5000,(p.value||o.fee)*.98));o.counterSalary=Math.round(o.salary*1.08);o.responseText='Grundsätzliches Interesse – Budget/Deal muss angepasst werden.'; }}
    else if(ratio<.88||roll<.76){o.status='countered';o.counterFee=Math.round(Math.max(o.fee+5000,(p.value||o.fee)*(.96+Math.random()*.12)));o.counterSalary=Math.round(o.salary*(1.05+Math.random()*.12));o.responseText='Der Manager ist gesprächsbereit und schickt ein Gegenangebot.';}
    else{o.status='rejected';o.responseText='Der Nation lehnt das Angebot ab.';}
    saveState();render();toast(o.status==='accepted'?'Transfer angenommen':o.status==='countered'?'Gegenangebot erhalten':'Angebot abgelehnt',p.name);
  }
  function acceptCounter(id){const o=state.transferOffers.find(x=>x.id===id);if(!o||o.status!=='countered')return;const t=currentTeam();if(t.budget<o.counterFee){toast('Gegenangebot zu teuer','Das Budget reicht für die neue Ablöse nicht.');return;}if(!applyAcceptedTransfer(o,o.counterFee,o.counterSalary)){toast('Transfer nicht möglich','Der Spieler ist nicht mehr verfügbar.');return;}o.fee=o.counterFee;o.salary=o.counterSalary;o.status='accepted';o.responseText='Gegenangebot angenommen.';addNews('Transfer abgeschlossen',`${o.playerSnapshot.name} kommt nach ${t.name}.`,'market');saveState();render();toast('Transfer abgeschlossen',o.playerSnapshot.name);}
  function processTransferDesk(){
    const now=Date.now();
    for(const o of state.transferOffers||[])if(o.status==='pending'&&o.responseAt<=now)resolveTransferOffer(o);
    for(const q of state.transferInquiries||[])if(q.status==='pending'&&q.responseAt<=now){const p=findTransferTarget(q.playerId);q.status='answered';q.responseText=p?(Math.random()<.68?`Der Manager bestätigt grundsätzliches Interesse. Erwartete Ablöse: ${money(Math.round((p.value||60000)*(.95+Math.random()*.18)))}.`:'Aktuell kein Interesse – später erneut anfragen.'):'Spieler nicht mehr verfügbar.';addNews('Transfer-Anfrage beantwortet',`${q.playerSnapshot?.name||'Spieler'} · ${q.responseText}`,'market');saveState();render();}
  }

  function buyPlayer(id){offerModal(id,'offer');}
  function bidPlayer(id){offerModal(id,'offer');}


  function repayCredit(){const t=currentTeam(),f=t.finance||{};const debt=Number(f.debt||0);if(debt<=0){toast('Kein Kredit','Es gibt keinen offenen Kredit.');return;}const pay=Math.min(debt,Math.round(parseNum('#repayAmount',0)||debt));if(t.budget<pay){toast('Budget fehlt','Budget reicht für die Tilgung nicht.');return;}t.budget-=pay;f.debt=debt-pay;saveState();render();toast('Kredit getilgt',money(pay));}
  function upgradeStadium(k){
    const t=currentTeam(),lvl=t.stadium.upgrades[k]||0,cost=Math.round(9000*Math.pow(1.8,lvl));
    if(t.budget<cost){toast('Budget fehlt',`Benötigt ${money(cost)}.`);return;}
    t.budget-=cost;t.stadium.upgrades[k]=lvl+1;t.stadium.level=Math.max(t.stadium.level,lvl+2);
    if(k==='capacity')t.stadium.capacity+=40; if(k==='stands')t.stadium.capacity+=70; if(k==='lighting')t.stadium.capacity+=12;
    state.stadiumBuildKey=k;addNews('Arena verbessert',`${t.stadium.name}: ${k} auf Level ${lvl+1}.`,'stadium');saveState();renderPage();toast('Umbau gestartet',`${k} · Level ${lvl+1}`);
    setTimeout(()=>{state.stadiumBuildKey='';saveState();renderPage();},1500);
  }

  function hireSponsor(id){const t=currentTeam(),s=SPONSORS.find(x=>x.id===id);if(!s)return;if(t.sponsor&&s.tier<t.sponsor.tier){toast('Vertrag nicht besser','Dieser Sponsor ist eine niedrigere Stufe.');return;}t.sponsor={...s};addNews('Sponsor an Bord',`${s.name} unterstützt ${t.name}.`,'sponsor');saveState();renderPage();toast('Sponsor unterschrieben',s.name);}
  function hireCoach(id){openCoachNegotiation(id);}
  function fireCoach(){const t=currentTeam();if(!t.coach)return;const c=state.coaches.find(x=>x.id===t.coach);t.budget=Math.max(0,t.budget-Math.round((c?.price||0)*.35));addNews('Coach entlassen',`${c?.name||'Der Coach'} verlässt den Nation.`,'coach');t.coach=null;t.coachSalary=0;t.coachContractEnd=0;saveState();renderPage();toast('Coach entlassen','Vertragsstrafe verbucht.');}
  function sellPlayer(id){const t=currentTeam(),idx=t.roster.findIndex(p=>p.id===id);if(idx<5||idx<0){toast('Starter geschützt','Verkaufe zuerst einen Bankspieler.');return;}const p=t.roster[idx],val=Math.round(p.value*.72);t.roster.splice(idx,1);t.budget+=val;saveState();renderPage();toast('Spieler verkauft',`${p.name} · +${money(val)}`);}

  function draft(type){
    const cfg={silver:{cost:800000,n:2,min:50,max:70,choices:1},gold:{cost:2000000,n:3,min:72,max:78,choices:1},premium:{cost:5000000,n:6,min:78,max:96,choices:3}}[type];const t=currentTeam();if(!cfg)return;const free=type==='gold'&&!state.freeGoldDraftUsed;if(state.gamesSinceDraft<5&&state.draftHistory.length>0){toast('Draft noch nicht bereit',`Noch ${5-state.gamesSinceDraft} Spiele.`);return;}if(!free&&t.budget<cfg.cost){toast('Draft nicht möglich','Budget reicht nicht.');return;}if(!free)t.budget-=cfg.cost;if(free)state.freeGoldDraftUsed=true;const p=[];for(let i=0;i<cfg.n;i++){const q=makePlayer(500+i,t.teamColor,pick(['G','LD','LD','RD','C','LW','RW','RW']),cfg.min+Math.random()*(cfg.max-cfg.min));q.draftTier=type;q.nationality=t.country||state.selectedCountry||'Deutschland';q.countryCode=t.countryCode||'';q.bio=`Fiktives Nachwuchstalent aus ${q.nationality}. ${q.bio||''}`;p.push(q);}state._draftPlayers=p;state._draftChoicesLeft=cfg.choices;state.draftHistory.unshift({type,cost:free?0:cfg.cost,date:new Date().toISOString(),count:cfg.n});state.gamesSinceDraft=0;saveState();openModal(`DRAFT · ${type.toUpperCase()}`,`<p class="modal-copy">Wähle bis zu <b>${cfg.choices}</b> Spieler. Du kannst die Auswahl einzeln übernehmen.</p><div class="draft-candidate-grid">${p.map((x,i)=>`<article class="draft-pick"><img src="${playerAvatar(x,t.teamColor,true)}"><div><strong>${esc(x.name)}</strong><span>${marketLabel(x.pos)} · ${x.rating} OVR</span><small>${money(x.value)} · ${esc(x.bio)}</small></div><button class="small-btn gold" data-draft-index="${i}">NEHMEN</button></article>`).join('')}</div>`,{kicker:free?'GOLD · EINMALIG GRATIS':'NATIONS DRAFT'});}

  function renderCurrentDraftModal(){
    const t=currentTeam(),p=state._draftPlayers||[],left=state._draftChoicesLeft||0;
    openModal('DRAFT · AUSWAHL',`<p class="modal-copy">Noch <b>${left}</b> Auswahl${left===1?'':'en'} möglich.</p><div class="draft-candidate-grid">${p.map((x,i)=>`<article class="draft-pick"><img src="${playerAvatar(x,t.teamColor,true)}"><div><strong>${esc(x.name)}</strong><span>${marketLabel(x.pos)} · ${x.rating} OVR</span><small>${money(x.value)} · ${esc(x.bio)}</small></div><button class="small-btn gold" data-draft-index="${i}">NEHMEN</button></article>`).join('')}</div>`,{kicker:'DRAFT'});
  }
  function chooseDraft(i){const t=currentTeam(),p=state._draftPlayers?.[i];if(!p)return;if(t.roster.length>=12){toast('Kader voll','Maximal 12 Spieler.');return;}t.roster.push({...p,id:uid('p'),teamId:t.id});state._draftChoicesLeft=(state._draftChoicesLeft||1)-1;state._draftPlayers.splice(i,1);saveState();if(state._draftChoicesLeft<=0||!state._draftPlayers.length){delete state._draftPlayers;delete state._draftChoicesLeft;closeModal();render();toast('Draft abgeschlossen',p.name);}else{renderCurrentDraftModal();toast('Spieler gewählt',`${p.name} · noch ${state._draftChoicesLeft} Auswahl`);}}

  async function exportSave(){
    const payload=JSON.stringify({...state,liveMatch:null},null,2);const file=new File([payload],'street-kings-save.json',{type:'application/json'});
    try{if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Eishockey World Cup Manager – Spielstand',text:'Mein Eishockey World Cup Manager Spielstand'});toast('Export bereit','JSON-Datei wurde zum Speichern/Teilen geöffnet.');return;}}catch(e){if(e?.name==='AbortError')return;}
    const url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download='street-kings-save.json';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Export erstellt','street-kings-save.json');
  }
  function importSave(){
    const input=document.createElement('input');
    input.type='file'; input.accept='.json,application/json'; input.style.display='none';
    document.body.appendChild(input);
    input.addEventListener('change',()=>{
      const f=input.files?.[0];
      if(!f){input.remove();return;}
      const r=new FileReader();
      r.onload=()=>{
        try{
          const d=JSON.parse(String(r.result||''));
          if(!d||typeof d!=='object'||!d.teams||!d.leagues) throw new Error('Kein gültiger Eishockey World Cup-Spielstand');
          const fresh=blankState();
          Object.keys(state).forEach(k=>delete state[k]);
          Object.assign(state,fresh,d);
          state.liveMatch=null;
          normalizeState();
          ensureManagerSystems();
          state.version=APP_VERSION;
          if(state.teamChosen){state.firstRun=false;state.introStage='done';state.pendingTeamId=null;}else{state.firstRun=true;state.introStage='club';state.pendingTeamId=state.pendingTeamId||null;}
          const ok=saveState();
          input.remove();
          render();
          toast(ok?'Import erfolgreich':'Import geladen',ok?'Spielstand wurde übernommen.':'Spielstand wurde geladen, konnte aber nicht gespeichert werden.');
        }catch(e){
          input.remove();
          toast('Import fehlgeschlagen',e.message||'JSON ist ungültig.');
        }
      };
      r.onerror=()=>{input.remove();toast('Import fehlgeschlagen','Datei konnte nicht gelesen werden.');};
      r.readAsText(f);
    });
    input.click();
  }
  function openNewGameModal(){
    startNewGameFlow();
  }


  function bindCriticalModalClose(){
    document.addEventListener('click',(e)=>{const b=e.target.closest?.('.close-btn,[data-close]');if(b && !state.liveMatch){e.preventDefault();e.stopPropagation();closeModal();}},true);
  }

  let dragState=null;
  function maybeGenerateIncomingOffers(){
    const t=currentTeam(); if(!t||!state.teamChosen)return;
    const now=Date.now(); if(Number(state.incomingOffersCooldown||0)>now)return;
    state.incomingOffersCooldown=now+45000;
    const candidates=t.roster.slice(6).filter(p=>Number(p.rating||0)>=58);
    if(!candidates.length)return;
    if(Math.random()>.62)return;
    const p=pick(candidates),clubs=Object.values(state.teams).filter(x=>x.id!==t.id),from=pick(clubs);
    const fee=Math.round((p.value||50000)*(0.92+Math.random()*.55));
    state.incomingOffers.unshift({id:uid('in'),playerId:p.id,playerSnapshot:{...p},fromTeamId:from.id,fromTeamName:from.name,fee,status:'pending',createdAt:now,responseText:'Neues Angebot'});
    state.incomingOffers=state.incomingOffers.slice(0,16); addNews('Neues Spielerangebot',`${from.name} bietet ${money(fee)} für ${p.name}.`,'market'); saveState();
  }
  function tickMarket(){
    processTransferDesk();
    const now=Date.now();
    if(now-Number(state._marketPulse||0)>15000){
      state._marketPulse=now;
      for(const p of state.market||[]){if(p.listingEndsAt&&p.listingEndsAt<now){p.listingEndsAt=now+45000+Math.random()*90000;p.currentPrice=Math.max(15000,Math.round((p.value||40000)*(0.85+Math.random()*.35)));}}
      if(state.teamChosen)maybeGenerateIncomingOffers();
    }
    if(state.teamChosen && state.active==='coaches' && now-Number(state._coachPulse||0)>20000){state._coachPulse=now;renderPage();}
  }

  function bindGlobal(){
    let lastActionEl=null,lastActionAt=0;
    const dispatchAction=(e)=>{
      const el=e.target.closest?.('[data-page],[data-bottom],[data-simulate],[data-close],[data-save-stadium],[data-welcome],[data-player],[data-sell],[data-buy],[data-bid],[data-watch],[data-tactic],[data-marketfilter],[data-market-refresh],[data-sponsor],[data-upgrade],[data-credit],[data-export],[data-import],[data-reset],[data-new-game-flow],[data-confirm-reset],[data-draft],[data-draft-index],[data-coach],[data-firecoach],[data-settings-save],[data-select-team],[data-club-continue],[data-add-game],[data-create-friendly],[data-notify],[data-news-go-navigation],[data-news-read],[data-fixture],[data-rename-stadium],[data-offer-player],[data-inquire-player],[data-trade-player],[data-send-offer],[data-send-inquiry],[data-intro-next],[data-accept-counter],[data-incoming-accept],[data-incoming-reject],[data-renew-contract],[data-confirm-renew],[data-accept-renew-counter],[data-confirm-hire-coach],[data-accept-coach-counter],[data-team-overview],[data-start-match],[data-calendar-league],[data-repay-credit]');      if(e.target.closest?.('.team-select-card,[data-club-continue],[data-new-game-flow],[data-reset],[data-confirm-reset],[data-close],.close-btn')) return;
      if(!el)return;
      const now=Date.now();
      if(lastActionEl===el && now-lastActionAt<700)return;
      lastActionEl=el; lastActionAt=now;
      handleClick(e);
    };
    document.addEventListener('pointerup',dispatchAction,true);
    document.addEventListener('touchend',dispatchAction,{capture:true,passive:false});
    document.addEventListener('click',dispatchAction,true);
    document.addEventListener('input',handleInput);
    document.addEventListener('pointerdown',beginPlayerDrag,{passive:false});
    document.addEventListener('pointermove',movePlayerDrag,{passive:false});
    document.addEventListener('pointerup',endPlayerDrag,{passive:false});
    document.addEventListener('pointercancel',endPlayerDrag,{passive:false});
    if(!window.__marketTimer) window.__marketTimer=setInterval(tickMarket,1000);
  }

  function beginPlayerDrag(e){
    const el=e.target.closest?.('[data-drag-player]'); if(!el||!currentTeam())return;
    const field=el.closest('[data-lineup-field]'); if(!field)return;
    e.preventDefault();
    const rect=field.getBoundingClientRect();
    dragState={el,field,playerId:el.dataset.dragPlayer,teamId:currentTeam().id,rect,startX:e.clientX,startY:e.clientY,moved:false,pointerId:e.pointerId};
    el.classList.add('dragging');
    try{el.setPointerCapture(e.pointerId)}catch(_){}
  }
  function movePlayerDrag(e){
    if(!dragState||dragState.pointerId!==e.pointerId)return;
    e.preventDefault();
    const r=dragState.rect;
    const dx=e.clientX-dragState.startX,dy=e.clientY-dragState.startY;
    if(Math.hypot(dx,dy)>5)dragState.moved=true;
    if(!dragState.moved)return;
    const x=clamp(((e.clientX-r.left)/r.width)*100,5,95), y=clamp(((e.clientY-r.top)/r.height)*100,8,92);
    dragState.el.style.left=x+'%'; dragState.el.style.top=y+'%';
    state.lineupPositions[dragState.teamId]=state.lineupPositions[dragState.teamId]||{};
    state.lineupPositions[dragState.teamId][dragState.playerId]={x,y};
  }
  function endPlayerDrag(e){
    if(!dragState||dragState.pointerId!==e.pointerId)return;
    const moved=dragState.moved;
    dragState.el.classList.remove('dragging');
    dragState=null;
    if(moved){state._dragMoved=true;saveState();}
  }

  function go(page){state.active=page;window.scrollTo({top:0,behavior:'smooth'});renderPage();}

  function handleInput(e){
    const r=e.target?.dataset?.range;if(r){state.tactics[r]=Number(e.target.value);const b=e.target.parentElement?.querySelector('label b');if(b)b.textContent=state.tactics[r];saveState();return;}
    if(e.target?.id==='nationSearch'){
      const q=e.target.value.trim().toLocaleLowerCase('de-DE');
      $$('.team-select-card').forEach(el=>{const text=el.textContent.toLocaleLowerCase('de-DE');el.style.display=!q||text.includes(q)?'grid':'none';});
    }
  }

  function handleClick(e){
    const el=e.target.closest('[data-page],[data-bottom],[data-simulate],[data-close],[data-save-stadium],[data-welcome],[data-player],[data-sell],[data-buy],[data-bid],[data-watch],[data-tactic],[data-marketfilter],[data-market-refresh],[data-sponsor],[data-upgrade],[data-credit],[data-export],[data-import],[data-reset],[data-new-game-flow],[data-confirm-reset],[data-draft],[data-draft-index],[data-coach],[data-firecoach],[data-settings-save],[data-select-team],[data-club-continue],[data-add-game],[data-create-friendly],[data-notify],[data-news-go-navigation],[data-news-read],[data-fixture],[data-rename-stadium],[data-offer-player],[data-inquire-player],[data-trade-player],[data-send-offer],[data-send-inquiry],[data-intro-next],[data-accept-counter],[data-incoming-accept],[data-incoming-reject],[data-renew-contract],[data-confirm-renew],[data-accept-renew-counter],[data-confirm-hire-coach],[data-accept-coach-counter],[data-team-overview],[data-start-match],[data-calendar-league],[data-repay-credit]');
    if(!el)return;
    if(state.liveMatch)return;
    if(el.dataset.introNext){state.introStage='club';closeModal();showNationSelection();}
    else if(el.dataset.clubContinue){commitTeamSelection();}
    else if(el.dataset.page)go(el.dataset.page);
    else if(el.dataset.bottom)go(el.dataset.bottom==='more'?'more':el.dataset.bottom);
    else if(el.dataset.simulate)simulateButton();
    else if(el.dataset.close)closeModal();
    else if(el.dataset.selectTeam)choosePendingTeam(el.dataset.selectTeam);
    else if(el.dataset.welcome){return;}
    else if(el.dataset.player){if(state._dragMoved){state._dragMoved=false;return;}openPlayer(el.dataset.player);}
    else if(el.dataset.sell)sellPlayer(el.dataset.sell);
    else if(el.dataset.buy)offerModal(el.dataset.buy,'offer');
    else if(el.dataset.bid)offerModal(el.dataset.bid,'offer');
    else if(el.dataset.offerPlayer)offerModal(el.dataset.offerPlayer,'offer');
    else if(el.dataset.inquirePlayer)offerModal(el.dataset.inquirePlayer,'inquiry');
    else if(el.dataset.tradePlayer)offerModal(el.dataset.tradePlayer,'trade');
    else if(el.dataset.sendOffer)sendTransferOffer(el.dataset.sendOffer,el.dataset.offerMode||'offer');
    else if(el.dataset.sendInquiry)sendInquiry(el.dataset.sendInquiry);
    else if(el.dataset.acceptCounter)acceptCounter(el.dataset.acceptCounter);
    else if(el.dataset.incomingAccept)acceptIncomingOffer(el.dataset.incomingAccept);
    else if(el.dataset.incomingReject)rejectIncomingOffer(el.dataset.incomingReject);
    else if(el.dataset.renewContract)openContractRenewal(el.dataset.renewContract);
    else if(el.dataset.confirmRenew)confirmRenewContract(el.dataset.confirmRenew);
    else if(el.dataset.acceptRenewCounter)acceptRenewCounter(el.dataset.acceptRenewCounter);
    else if(el.dataset.teamOverview)openTeamOverview(el.dataset.teamOverview);
    else if(el.dataset.startMatch){const typ=el.dataset.startMatchType||'league';const g=findGame(el.dataset.startMatch,typ);if(g){if(typ==='league')prepareLeagueMatchday(g);startLiveMatch(g,typ);}}
    else if(el.dataset.calendarLeague){state.calendarLeague=el.dataset.calendarLeague;renderPage();}
    else if(el.dataset.repayCredit)repayCredit();
    else if(el.dataset.watch){const p=state.market.find(x=>x.id===el.dataset.watch);if(p){p.watch=!p.watch;saveState();renderPage();}}
    else if(el.dataset.tactic){state.tactic=el.dataset.tactic;const t=currentTeam();state.lineupPositions[t.id]={};saveState();renderPage();}
    else if(el.dataset.marketfilter){state.marketFilter=el.dataset.marketfilter;renderPage();}
    else if(el.dataset.marketRefresh){state.market=generateMarket(48);saveState();renderPage();toast('Transfermarkt aktualisiert','Neue Live-Angebote sind da.');}
    else if(el.dataset.sponsor)hireSponsor(el.dataset.sponsor);
    else if(el.dataset.upgrade)upgradeStadium(el.dataset.upgrade);
    else if(el.dataset.credit){const t=currentTeam();const f=t.finance||={ticketPrice:9,vipPrice:28,merchPrice:5,cateringPrice:4,debt:0,interest:0.08};f.debt=(f.debt||0)+50000;t.budget+=50000;saveState();renderPage();toast('Kredit aufgenommen','+50.000 € · 8% Jahreszins.');}
    else if(el.dataset.export)exportSave();
    else if(el.dataset.import)importSave();
    else if(el.dataset.reset||el.dataset.newGameFlow){startNewGameFlow();}
    else if(el.dataset.confirmReset){startNewGameFlow();}
    else if(el.dataset.draft)draft(el.dataset.draft);
    else if(el.dataset.draftIndex)chooseDraft(Number(el.dataset.draftIndex));
    else if(el.dataset.coach)openCoachNegotiation(el.dataset.coach);
    else if(el.dataset.firecoach)fireCoach();
    else if(el.dataset.confirmHireCoach)confirmHireCoach(el.dataset.confirmHireCoach);
    else if(el.dataset.acceptCoachCounter)acceptCoachCounter(el.dataset.acceptCoachCounter);
    else if(el.dataset.settingsSave){const t=currentTeam();if(!t)return;t.name=(document.querySelector('#teamName')?.value||t.name).trim()||t.name;t.stadium.name=(document.querySelector('#stadiumName')?.value||t.stadium.name).trim()||t.stadium.name;state.manager=(document.querySelector('#managerName')?.value||state.manager).trim()||'Manager';const ok=saveState();state.active='settings';renderPage();toast(ok?'Gespeichert':'Speichern fehlgeschlagen',`${t.name} · Manager: ${state.manager}`);}
    else if(el.dataset.addGame)addFriendly();
    else if(el.dataset.createFriendly)createFriendly();
    else if(el.dataset.newsGoNavigation){state.newsIntroSeen=true;saveState();closeModal();state.active='more';renderPage();}
    else if(el.dataset.newsRead){const n=state.news[Number(el.dataset.newsRead)];if(n){openModal(esc(n.title),`<article class="news-modal-full"><div class="news-thumb ${n.kind}">${n.kind==='market'?'↔':n.kind==='stadium'?'▤':n.kind==='result'?'⚽':'✦'}</div><h3>${esc(n.title)}</h3><p>${esc(n.body)}</p><small>${n.createdAt?dateDE(new Date(n.createdAt)):dateDE(new Date())} · ${n.createdAt?timeDE(new Date(n.createdAt)):timeDE(new Date())}</small></article>`,{kicker:'REGIONALE NEWS'});}}
    else if(el.dataset.notify){openModal('NEWS',state.news.map(n=>`<article class="news-modal"><b>${esc(n.title)}</b><span>${esc(n.body)}</span></article>`).join(''),{kicker:'REGIONALE NEWS'});}
    else if(el.dataset.fixture){const typ=el.dataset.fixtureType==='Freundschaft'?'friendly':'league';const g=findGame(el.dataset.fixture,typ);if(g&&!g.played)openPreMatch(g,typ);else toast('Spiel bereits gespielt',g?.result?`${g.result.hg}:${g.result.ag}`:'');}
    else if(el.dataset.renameStadium){openModal('ARENA UMBENENNEN',`<label class="input-label">Neuer Name<input class="text-input" id="newStadiumName" value="${esc(currentTeam().stadium.name)}"></label><button class="gold-btn wide" data-save-stadium>UMBENENNEN · 5.000 €</button>`,{kicker:'ARENA'});}
    else if(el.dataset.saveStadium){const t=currentTeam(),v=(document.querySelector('#newStadiumName')?.value||'').trim();if(!v)return;if(t.budget<5000){toast('Budget fehlt','Benötigt 5.000 €');return;}t.budget-=5000;t.stadium.name=v;saveState();closeModal();renderPage();}
  }


  initState();
  checkWeeklyServerReset();
  if(new URLSearchParams(location.search).has('newgame')){ clearSaveKeys(); buildFreshCareer({save:false}); }
  state.version=APP_VERSION;
  ensureManagerSystems();
  if(state.teamChosen) saveState();
  render();
  bindGlobal();
  if(state.teamChosen && !state.newsIntroSeen) setTimeout(showNewsLaunchPopup,120);
  if(!window.__weeklyResetTimer) window.__weeklyResetTimer=setInterval(checkWeeklyServerReset,30000);
})();
