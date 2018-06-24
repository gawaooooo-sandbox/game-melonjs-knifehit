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
        this.totalAngle = 0;
        this.currentAngle = 0;

        this.ROTATE = 3;

        this.type = "target";

        console.groupEnd();
    },
    update: function(dt) {
        // this.renderable.currentTransform.rotate((3 / 180) * Math.PI);
        // TODO: 3度ずつ回転してるのはわかってるので、ここから出せるのではーーーー
        this.totalAngle += this.ROTATE;
        this.currentAngle = this.totalAngle % 360;
        // console.log(this.currentAngle);
        // console.log(this.currentAngle);
        // this.renderable.currentTransform.rotate(Number.prototype.degToRad(3));
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(this.ROTATE));
        // TODO: このvalの値から、現在の角度がとれそうな気がする Matrix2dの値がなんなのか
        // console.log(this.renderable.currentTransform.val[0]);
        // console.log(Math.acos(this.renderable.currentTransform.val[0]));
        return true;
    }
});
