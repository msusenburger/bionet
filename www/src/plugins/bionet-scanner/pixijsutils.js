const PIXI = require('pixi.js')
const tween = require('pixi-tween')
const MiniSignal = require('mini-signals');
const pixijsUtils = {
    initRenderer: function () {
        this.pixiBackgroundColor = 0xffffff
        const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
            backgroundColor: this.pixiBackgroundColor,
            resolution: window.devicePixelRatio,
            transparent: false,
            autoResize: true
        });
        PIXI.TRANSFORM_MODE.TRANSFORM_MODE = PIXI.TRANSFORM_MODE.DYNAMIC;
        this.renderer = renderer
        this.stage = new PIXI.Container()
        renderer.render(this.stage)
    },
    attachRenderer: function (element) {
        /*
        if (element.children && element.children.length>0) {
            element.children[0] = this.renderer.view
        } else {
            element.appendChild(this.renderer.view)
        }
        */
        element.appendChild(this.renderer.view)
    },
    initStage: function (width, height) {
        this.stage.removeChildren()
        const w = Math.round(width)
        //this.renderer.clear(this.pixiBackgroundColor)
        this.width = w
        this.height = height
        this.renderer.render(this.stage)
        this.renderer.resize(w, height)
    },
    resizeStage: function(width,height) {
        this.width = w
        this.height = height
        const w = Math.round(width)
        this.renderer.resize(w, height)
    },
    scaleToFit: function (source) {
        const bounds = source.getBounds()
        var scale = Math.min(this.width / bounds.width, this.height / bounds.height)
        // todo: need to include window width
        //scale = Math.min(scale,0.7)
        scale = Math.min(scale,1)
        source.scale.x = source.scale.y = scale
    },
    appendToStage: function (source) {
        this.stage.addChild(source)
    },
    renderStage: function () {
        this.renderer.render(this.stage)
    },
    renderToImage: function (width, height, source, canvas) {
        const renderer = this.renderer
        const bounds = source.getBounds()
        const scale = Math.min(width / bounds.width, height / bounds.height)
        renderer.render(source)
        const extract = renderer.plugins.extract
        const image = extract.image(source)
        if (canvas.children.length > 0) {
            canvas.removeChild(canvas.children[0])
        }
        image.width *= scale
        image.height *= scale
        canvas.appendChild(image)
    },
    renderToCanvas: function (width, height, source, canvas) {
        const renderer = this.renderer
        if (canvas.children.length > 0) {
            canvas.removeChild(children[0])
        }
        canvas.appendChild(renderer.view)
        const bounds = source.getBounds()
        const scale = Math.min(width / bounds.width, height / bounds.height)
            //source.scale.x = source.scale.y = scale
        renderer.render(source)
    },
    animate: function (seconds) {
        const thisModule = this
        const frames = seconds * 30
        const delta = 1 / 30
        const msg = app.getStream('bionetStorageLocation')

        const update = function (timestamp) {
            PIXI.tweenManager.update(delta)
            msg.dispatch('render')
            thisModule.renderStage()
            if (!thisModule.frameCounter || --thisModule.frameCounter > 0) window.requestAnimationFrame(update)
        }
        if (!thisModule.frameCounter || thisModule.frameCounter<=0) window.requestAnimationFrame(update)
        thisModule.frameCounter = (thisModule.frameCounter) ? thisModule.frameCounter + frames : frames
    }
}
module.exports = pixijsUtils