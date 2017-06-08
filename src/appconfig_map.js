/* eslint-disable */
const map = {

  name: '花博公園',

  /* 地圖長寬（以下單位皆為公尺） */
  map_width: 842,
  map_height: 1286,

  /* 場地輪廓 */
  border: {
    1: { x1: 0,    y1: 0,   x2: 106,  y2: 0  },
    2: { x1: 106,  y1: 0,   x2: 106,  y2: 60 },
    3: { x1: 106,  y1: 60,  x2: 31,   y2: 60 },
    4: { x1: 31,   y1: 60,  x2: 31,   y2: 50 },
    5: { x1: 31,   y1: 50,  x2: 0,    y2: 50 },
    6: { x1: 0,    y1: 50,  x2: 0,    y2: 0  }
  },

  /* 場地物件（柱子、門） */
  rectangles: {
    // test:         {tag: 'test',x: 10,   y: 10, w: 5, h:5 },
    topRightEnd:  {tag: 'x',   x: 106,  y: 60, w: 10, h: 10},
    door1:        {tag: '大門', x: 89.5, y: 0,  w: 3, h: 0.5},
    door2:        {tag: '後門', x: 10, y: 50,  w: 3, h: 0.5}
  }
}
export default map
