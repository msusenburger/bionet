const PIXI = require('pixi.js')

const StorageGrid = function (xcells, ycells, width, height, xalpha, yalpha) {
    this.xcells = xcells
    this.ycells = ycells
    this.width = width
    this.height = height
    this.xalpha = (xalpha === undefined) ? xalpha : false
    this.yalpha = (yalpha === undefined) ? yalpha : false
    this.dx = width / xcells
    this.dy = height / ycells
}

// generate grid
StorageGrid.prototype.drawGrid = function (container) {
    var i = 0;
    const xcells = this.xcells
    const ycells = this.ycells
    const width = this.width
    const height = this.height
    const margin = 10
    const dx = this.dx
    const dy = this.dy
    const ticLength = 4
    const lineThickness = 2
    const t2 = lineThickness / 2
    const anchorPoint = new PIXI.Point(0.5, 0.5)

    var graphics = new PIXI.Graphics();

    // grid line style
    graphics.lineStyle(lineThickness, 0);
    const textColor = '#000000'

    // grid labels text style
    const textProps = {
        fontFamily: 'Arial',
        fontSize: '70px',
        fill: textColor,
        fontWeight: 1600,
        backgroundColor: '#00000000',
        wordWrap: false
    }

    // draw x axis
    const y1 = 0
    const y2 = height

    for (i = 0; i <= xcells; i++) {

        var x = i * dx
        var tic = (i === 0 || i === xcells) ? t2 : ticLength

        // draw grid line
        graphics.moveTo(x, y1 - tic)
        graphics.lineTo(x, y2 + tic)

        // draw grid labels
        if (i < xcells && xcells > 1) {
            var xp = x + dx / 2

            var label = new PIXI.Text(i + 1, textProps);
            label.anchor = anchorPoint
            label.position.x = xp
            label.position.y = y1 - margin;
            container.addChild(label);

            label = new PIXI.Text(i + 1, textProps);
            label.anchor = anchorPoint
            label.position.x = xp
            label.position.y = y2 + margin;
            container.addChild(label);
        }
    }

    // draw y axis
    const x1 = 0
    const x2 = width
    const cs = (this.yalpha === true) ? 'A' : '1'
    const cc = cs.charCodeAt(0)
    for (i = 0; i <= ycells; i++) {

        var y = i * dy
        var tic = (i === 0 || i === ycells) ? t2 : ticLength

        // draw grid line
        graphics.moveTo(x1 - tic, y);
        graphics.lineTo(x2 + tic, y);

        // draw grid labels
        if (i < ycells && ycells > 1) {
            var yp = y + dy / 2
            var gridlabel = String.fromCharCode(i + cc)

            var label = new PIXI.Text(gridlabel, textProps);
            label.anchor = anchorPoint
            label.position.x = x1 - 10
            label.position.y = yp
            container.addChild(label)

            label = new PIXI.Text(gridlabel, textProps)
            label.anchor = anchorPoint;
            label.position.x = x2 + 10
            label.position.y = yp
            container.addChild(label);
        }
    }
    container.addChild(graphics);
    this.sprite = graphics
}

StorageGrid.prototype.getCellCoordinates = function (cellid) {
    const cs = (this.yalpha === true) ? 'A' : '0'
    const cc = cs.charCodeAt(0)
    const xcell = (cellid % this.xcells) + 1
    const ycell = Math.trunc(cellid / this.xcells)
    return xcell.toString() + String.fromCharCode(ycell + cc)
}

StorageGrid.prototype.getCellCoordinatesFromPoint = function (point) {
    return {
        x: Math.trunc(point.x / this.dx) + 1,
        y: Math.trunc(point.y / this.dy) + 1
    }
}

Object.defineProperty(StorageGrid, "p1", {
    get: function getp1() {
        return this.p1
    },
    set: function setp1(p1) {
        this.p1 = p1
    }
});
Object.defineProperty(StorageGrid, "p2", {
    get: function getp1() {
        return this.p2
    },
    set: function setp1(p1) {
        this.p1 = p2
    }
});

