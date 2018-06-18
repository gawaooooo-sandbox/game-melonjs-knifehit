// game.Knife = me.Sprite.extend({
game.Knife = me.Entity.extend({
    init: function(x, y) {
        console.log(" call game.Knife init");
        const image = me.loader.getImage("knife");
        // this._super(me.Sprite, "init", [
        //     me.game.viewport.width / 2,
        //     (me.game.viewport.height / 5) * 4,
        //     { image: image }
        // ]);

        this._super(me.Entity, "init", [
            x,
            y,
            {
                image: "knife",
                width: image.width,
                height: image.height,
                anchorPoint: new me.Vector2d(0.5, 0.5)
            }
        ]);
        console.log(this);
        // this.body.setVelocity(0, 0);
        // this._super(me.Entity, "init", [
        //     me.game.viewport.width / 2,
        //     (me.game.viewport.height / 5) * 4,
        //     { image: image }
        // ]);
        // this.anchorPoint.set(0.5, 0.5);
        // this.autoTransform = true;
        this.alwaysUpdate = true;
    },
    update: function(time) {
        this._super(me.Entity, "update", [time]);
        // this.body.update();
        return true;
    },
    thrown: function() {
        console.log(" call knife thrown ");
        console.log(game.playScreen.canThrow);
        if (!game.playScreen.getCanThrow()) {
            console.log(" not throw knife");
            return;
        }
        game.playScreen.setCanThrow(false);

        console.log(this.pos.y);
        // TODO: tween test
    }
});
