function cell(j, i, s) {

  this.pos = createVector((i * s) + s / 2, (j * s) + s / 2)
  this.size = s
  this.mode = "New"

  this.i = i // filas
  this.j = j // columnas

  this.neighbours = []
  this.previousMode = "New"

  this.near = 0
  this.simulatedNear = 0

  this.display = function() {
    switch (this.mode) {
      case "New":
        fill(180)
        rectMode(CENTER)
        rect(this.pos.x, this.pos.y, this.size, this.size)
        break;
      case "Mine":
        fill(180)
        rectMode(CENTER)
        rect(this.pos.x, this.pos.y, this.size, this.size)
        break;
      case "Clicked":
        fill(100)
        rectMode(CENTER)
        rect(this.pos.x, this.pos.y, this.size, this.size)
        textSize(s / 2);
        fill(0)
        if (this.near > 0) text(this.near, this.pos.x - s / 5, this.pos.y + s / 4);
        break
      case "Flaged":
        fill(0, 100, 0)
        rectMode(CENTER)
        rect(this.pos.x, this.pos.y, this.size, this.size)
        break

    }

  }

  this.check = function(grid) {


    this.neighbours.push(index(this.j, this.i - 1))
    this.neighbours.push(index(this.j + 1, this.i))
    this.neighbours.push(index(this.j, this.i + 1))
    this.neighbours.push(index(this.j - 1, this.i))
    this.neighbours.push(index(this.j - 1, this.i - 1))
    this.neighbours.push(index(this.j - 1, this.i + 1))
    this.neighbours.push(index(this.j + 1, this.i - 1))
    this.neighbours.push(index(this.j + 1, this.i + 1))

    for (var i = 0; i < this.neighbours.length; i++) {
      if (cells[this.neighbours[i]] != undefined) {
        var checking = cells[this.neighbours[i]]
        if (checking.mode == "Mine") this.near++
      }
    }


    this.simulatedNear = this.near
  }

  this.changeMode = function(mode) {
    this.mode = mode
  }

  this.click = function() {
    if (this.mode != "Clicked" && this.mode != "Flaged") {
      if (this.mode == "Mine") {
        noLoop()
        console.log("YOU LOSE")
      } else if (this.near == 0) {
        this.mode = "Clicked"
        for (var i = 0; i < this.neighbours.length; i++) {
          if (cells[this.neighbours[i]] != undefined && cells[this.neighbours[i]].mode != "Clicked") {
            qeue.push(cells[this.neighbours[i]])
          }
        }

      } else {
        this.mode = "Clicked"
      }
    }

  }

  this.resetNear = function() {
    this.simulatedNear = this.near
    for (var i = 0; i < this.neighbours.length; i++) {
      if (cells[this.neighbours[i]] != undefined && cells[this.neighbours[i]].mode == "Flaged") this.simulatedNear--
    }
  }
}
