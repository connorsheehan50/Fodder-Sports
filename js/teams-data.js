/* Fodder Sports — every team a reader can follow, by sport.
   Shared by signup.html and account.html. abbr = ESPN team id/abbreviation. */
window.FS_SPORTS = {
  NFL: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/nfl/500/${abbr}.png`,
    teams: [
      {name:'Arizona Cardinals',abbr:'ari'},{name:'Atlanta Falcons',abbr:'atl'},
      {name:'Baltimore Ravens',abbr:'bal'},{name:'Buffalo Bills',abbr:'buf'},
      {name:'Carolina Panthers',abbr:'car'},{name:'Chicago Bears',abbr:'chi'},
      {name:'Cincinnati Bengals',abbr:'cin'},{name:'Cleveland Browns',abbr:'cle'},
      {name:'Dallas Cowboys',abbr:'dal'},{name:'Denver Broncos',abbr:'den'},
      {name:'Detroit Lions',abbr:'det'},{name:'Green Bay Packers',abbr:'gb'},
      {name:'Houston Texans',abbr:'hou'},{name:'Indianapolis Colts',abbr:'ind'},
      {name:'Jacksonville Jaguars',abbr:'jax'},{name:'Kansas City Chiefs',abbr:'kc'},
      {name:'Las Vegas Raiders',abbr:'lv'},{name:'Los Angeles Chargers',abbr:'lac'},
      {name:'Los Angeles Rams',abbr:'lar'},{name:'Miami Dolphins',abbr:'mia'},
      {name:'Minnesota Vikings',abbr:'min'},{name:'New England Patriots',abbr:'ne'},
      {name:'New Orleans Saints',abbr:'no'},{name:'New York Giants',abbr:'nyg'},
      {name:'New York Jets',abbr:'nyj'},{name:'Philadelphia Eagles',abbr:'phi'},
      {name:'Pittsburgh Steelers',abbr:'pit'},{name:'San Francisco 49ers',abbr:'sf'},
      {name:'Seattle Seahawks',abbr:'sea'},{name:'Tampa Bay Buccaneers',abbr:'tb'},
      {name:'Tennessee Titans',abbr:'ten'},{name:'Washington Commanders',abbr:'wsh'}
    ]
  },
  NBA: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/nba/500/${abbr}.png`,
    teams: [
      {name:'Atlanta Hawks',abbr:'atl'},{name:'Boston Celtics',abbr:'bos'},
      {name:'Brooklyn Nets',abbr:'bkn'},{name:'Charlotte Hornets',abbr:'cha'},
      {name:'Chicago Bulls',abbr:'chi'},{name:'Cleveland Cavaliers',abbr:'cle'},
      {name:'Dallas Mavericks',abbr:'dal'},{name:'Denver Nuggets',abbr:'den'},
      {name:'Detroit Pistons',abbr:'det'},{name:'Golden State Warriors',abbr:'gs'},
      {name:'Houston Rockets',abbr:'hou'},{name:'Indiana Pacers',abbr:'ind'},
      {name:'LA Clippers',abbr:'lac'},{name:'Los Angeles Lakers',abbr:'lal'},
      {name:'Memphis Grizzlies',abbr:'mem'},{name:'Miami Heat',abbr:'mia'},
      {name:'Milwaukee Bucks',abbr:'mil'},{name:'Minnesota Timberwolves',abbr:'min'},
      {name:'New Orleans Pelicans',abbr:'no'},{name:'New York Knicks',abbr:'ny'},
      {name:'Oklahoma City Thunder',abbr:'okc'},{name:'Orlando Magic',abbr:'orl'},
      {name:'Philadelphia 76ers',abbr:'phi'},{name:'Phoenix Suns',abbr:'phx'},
      {name:'Portland Trail Blazers',abbr:'por'},{name:'Sacramento Kings',abbr:'sac'},
      {name:'San Antonio Spurs',abbr:'sa'},{name:'Toronto Raptors',abbr:'tor'},
      {name:'Utah Jazz',abbr:'utah'},{name:'Washington Wizards',abbr:'wsh'}
    ]
  },
  MLB: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/mlb/500/${abbr}.png`,
    teams: [
      {name:'Arizona Diamondbacks',abbr:'ari'},{name:'Atlanta Braves',abbr:'atl'},
      {name:'Baltimore Orioles',abbr:'bal'},{name:'Boston Red Sox',abbr:'bos'},
      {name:'Chicago Cubs',abbr:'chc'},{name:'Chicago White Sox',abbr:'chw'},
      {name:'Cincinnati Reds',abbr:'cin'},{name:'Cleveland Guardians',abbr:'cle'},
      {name:'Colorado Rockies',abbr:'col'},{name:'Detroit Tigers',abbr:'det'},
      {name:'Houston Astros',abbr:'hou'},{name:'Kansas City Royals',abbr:'kc'},
      {name:'Los Angeles Angels',abbr:'laa'},{name:'Los Angeles Dodgers',abbr:'lad'},
      {name:'Miami Marlins',abbr:'mia'},{name:'Milwaukee Brewers',abbr:'mil'},
      {name:'Minnesota Twins',abbr:'min'},{name:'New York Mets',abbr:'nym'},
      {name:'New York Yankees',abbr:'nyy'},{name:'Oakland Athletics',abbr:'oak'},
      {name:'Philadelphia Phillies',abbr:'phi'},{name:'Pittsburgh Pirates',abbr:'pit'},
      {name:'San Diego Padres',abbr:'sd'},{name:'San Francisco Giants',abbr:'sf'},
      {name:'Seattle Mariners',abbr:'sea'},{name:'St. Louis Cardinals',abbr:'stl'},
      {name:'Tampa Bay Rays',abbr:'tb'},{name:'Texas Rangers',abbr:'tex'},
      {name:'Toronto Blue Jays',abbr:'tor'},{name:'Washington Nationals',abbr:'wsh'}
    ]
  },
  NHL: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/nhl/500/${abbr}.png`,
    teams: [
      {name:'Anaheim Ducks',abbr:'ana'},{name:'Arizona Coyotes',abbr:'ari'},
      {name:'Boston Bruins',abbr:'bos'},{name:'Buffalo Sabres',abbr:'buf'},
      {name:'Calgary Flames',abbr:'cgy'},{name:'Carolina Hurricanes',abbr:'car'},
      {name:'Chicago Blackhawks',abbr:'chi'},{name:'Colorado Avalanche',abbr:'col'},
      {name:'Columbus Blue Jackets',abbr:'cbj'},{name:'Dallas Stars',abbr:'dal'},
      {name:'Detroit Red Wings',abbr:'det'},{name:'Edmonton Oilers',abbr:'edm'},
      {name:'Florida Panthers',abbr:'fla'},{name:'Los Angeles Kings',abbr:'la'},
      {name:'Minnesota Wild',abbr:'min'},{name:'Montreal Canadiens',abbr:'mtl'},
      {name:'Nashville Predators',abbr:'nsh'},{name:'New Jersey Devils',abbr:'nj'},
      {name:'New York Islanders',abbr:'nyi'},{name:'New York Rangers',abbr:'nyr'},
      {name:'Ottawa Senators',abbr:'ott'},{name:'Philadelphia Flyers',abbr:'phi'},
      {name:'Pittsburgh Penguins',abbr:'pit'},{name:'San Jose Sharks',abbr:'sj'},
      {name:'Seattle Kraken',abbr:'sea'},{name:'St. Louis Blues',abbr:'stl'},
      {name:'Tampa Bay Lightning',abbr:'tb'},{name:'Toronto Maple Leafs',abbr:'tor'},
      {name:'Utah Hockey Club',abbr:'utah'},{name:'Vancouver Canucks',abbr:'van'},
      {name:'Vegas Golden Knights',abbr:'vgk'},{name:'Washington Capitals',abbr:'wsh'},
      {name:'Winnipeg Jets',abbr:'wpg'}
    ]
  },
  NCAAF: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${abbr}.png`,
    teams: [
      {name:'Alabama',abbr:'333'},{name:'Arkansas',abbr:'8'},{name:'Auburn',abbr:'2'},
      {name:'Clemson',abbr:'228'},{name:'Florida',abbr:'57'},{name:'Florida State',abbr:'52'},
      {name:'Georgia',abbr:'61'},{name:'Iowa',abbr:'2294'},{name:'LSU',abbr:'99'},
      {name:'Michigan',abbr:'130'},{name:'Michigan State',abbr:'127'},
      {name:'Mississippi State',abbr:'344'},{name:'Nebraska',abbr:'158'},
      {name:'Notre Dame',abbr:'87'},{name:'Ohio State',abbr:'194'},
      {name:'Oklahoma',abbr:'201'},{name:'Ole Miss',abbr:'145'},{name:'Oregon',abbr:'2483'},
      {name:'Penn State',abbr:'213'},{name:'Texas',abbr:'251'},{name:'Texas A&M',abbr:'245'},
      {name:'Tennessee',abbr:'2633'},{name:'USC',abbr:'30'},{name:'Utah',abbr:'254'},
      {name:'Washington',abbr:'264'},{name:'Wisconsin',abbr:'275'}
    ]
  },
  NCAAB: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${abbr}.png`,
    teams: [
      {name:'Arizona',abbr:'12'},{name:'Arkansas',abbr:'8'},{name:'Auburn',abbr:'2'},
      {name:'Baylor',abbr:'239'},{name:'Connecticut',abbr:'41'},{name:'Duke',abbr:'150'},
      {name:'Gonzaga',abbr:'2250'},{name:'Houston',abbr:'248'},{name:'Illinois',abbr:'356'},
      {name:'Indiana',abbr:'84'},{name:'Iowa',abbr:'2294'},{name:'Kansas',abbr:'2305'},
      {name:'Kentucky',abbr:'96'},{name:'Louisville',abbr:'97'},{name:'Marquette',abbr:'269'},
      {name:'Michigan',abbr:'130'},{name:'Michigan State',abbr:'127'},
      {name:'North Carolina',abbr:'153'},{name:'Ohio State',abbr:'194'},
      {name:'Purdue',abbr:'2509'},{name:'Tennessee',abbr:'2633'},
      {name:'Texas',abbr:'251'},{name:'UCLA',abbr:'26'},{name:'Villanova',abbr:'222'},
      {name:'Virginia',abbr:'258'}
    ]
  },
  NCAAW: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/ncaa/500/${abbr}.png`,
    teams: [
      {name:'Baylor',abbr:'239'},{name:'Connecticut',abbr:'41'},{name:'Duke',abbr:'150'},
      {name:'Indiana',abbr:'84'},{name:'Iowa',abbr:'2294'},{name:'LSU',abbr:'99'},
      {name:'Michigan',abbr:'130'},{name:'North Carolina',abbr:'153'},
      {name:'Ohio State',abbr:'194'},{name:'Oregon',abbr:'2483'},
      {name:'South Carolina',abbr:'2579'},{name:'Stanford',abbr:'24'},
      {name:'Tennessee',abbr:'2633'},{name:'Texas',abbr:'251'},
      {name:'UCLA',abbr:'26'},{name:'Virginia Tech',abbr:'259'}
    ]
  },
  WNBA: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/wnba/500/${abbr}.png`,
    teams: [
      {name:'Atlanta Dream',abbr:'atl'},{name:'Chicago Sky',abbr:'chi'},
      {name:'Connecticut Sun',abbr:'conn'},{name:'Dallas Wings',abbr:'dal'},
      {name:'Indiana Fever',abbr:'ind'},{name:'Las Vegas Aces',abbr:'lv'},
      {name:'Los Angeles Sparks',abbr:'la'},{name:'Minnesota Lynx',abbr:'min'},
      {name:'New York Liberty',abbr:'ny'},{name:'Phoenix Mercury',abbr:'phx'},
      {name:'Seattle Storm',abbr:'sea'},{name:'Washington Mystics',abbr:'wsh'}
    ]
  },
  Soccer: {
    logo: (abbr) => `https://a.espncdn.com/i/teamlogos/soccer/500/${abbr}.png`,
    teams: [
      {name:'Arsenal',abbr:'359'},{name:'Aston Villa',abbr:'1138'},{name:'Barcelona',abbr:'83'},
      {name:'Chelsea',abbr:'363'},{name:'Liverpool',abbr:'364'},{name:'Manchester City',abbr:'382'},
      {name:'Manchester United',abbr:'360'},{name:'PSG',abbr:'160'},{name:'Real Madrid',abbr:'86'},
      {name:'Tottenham',abbr:'367'},{name:'Atlanta United',abbr:'18594'},{name:'LAFC',abbr:'18924'},
      {name:'Inter Miami',abbr:'32783'},{name:'LA Galaxy',abbr:'528'},
      {name:'Portland Timbers',abbr:'10740'},{name:'Seattle Sounders',abbr:'9726'}
    ]
  }
};
