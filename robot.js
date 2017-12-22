function robot() {

  this.looking = []
  this.border = []
  this.firstStep = function(list) {
    var clicked = undefined
    for (var i = 0; i < list.length; i++) {
      var nearBlocks = 0
      if (list[i].mode == "Clicked") {
        for (var j = 0; j < list[i].neighbours.length; j++) {
          if (list[list[i].neighbours[j]] != undefined && list[list[i].neighbours[j]].mode != "Clicked") {
            nearBlocks++
          }
        }
        if (nearBlocks == list[i].near) {
          for (var j = 0; j < list[i].neighbours.length; j++) {
            if (list[list[i].neighbours[j]] != undefined && list[list[i].neighbours[j]].mode != "Clicked") {
              list[list[i].neighbours[j]].changeMode("Flaged")
              clicked = true
            }
          }
        }
      }
    }
    return clicked
  }

  this.secondStep = function(list) {
    var clicked = undefined
    for (var i = 0; i < list.length; i++) {
      var nearFlags = 0
      if (list[i].mode == "Clicked") {
        for (var j = 0; j < list[i].neighbours.length; j++) {
          if (list[list[i].neighbours[j]] != undefined && list[list[i].neighbours[j]].mode == "Flaged") {
            nearFlags++
          }
        }
        if (nearFlags == list[i].near) {
          for (var j = 0; j < list[i].neighbours.length; j++) {
            if (list[list[i].neighbours[j]] != undefined && list[list[i].neighbours[j]].mode != "Flaged") {
              list[list[i].neighbours[j]].click()
              clicked = true
            }
          }
        }
      }
    }
    return clicked
  }

  this.tank = function(list) {
    this.looking = []
    this.border = []

    var border = []
    for (var i = 0; i < list.length; i++) {
      if (list[i].mode == "Clicked") {
        for (var j = 0; j < list[i].neighbours.length; j++) {
          if (list[list[i].neighbours[j]] != undefined && (list[list[i].neighbours[j]].mode == "New" || list[list[i].neighbours[j]].mode == "Mine")) {
            var repeated = false
            for (var k = 0; k < border.length; k++) {
              if (border[k] == list[list[i].neighbours[j]]) {
                repeated = true
              }
            }
            if (!repeated) border.push(list[list[i].neighbours[j]])
          }
        }
      }
    }

    for (var i = 1; i < pow(2, border.length); i++) {
      var b = i.toString(2)
      var binary = []
      for (var j = 0; j < b.length; j++) {
        binary.push(b.charAt(j))
      }

      var chance = []
      for (var j = 0; j < border.length; j++) {
        if (binary.length < border.length) {
          binary.reverse()
          binary.push("0")
          binary.reverse()
          j--
        } else {
          var state = binary[j]
          if (state == "1") {
            chance.push(border[j])
          }
        }
      }
      //console.log(chance)
      if (chance.length <= minesLeft) this.checkChance(chance, list, border)
    }
    ai.tankTwo()

  }

  this.checkChance = function(mines, list, border) {
    //  console.log("Checking")
    for (var i = 0; i < mines.length; i++) {
      for (var j = 0; j < mines[i].neighbours.length; j++) {
        if (cells[mines[i].neighbours[j]] != undefined && cells[mines[i].neighbours[j]].mode == "Clicked") cells[mines[i].neighbours[j]].simulatedNear--
      }
    }
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].neighbours.length; j++) {
        if (cells[list[i].neighbours[j]] != undefined && cells[list[i].neighbours[j]].mode == "Clicked" && cells[list[i].neighbours[j]].simulatedNear != 0) {
          //  console.log("Checking failed")
          this.reset(list)
          return false
        }
      }
    }

    this.decide(mines, border)
    this.reset(list)
  }

  this.decide = function(list, border) {
    console.log("checking succesfull")
    console.log(list)
    for (var i = 0; i < list.length; i++) {
      this.looking.push(index(list[i].j, list[i].i))
    }
    this.border = border
  }


  this.reset = function(list) {
    //  console.log("Reseting")
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].neighbours.length; j++) {
        if (cells[list[i].neighbours[j]] != undefined) {
          cells[list[i].neighbours[j]].resetNear()
        }
      }
    }
  }

  this.tankTwo = function() {
    var counter = []
    for (var i = 0; i < this.border.length; i++) {
      var c = 0
      //console.log(this.looking)
      this.border[i] = index(this.border[i].j, this.border[i].i)
      for (var j = 0; j < this.looking.length; j++) {
        if (this.border[i] == this.looking[j]) {
          c++
        }
      }
      counter.push(c)
    }
    var m = 0
    var ind
    for (var i = 0; i < counter.length; i++) {
      if (counter[i] == 0) {
        cells[this.border[i]].click()
      } else if (counter[i] > m) {
        m = counter[i]
        ind = i
      }
    }
    if (this.border.length > 0) {

        console.log("Guessing with " + m + " in " + this.looking.length)
        cells[this.border[ind]].changeMode("Flaged")

      //console.log(counter)
    }
  }






}
