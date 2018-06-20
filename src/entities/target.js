game.TargetEntity = me.Entity.extend({
    init: function(x, y) {
        console.group("target");
        console.log("----- TargetEntity init -----");
        console.log(`target entity init: ${x}, ${y}`);

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

        this.type = "target";
        console.groupEnd();
    },
    update: function() {
        this.renderable.currentTransform.rotate((3 / 180) * Math.PI);
        return true;
    }
});
