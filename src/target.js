game.Target = me.Sprite.extend({
    init: function() {
        console.log("target init");
        const image = me.loader.getImage("target");
        this._super(me.Sprite, "init", [
            me.game.viewport.width / 2,
            400,
            { image: image }
        ]);

        // this.alwaysUpdate = true;
    },
    onActivateEvent: function() {
        console.log(" target onActivate ");
        // this.currentTransform.identity();
        // this.anchorPoint.set(0.5, 0.5);
        // this.autoTransform = true;

        console.log(this.image.width);
        console.info(this);
        console.log(Math.PI);
    },
    update: function(time) {
        // console.log(" game.target update ");
        this._super(me.Sprite, "update", [time]);

        this.currentTransform.translate(me.game.viewport.width / 2, 400);
        this.currentTransform.rotate((3 / 180) * Math.PI);
        this.currentTransform.translate(-me.game.viewport.width / 2, -400);

        return true;
    },
    test: function() {
        console.log("call pointerdown !!!");
    }
});
