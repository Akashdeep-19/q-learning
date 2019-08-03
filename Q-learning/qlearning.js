var w = 50
var rows = 600/w;
var player;
var reward = -1;
var lr = 0.5;
var dr = 0.98;
var steps = 0;
var loop = true;

function make2DArray(rows,cols){
    var arr = new Array(rows);
    for(var i=0;i<arr.length;i++){
        arr[i] = new Array(cols);
    }
    return arr;
}

function setup(){
    createCanvas(600,600);

    grid = make2DArray(rows,rows);
    for(var i=0;i<rows;i++){
        for(var j=0;j<rows;j++){
            grid[i][j] = new Cell(i,j);
            if(random() < 0.3)
              grid[i][j].obstacle = true;

        }
    }
    grid[0][0].obstacle = false;
    grid[rows-1][rows-1].obstacle = false;
    player = new Player()
  
  for(i = 0;i < 20000 && loop;i++){
    grid[player.i][player.j].states();
    if(steps >= 100){
      player.i = 0;
      player.j = 0;
      steps = 0;
      reward = -1;
    }
  }
  //frameRate(5);
}

function draw(){
    background(0);

    for(var j=0;j<rows;j++){
        for(var i=0;i<rows;i++){
            grid[i][j].show();

        }
    }
    
    grid[player.i][player.j].states();
      if(steps >= 100){
        player.i = 0;
        player.j = 0;
        steps = 0;
        reward = -1;
      }

    player.show();
}

function keyPressed(){

    if(keyCode === UP_ARROW){
        player.move(0,1);
    }

    if(keyCode === DOWN_ARROW){
        player.move(0,-1);
    }

    if(keyCode === RIGHT_ARROW){
         player.move(1,0);
    }

    if(keyCode === LEFT_ARROW){
       player.move(-1,0);
    }
  }

function Cell(i,j){
    this.i = i;
    this.j = j;
    this.qVals = [random(-2,0),random(-2,0),random(-2,0),random(-2,0)]
    this.visited = false;
    this.obstacle = false;
    this.c = 10;

    this.show = function(){
        var x = this.i*w;
        var y = this.j*w;
        if(!this.visited && this.i == player.i && this.j == player.j)
          this.visited  = true;
        if(this.i == player.i && this.j == player.j)
          this.c++;
        
        if(this.obstacle)
          fill(50);
        else
          fill(201);

        if(this.i == rows-1 && this.j == rows-1)
          fill(20,200,30)
        rect(x,y,w,w);
        textSize(12)
        textAlign(CENTER)
        fill(0)
        text(max(this.qVals).toFixed(2),x+w/2,y+w/2)
    }

    this.states = function(){
      if(this.i == player.i && this.j == player.j){

        x = player.actions[this.qVals.indexOf(max(this.qVals))][0]
        y = player.actions[this.qVals.indexOf(max(this.qVals))][1]
        player.move(x,y);

        var q = max(this.qVals);
        var f_q = max(grid[player.i][player.j].qVals);
        var n_q  = (1-lr)*q + (reward + dr*f_q)*lr;
        var a = this.qVals.indexOf(q)
        this.qVals[a] = n_q;

        if(player.i == rows-1 && player.j == rows-1){
          reward = 0;
          steps = 0;
          this.qVals[a] = 1;
          player.i = 0;
          player.j = 0;
          console.log('reached')
        }
        steps++;
      }
    }
}

function Player(){
    this.i = 0;
    this.j = 0;
    this.blocked = false;
    this.actions = [[1,0],[-1,0],[0,1],[0,-1]]

    this.show = function(){
        fill(0,0,255);
        rect(this.i*w,this.j*w,w,w);
    }

    this.move = function(i,j){
        if(this.i+i < 0 || this.i+i >= rows || this.j-j < 0 || this.j-j >= rows)
            this.blocked = true;
        else if(grid[this.i+i][this.j-j].obstacle)
          this.blocked = true;
        if(!this.blocked){
            this.i += i;
            this.j -= j;
        }
        this.blocked = false;
    }
  }
