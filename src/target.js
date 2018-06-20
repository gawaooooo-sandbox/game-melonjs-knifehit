game.TargetEntity = me.Entity.extend({
    init: function(x, y) {
        console.log("target entity init", x, y);
        const image = me.loader.getImage("target");
        // call the super constructor
        this._super(me.Entity, "init", [
            x,
            y,
            {
                width: image.width,
                height: image.height
            }
        ]);
        // TODO: collision type? setVelocity?

        // create a renderable
        this.renderable = new me.Sprite(0, 0, { image: image });
        this.anchorPoint.set(0.5, 0.5);

        // this.body.setVelocity(0, 0);
        // this.body.collisionType = me.collision.types.ACTION_OBJECT;
    },
    update: function() {
        this.renderable.currentTransform.rotate((3 / 180) * Math.PI);
        // this.body.update();
        return true;
    }
});
