
var levels = [
  {
    "name": "Level 1",
    "id": "1",
    "layers": [
      {
        "name": "Layer 1",
        "tileSet": "1",
        "data": [["1",0],["1",1],["1",2]]
      }
    ]
  }
];

var tileSets = [
  {
    "name": "Tile Set 1",
    "id": "1",
    "tileGroups": [
      {
        "id": "1",
        "sourcePath": "img/tree1.png"
      }
    ]
  }
];

retro2d.imageLoader().loadPath('img/tree1.png').ready(function(image) {

});


var levelEditor = retro2d.levelEditorViewport({
  tileSize: 48,
  canvas: document.getElementById('myCanvas'),
  layers: levels[0].layers,
  tileSet: tileSets[0]
});


