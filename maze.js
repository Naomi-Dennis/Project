 var tiles = [];
 var visitedStk = [];
 var height = 450 // these numbers were tested, don't change
 var width = 450 // these numbers were tested don't change
 var tile_size = 50;
 var amt_per_side;
 var pellets = [];
 var path = [];
 var loaded = false;
 class Cell {
     constructor(nRow, nCol) {
         this.row = nRow;
         this.col = nCol;
         this.visited = false;
         this.left = true;
         this.right = true;
         this.top = true;
         this.bottom = true;
         this.pelletCheck = false;
         this.x = 0;
         this.y = 0;
     }
 }
 class Maze {
     constructor() {
         /*Initialize needed variables. */
         amt_per_side = Math.floor(height / tile_size);
         ctx.lineWidth = 7;
         this.mazeColor = "#21160b"
     }
     init(screen) {
         this.screen = screen;
         this.drawBase();
     }
     render() {
         this.redrawTiles();

     }
     configLineStyle() {
         // linear gradient from start to end of line
         var grad = ctx.createLinearGradient(50, 50, 150, 150);
         grad.addColorStop(0, "#000000");
         grad.addColorStop(1, "#dbdbdb");
         grad.addColorStop(1, "#dbdbdb");
         grad.addColorStop(1, "#000000");
         ctx.lineWidth = 5;
         ctx.strokeStyle = grad;

     }
     drawLine(sX, sY, eX, eY) {
         /*Draw a line from the starting X and Y positions to  the ending X and Y positions*/
         //ctx.moveTo(sX, sY);
         //ctx.lineTo(eX, eY);
         ctx.fillStyle = this.mazeColor;
         ctx.fillRect(sX, sY, eX, eY)
     }
     drawCell(y, x, side, tile) {
         /* Draw cell based on wall properties */
         var left = tile.left;
         var right = tile.right;
         var top = tile.top;
         var bottom = tile.bottom;
         var size = tile_size;
         var small_size = tile_size / 2;


         if (left) {
             this.drawLine(x, y, small_size, size);
         }

         if (right) {
             this.drawLine(x + size, y, small_size, size);
         }

         if (bottom) {
             this.drawLine(x, y + size, size, small_size)
         }

         if (top) {
             this.drawLine(x, y, size, small_size);
         }
     }
     drawBase() {
         /* Draw the tiles on the canvas*/
         var side = tile_size;
         for (var i = 0; i < amt_per_side - 1; i++) {
             tiles[i] = [];
             for (var j = 0; j < amt_per_side - 1; j++) {
                 tiles[i].push(new Cell(i, j));
                 tiles[i][j].x = j * side;
                 tiles[i][j].y = i * side;
                 this.drawCell(tiles[i][j].x, tiles[i][j].y, side, tiles[i][j]);
             }
         }
         this.generateMaze(0, 0);
     }
     clearCanvas() {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
     }
     redrawTiles() {
         var currentTile;
         this.clearCanvas();
         var side = tile_size;
         for (var i = 0; i < amt_per_side - 1; i++) {
             for (var j = 0; j < amt_per_side - 1; j++) {
                 currentTile = tiles[i][j];
                 this.drawCell(i * side, j * side, side, currentTile);
             }
         }
     }
     reDrawMaze() {
         /*Button Handle for 'New Maze' */
         var startCol = Math.floor(Math.random() * tile_size) - 1;
         var startRow = Math.floor(Math.random() * tile_size) - 1;
         this.clearCanvas();
         this.drawBase();

     }
     getEndingLocation() {
         var max_rows = tiles.length;
         var max_cols = tiles[0].length;
         var last_row_quarter = max_rows - Math.floor(max_rows * .25);
         var last_col_quarter = max_cols - Math.floor(max_cols * .25);
         var current_row = last_row_quarter;
         var current_col = last_col_quarter;
         var locationFound = false;
         var currentTile;
         var offset = 30;
         var location = {
             x: 0,
             y: 0
         }
         var point = new EndingPoint();
         for (; current_row < max_rows; current_row++) {
             for (; current_col < max_cols; current_col++) {
                 //perform wall check
                 //  tiles[current_row][current_col] = ending_point;
                 currentTile = tiles[current_row][current_col];
                 if (!currentTile.left) {
                     location.x = currentTile.x;
                     location.y = currentTile.y + offset;
                     locationFound = true;
                     break;
                 } else if (!currentTile.right) {
                     location.x = currentTile.x + tile_size;
                     location.y = currentTile.y + offset;
                     locationFound = true;
                     break;
                 } else if (!currentTile.top) {
                     location.y = currentTile.y + offset;
                     location.x = currentTile.x + offset
                     locationFound = true;
                     break;
                 } else if (!currentTile.bottom) {
                     location.y = currentTile.y + tile_size;
                     location.x = currentTile.x + offset;
                     locationFound = true;
                     break;
                 };
             }
             if (locationFound = true) {
                 break;
             }
         }
         point.x = location.x;
         point.y = location.y;
         this.screen.addActor(point);
         point.interactWithLevel(this);
     }
     getInitialPlayerLocation() {
         var currentTile;
         var locationFound = false;
         var location = {
             x: 0,
             y: 0
         }
         for (var row in tiles) {
             for (var col in tiles) {
                 currentTile = tiles[row][col];
                 if (!currentTile.left) {
                     location.x = currentTile.x;
                     location.y = currentTile.y + 40;
                     locationFound = true;
                     break;
                 } else if (!currentTile.right) {
                     location.x = currentTile.x + tile_size;
                     location.y = currentTile.y + 40;
                     locationFound = true;
                     break;
                 } else if (!currentTile.top) {
                     location.y = currentTile.y + 40;
                     location.x = currentTile.x + 40
                     locationFound = true;
                     break;
                 } else if (!currentTile.bottom) {
                     location.y = currentTile.y + tile_size;
                     location.x = currentTile.x + 40;
                     locationFound = true;
                     break;
                 };
             }
             if (locationFound) {
                 break;
             }
         }
         return location;
     }
     generatePellets() {
         var currentTile;
         var newPellet;
         for (var row in tiles) {
             for (var col in tiles) {

                 currentTile = tiles[row][col];
                 newPellet = new Pellet();
                 if (!currentTile.left) {
                     newPellet.x = currentTile.x;
                     newPellet.y = currentTile.y + 40;
                 } else if (!currentTile.right) {
                     newPellet.x = currentTile.x + tile_size;
                     newPellet.y = currentTile.y + 40;
                 } else if (!currentTile.top) {
                     newPellet.y = currentTile.y + 40;
                     newPellet.x = currentTile.x + 40
                 } else if (!currentTile.bottom) {
                     newPellet.y = currentTile.y + tile_size;
                     newPellet.x = currentTile.x + 40;
                 };
                 this.screen.addActor(newPellet);
                 newPellet.interactWithLevel(this)
                 pellets.push(newPellet);
             }

         }

     }
     generateMaze(row, col) {
         /* Depth First Search*/
         var currentTile = tiles[row][col];
         var neighbor = this.findNeighbor(row, col);
         /*Check if cell has been visited */
         if (!currentTile.visited) {
             currentTile.visited = true;
             visitedStk.push(currentTile);
         }
         /* Break Case */
         if (visitedStk.length == 0) {
             this.redrawTiles();
             return;
         }
         /*If a neighbor is found*/
         else if (neighbor !== undefined) {
             /*Break the wall in between*/
             var added = false;
             if (neighbor.row > currentTile.row) { /*Bottom*/
                 currentTile.bottom = false;
                 neighbor.top = false;
                 added = true;
             }
             if (neighbor.row < currentTile.row) { /*Top*/
                 currentTile.top = false;
                 neighbor.bottom = false;
                 added = true;
             }
             if (neighbor.col < currentTile.col) { /*Left*/
                 currentTile.left = false;
                 neighbor.right = false;
                 added = true;
             }
             if (neighbor.col > currentTile.col) { /*Right*/
                 currentTile.right = false;
                 neighbor.left = false;
                 added = true;
             }
             /* Generate Pellet in free room */
             (added) ? path.push(currentTile): undefined;
             /*Update Current Tile*/
             currentTile = neighbor;
         }
         /*If no neighbor was found, backtrack to a previous cell on the stacke*/
         else {
             var backtrack = visitedStk.pop();
             this.generateMaze(backtrack.row, backtrack.col);
             currentTile = backtrack;
         }
         this.generateMaze(currentTile.row, currentTile.col);
     }
     findNeighbor(row, col) {
         /*Find the neighbor of the given tile using the tiles array.*/
         var top, bottom, left, right;
         var stk = []
         var neighbor = undefined;
         var n;
         /* Check for left neighbor */
         if (row >= 0 && col > 0) {
             left = tiles[row][col - 1];
             (!left.visited) ? stk.push(left): undefined
         }

         /* Check for right neighbor */
         if (row >= 0 && col < amt_per_side - 2) {
             right = tiles[row][col + 1];
             (!right.visited) ? stk.push(right): undefined;
         }

         /* Check for top neighbor */
         if (col >= 0 && row > 0) {
             top = tiles[row - 1][col];
             (!top.visited) ? stk.push(top): undefined
         }
         /* Check for bottom neighbor */
         if (col >= 0 && row < amt_per_side - 2) {
             bottom = tiles[row + 1][col];
             (!bottom.visited) ? stk.push(bottom): undefined
         }


         var len;
         while (stk.length > 0) {
             /* Choose a random neighbor */
             len = stk.length;
             n = Math.floor(Math.random() * stk.length);
             neighbor = stk[n];
             if (!neighbor.visited) {
                 break;
             } else {
                 stk.splice(n, 1);
             }
         }
         /*Return, will return undefined if no neighbor is found*/
         return neighbor;
     }

 }
