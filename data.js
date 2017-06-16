class Cell {
    constructor() {
        this.icon = "0"
        this.isPath = false;
        this.cameFrom = undefined;
        this.location = {
            row: 0,
            col: 0
        }
    }
    getIcon() {
        if (this.cameFrom != null) {
            this.icon = "1"
        } else {
            this.icon = "0"
        }

        if (this.isPath) {
            this.icon = "-";
        }
        return this.icon;
    }
}
var rows = 3;
var cols = 3;
var board = [
	[new Cell(), new Cell(), new Cell()],
  [new Cell(), new Cell(), new Cell()],
  [new Cell(), new Cell(), new Cell()]
];

function output() {
    var str = "";
    for (var i in board) {
        for (var j in board[i]) {
            str += "[" + board[i][j].getIcon() + "]"
            board[i][j].location = {
                row: parseInt(i),
                col: parseInt(j)
            }
        }
        str += "<br/>"
    }
    $("p").html(str)
}

function getNeighbors(node, start) {
    var row = node.location.row
    var col = node.location.col

    var neighbors = [];
    if (row - 1 > -1) {
        var north = board[row - 1][col] || undefined;
        neighbors.push(north)
    }
    if (row + 1 < rows) {
        var south = board[row + 1][col] || undefined;
        neighbors.push(south)
    }
    if (col + 1 < cols) {
        var east = board[row][col + 1] || undefined;
        neighbors.push(east)
    }
    if (col - 1 > -1) {
        var west = board[row][col - 1] || undefined;
        neighbors.push(west)
    }


    return neighbors;
}

function breadth_search(start) {
    var nodes = []
    nodes.push(start)
    start.cameFrom = null
    var trans_node = null;
    var neighbors = [];
    var current_neighbor;
    while (nodes.length > 0) {
        trans_node = nodes.pop()
        neighbors = getNeighbors(trans_node, start)
        for (var neighbor in neighbors) {
            current_neighbor = neighbors[neighbor]
            if (current_neighbor.cameFrom == null) {
                current_neighbor.cameFrom = trans_node;
                nodes.push(current_neighbor)
            }
        }
    }
}

function createPath(start, end) {
    var path = []
    path.push(start)
    start.isPath = true;
    end.isPath = true;
    var trans_node = end
    while (trans_node != start) {
        trans_node = trans_node.cameFrom
        trans_node.isPath = true;
        path.push(trans_node)
    }
    path.push(end)
    return path;
}
