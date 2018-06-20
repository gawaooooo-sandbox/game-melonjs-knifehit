game.KnifeEntity = me.Entity.extend({
    init: function(x, y, target) {
        console.group("knife");
        console.log("----- KnifeEntity init -----");
        console.log(`knife entity init: ${x}, ${y}`);

        const image = me.loader.getImage("knife");
        const settings = {
            image: image,
            width: image.width,
            height: image.height
        };

        this._super(me.Entity, "init", [x, y, settings]);

        // create a renderable
        this.renderable = new me.Sprite(0, 0, { image: image });

        this.collide = false;

        this.target = target;

        console.groupEnd();
    }
});

game.ThrowingKnifeEntity = game.KnifeEntity.extend({
    init: function(x, y, target) {
        console.group("knife");
        console.log("----- ThrowingKnifeEntity init -----");
        console.log(`throwing knife entity init: ${x}, ${y}, ${target}`);
        this._super(game.KnifeEntity, "init", [x, y, target]);

        this.type = "throwing";

        this.thrownTween = null;

        this.canThrow = true;

        console.groupEnd();
    },
    update: function(dt) {
        // TODO: test
        if (this.collide) {
            // this.stopThrowTween();
            return false;
        }

        me.collision.check(this);
        return true;
    },
    onCollision: function(response, other) {
        console.group("knife");
        console.log("----- onCollision -----");
        console.log(
            `response.overlapV.y: ${
                response.overlapV.y
            }, response.overlapV.x: ${response.overlapV.x}`
        );
        console.log(`other.type: ${other.type}`);

        // TODO: test
        this.collide = true;
        this.stopThrowTween();

        console.groupEnd();

        // not solid
        return false;
    },
    throw: function() {
        console.group("knife");
        console.log("----- throw -----");

        if (!this.target) {
            console.log("need target object");
            return;
        }

        if (!this.canThrow) {
            console.log(" cannnot throw knife ");
            return;
        }

        this.canThrow = false;

        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to(
                {
                    y:
                        this.target.pos.y +
                        this.target.width / 2 +
                        this.height / 2
                },
                150
            )
            .onUpdate(dt => {})
            .onComplete(() => {
                console.log(" knife thrown tween complet ");
            });
        this.thrownTween.start();

        console.groupEnd();
    },
    stopThrowTween: function() {
        console.group("knife");
        console.log("---- stopThrowTween ----");

        this.thrownTween.stop();

        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to({ y: (me.game.viewport.height / 5) * 4 - this.height / 2 }, 150)
            .onComplete(() => {
                this.canThrow = true;
                this.collide = false;
                console.log(
                    `stop thrown tween onComplete ${this.canThrow}, collide ${
                        this.collide
                    }`
                );
            });
        this.thrownTween.start();

        console.groupEnd();
    },
    isCanThrow: function() {
        return this.canThrow;
    }
});
