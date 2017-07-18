const appconfig = {
  general: {
    sponsor: false,
    discord: false
  },
  'firebase_config': {
    apiKey: 'AIzaSyCK5_1a6NghhFZxL4a6csnrzHLkiouOQM4',
    authDomain: 'hacking-map.firebaseapp.com',
    databaseURL: 'https://hacking-map.firebaseio.com',
    projectId: 'hacking-map',
    storageBucket: 'hacking-map.appspot.com',
    messagingSenderId: '729739716516'
  },
  event_info: {
    start_date: new Date('Mon Jul 21 2017 00:09:00 GMT+0800 (CST)'),
    end_date: new Date('Mon Jul 23 2017 00:17:00 GMT+0800 (CST)')
  },
  map: {
    map_width: 842,
    map_height: 1286,
    table_coor: null // added below
  }
}

const coorX = [295, 341, 384, 430, 523, 569, 614, 660]
const coorY = [301, 364, 429, 492, 557, 621, 685, 748, 812, 876, 940, 1004, 1068, 1132, 1196]

// Generate table coordinate
function generateTableCoor (xs, ys) {
  let tableCoor = {
    0: {
      no: 0,
      x: -150,
      y: 400
    }
  }
  for (let i = 0; i < xs.length * ys.length; i++) {
    tableCoor[i + 1] = {
      no: i + 1,
      x: xs[i % xs.length],
      y: ys[Math.floor(i / xs.length) % ys.length]
    }
  }
  return tableCoor
}
appconfig.map.table_coor = generateTableCoor(coorX, coorY)

export default appconfig
