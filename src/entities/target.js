game.TargetEntity = me.Entity.extend({
    init: function(x, y) {
        const image = me.loader.getImage("target");
        const settings = {
            image: image,
            width: image.width,
            height: image.height
        };

        this._super(me.Entity, "init", [x, y, settings]);

        // create a renderable
        this.renderable = new me.Sprite(0, 0, { image: image });
        this.anchorPoint.set(0.5, 0.5);
        // this.totalAngle = 0;
        this.totalAngle = 90;
        this.currentAngle = 0;

        this.ROTATE = 3;

        this.type = "target";

        console.groupEnd();
    },
    update: function() {
        this.totalAngle += this.ROTATE;
        this.currentAngle = this.totalAngle % 360;
        // this.renderable.currentTransform.rotate(Number.prototype.degToRad(3));
        this.renderable.currentTransform.rotate(
            Number.prototype.degToRad(this.ROTATE)
        );

        return true;
    }
});
