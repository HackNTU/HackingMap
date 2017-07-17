const appconfig = {
  'firebase_config': {
    apiKey: 'AIzaSyCK5_1a6NghhFZxL4a6csnrzHLkiouOQM4',
    authDomain: 'hacking-map.firebaseapp.com',
    databaseURL: 'https://hacking-map.firebaseio.com',
    projectId: 'hacking-map',
    storageBucket: 'hacking-map.appspot.com',
    messagingSenderId: '729739716516'
  },
  'discord_config': {
    turnOn: false
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
/* eslint-disable */
//               1    2    3    4    5    6    7    8
const x_coor = [295, 341, 384, 430, 523, 569, 614, 660]
const y_coor = [
            293,  293  + 16,  // 1
            356,  356  + 16,  // 2
            421,  421  + 16,  // 3
            484,  484  + 16,  // 4
            549,  549  + 16,  // 5
            613,  613  + 16,  // 6
            677,  677  + 16,  // 7
            740,  740  + 16,  // 8
            804,  804  + 16,  // 9
            868,  868  + 16,  // 10
            932,  932  + 16,  // 11
            996,  996  + 16,  // 12
            1060, 1060 + 16,  // 13
            1124, 1124 + 16,  // 14
            1188, 1188 + 16   // 15
          ]
/* eslint-enable */

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
appconfig.map.table_coor = generateTableCoor(x_coor, y_coor)

export default appconfig
