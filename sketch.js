var cells = []
var cant = 16
var s;
var minas = 40
var qeue = []
var cellsClicked = 0
var minesLeft = minas
var count = 0
var auto = true

function setup() {
  createCanvas(642, 642)
  s = floor(window.height / cant)
  ai = new robot()
  
  
  params = getURLParams()
  if (params.minas) {
    minas = (parseInt(params.minas))
  } 
  if (params.size) {
    cant = parseInt(params.size)
  }
  
  for (var j = 0; j < cant; j++) { // columnas
    for (var i = 0; i < cant; i++) { // filas
      cells.push(new cell(j, i, s))
    }
  }

  for (var i = 0; i < minas; i++) {
    var r = random(cells)
    if (r.mode != "Mine") {
      r.changeMode("Mine")
    } else {
      i--
    }
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].check(cells)
  }
  
  
//  if (auto) cells[0].click()

}

function draw() {

  minesLeft = minas
  count = 0
  background(150)
  if (qeue.length == 0 && auto) {
       ai.firstStep(cells)
       ai.secondStep(cells)
      if (ai.firstStep(cells) == undefined && ai.secondStep(cells) == undefined && cellsClicked > sq(cant) / 3){
        ai.tank(cells)
      }
  }
  cellsClicked = 0

  for (var i = 0; i < qeue.length; i++) {
    qeue[0].click()
    qeue.splice(0, 1)
  }


  for (var i = 0; i < cells.length; i++) {
    cells[i].display()
    if (cells[i].mode == "Clicked") {
      cellsClicked++
    } else if (cells[i].mode == "Flaged") {
      minesLeft--
    } else if (cells[i].mode == "Mine") {
      count++
    }
  }
  // console.log(minesLeft)
  if (cellsClicked == cells.length - minas || count == 0) {
    noLoop()
    console.log("YOU WON")
  }
}

function mousePressed() {

  var record = Infinity
  var index = -1

  for (var i = 0; i < cells.length; i++) {
    var d = dist(mouseX, mouseY, cells[i].pos.x, cells[i].pos.y)
    if (d < record) {

      record = d
      index = i
    }
  }
  if (mouseButton == LEFT) {
    if (index > -1 && cells[index].mode != "Clicked") {
      cells[index].click()
    }
  } else {
    if (index > -1 && cells[index].mode != "Clicked") {
      if (cells[index].mode == "Flaged") {
        cells[index].changeMode(cells[index].previousMode)
      } else {
        cells[index].previousMode = cells[index].mode
        cells[index].changeMode("Flaged")
      }
    }
  }
}



function index(j, i) {
  if (i < 0 || j < 0 || i > cant - 1 || j > cant - 1) {
    return -1;
  }
  return i + j * cant;
}
