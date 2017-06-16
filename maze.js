 var tiles = [];
 var visitedStk = [];
 var height = 450 // these numbers were tested, don't change
 var width = 450 // these numbers were tested don't change
 var tile_size = 25;
 var amt_per_side;
 class Cell {
     constructor(nRow, nCol) {
         this.row = nRow;
         this.col = nCol;
         this.visited = false;
         this.left = true;
         this.right = true;
         this.top = true;
         this.bottom = true;
     }
 }
 class Maze {
     constructor() {
         /*Initialize needed variables. */

         amt_per_side = Math.floor(height / tile_size);
         ctx.lineWidth = 7;
         //  configLineStyle();
     }
     init() {
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
         ctx.moveTo(sX, sY);
         ctx.lineTo(eX, eY);
     }
     drawCell(y, x, side, tile) {
         /* Draw cell based on wall properties */
         var left = tile.left;
         var right = tile.right;
         var top = tile.top;
         var bottom = tile.bottom;
         var size = tile_size;
         ctx.beginPath();
         if (left) {
             this.drawLine(x, y, x, y + size);
         }

         if (right) {
             this.drawLine(x + size, y, x + size, y + size);
         }

         if (bottom) {
             this.drawLine(x, y + size, x + size, y + size)
         }

         if (top) {
             this.drawLine(x, y, x + size, y);
         }
         ctx.stroke();
     }
     drawBase() {
         /* Draw the tiles on the canvas*/
         var side = tile_size;
         for (var i = 0; i < amt_per_side - 1; i++) {
             tiles[i] = [];
             for (var j = 0; j < amt_per_side - 1; j++) {
                 tiles[i].push(new Cell(i, j));
                 this.drawCell(i * side, j * side, side, tiles[i][j]);
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
             if (neighbor.row > currentTile.row) { /*Bottom*/
                 currentTile.bottom = false;
                 neighbor.top = false;
             }
             if (neighbor.row < currentTile.row) { /*Top*/
                 currentTile.top = false;
                 neighbor.bottom = false;
             }
             if (neighbor.col < currentTile.col) { /*Left*/
                 currentTile.left = false;
                 neighbor.right = false;
             }
             if (neighbor.col > currentTile.col) { /*Right*/
                 currentTile.right = false;
                 neighbor.left = false;
             }
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