StorageGrid.prototype.highlight = function (x, y, container) {
    const dx = this.dx
    const dy = this.dy
    const p1x = (x - 1) * dx
    const p1y = (y - 1) * dy

    this.p1 = new PIXI.Sprite()
    this.p1.x = p1x
    this.p1.y = p1y
    container.addChild(this.p1)
    this.p1.updateTransform()

    const p2x = p1x + dx
    const p2y = p1y + dy

    this.p2 = new PIXI.Sprite()
    this.p2.x = p2x
    this.p2.y = p2y
    container.addChild(this.p2)
    this.p2.updateTransform()

    this.drawHighlight(p1x, p1y, p2x, p2y, container)
}

StorageGrid.prototype.initHighlight = function (x1, y1, x2, y2, container) {
    const p1x = x1
    const p1y = y1

    this.p1 = new PIXI.Sprite()
    this.p1.x = p1x
    this.p1.y = p1y
    container.addChild(this.p1)
    this.p1.updateTransform()

    const p2x = x2
    const p2y = y2

    this.p2 = new PIXI.Sprite()
    this.p2.x = p2x
    this.p2.y = p2y
    container.addChild(this.p2)
    this.p2.updateTransform()
    this.drawHighlight(p1x, p1y, p2x, p2y, container)
}

StorageGrid.prototype.drawHighlight = function (p1x, p1y, p2x, p2y, container) {
    if (this.highlightSprite) {
        container.removeChild(this.highlightSprite)
    }
    const alpha = 0.3
    var graphics = new PIXI.Graphics();
    graphics.lineStyle(6, 0xff0000, alpha);
    graphics.moveTo(p1x, p1y)
    graphics.lineTo(p2x, p1y)
    graphics.lineTo(p2x, p2y)
    graphics.lineTo(p1x, p2y)
    graphics.lineTo(p1x, p1y)
    graphics.beginFill(0xff0000, alpha);
    graphics.drawRect(p1x, p1y, p2x - p1x, p2y - p1y)
    graphics.endFill();
    container.addChild(graphics);
    this.highlightSprite = graphics
}

// process grid cells
StorageGrid.prototype.process = function (scanIndicator, highlight) {
    const xcells = this.xcells
    const ycells = this.ycells
    const width = this.width
    const height = this.height
    const dx = this.dx
    const dy = this.dy

    var i = 0;
    var n = 0
    var cells = []
    if (highlight !== undefined) {
        n = highlight.length
        cells = highlight
    } else {
        n = xcells * ycells
    }
    var cell = 0
    var n = 8

    const nextCell = function () {
        cell = (highlight !== undefined) ? cells[i] : i
            //var xcell = (cell % xcells)
            //var ycell = Math.trunc(cell / xcells)
        var xcell = Math.trunc(Math.random() * xcells)
        var ycell = Math.trunc(Math.random() * ycells)

        var scanCellDef = {}
        const cellStatus = Math.random()
        if (cellStatus < 0.95 && i > 0 || highlight !== undefined) {
            scanCellDef.qrcode = 'qrcode'
        }
        scanCellDef.x = xcell * dx
        scanCellDef.y = ycell * dy
        scanCellDef.width = dx
        scanCellDef.height = dy

        if (++i > n) {
            clearInterval(timerloop);
            if (highlight !== undefined) {
                setTimeout(function () {
                    scanIndicator.dispatch({
                        cmd: 'end'
                    })
                }, 150)
            } else {
                scanIndicator.dispatch({
                    cmd: 'end'
                })
            }
        } else {
            scanIndicator.dispatch(scanCellDef)
        }
    }

    nextCell();
    const timerloop = setInterval(nextCell, 200);

}

module.exports = StorageGrid
