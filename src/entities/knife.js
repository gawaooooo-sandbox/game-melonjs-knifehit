game.KnifeEntity = me.Entity.extend({
    init: function(x, y, target) {
        const image = me.loader.getImage("knife");
        const settings = {
            image: image,
            width: image.width,
            height: image.height
        };

        this._super(me.Entity, "init", [x, y, settings]);

        // create a renderable
        this.renderable = new me.Sprite(0, 0, { image: image });

        this.target = target;

        console.groupEnd();
    }
});

game.HitKnifeManager = me.Renderable.extend({
    init: function() {
        // console.group("hitknifeMnager");
        // console.log("----- HitKnifeManager init -----");

        this._super(me.Renderable, "init", [
            0,
            0,
            me.game.viewport.width,
            me.game.viewport.height
        ]);

        this.hitKnifes = [];

        console.groupEnd();
    },
    hit: function(throwKnife, target) {
        // console.group("hitknifeMnager");
        // console.log("----- HitKnifeManager hit -----");

        const x = throwKnife.pos.x;
        const y = throwKnife.pos.y;

        // console.log(`knifeposition x: ${x}, positionY: ${y}`);

        const knife = me.pool.pull(
            "hitKnife",
            x,
            y,
            target,
            this.hitKnifes.length
        );

        this.hitKnifes.push(knife);

        me.game.world.addChild(knife, 1);

        // console.groupEnd();
    }
});

game.HitKnifeEntity = game.KnifeEntity.extend({
    init: function(x, y, target, num) {
        // console.group("hitknife");
        // console.log("----- HitKnifeEntity init -----");
        // console.log(`hit knife entity init: ${x}, ${y}, ${num}`);

        this._super(game.KnifeEntity, "init", [x, y, target]);

        this.target = target;
        this.type = "hit";
        this.id = num;
        this.angle = 90;

        this.anchorPoint.set(0, 0.5);

        // console.groupEnd();
    },
    update: function(dt) {
        this.angle += 3;

        const rad = Number.prototype.degToRad(this.angle);
        const x =
            (this.target.width / 2) * Math.cos(rad) +
            me.game.viewport.width / 2;
        const y =
            (this.target.width / 2) * Math.sin(rad) +
            (400 - this.target.height / 2);

        this.pos.x = x;
        this.pos.y = y;

        this.renderable.currentTransform.rotate(Number.prototype.degToRad(3));

        return true;
    }
});

game.ThrowingKnifeEntity = game.KnifeEntity.extend({
    init: function(x, y, target) {
        // console.group("knife");
        // console.log("----- ThrowingKnifeEntity init -----");
        // console.log(`throwing knife entity init: ${x}, ${y}, ${target}`);
        this._super(game.KnifeEntity, "init", [x, y, target]);

        this.type = "throwing";

        this.thrownTween = null;

        this.isLeagalHit = true;

        this.canThrow = true;

        // console.groupEnd();
    },
    throw: function() {
        // console.group("knife");
        // console.log("----- throw -----");

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
            .onComplete(() => {
                // console.log(" knife thrown tween complete ");
            });
        this.thrownTween.start();

        // console.groupEnd();
    },
    update: function(dt) {
        // 刺さっているナイフに当たったときのアニメーション
        if (!this.isLeagalHit) {
            this.renderable.currentTransform.rotate((8 / 180) * Math.PI);
        }

        me.collision.check(this);
        return true;
    },
    onCollision: function(response, other) {
        // console.group("knife");
        // console.log("----- onCollision -----");
        // console.log(`other.type: ${other.type}`);

        // console.log(`collision type : ${this.body.collisionType}`);

        this.body.setCollisionMask(me.collision.types.NO_OBJECT);

        // 丸太に当たった場合はナイフを刺した状態にする
        if (other.type === "target") {
            this.isLeagalHit = true;
            this.stopThrowTween();

            game.playScreen.hitKnifeManager.hit(this, this.target);
        }

        if (other.type === "hit") {
            console.log(" hit knife !!!! ");
            this.isLeagalHit = false;
            this.fallOutTween();
        }

        console.groupEnd();

        // not solid
        return false;
    },

    stopThrowTween: function() {
        // console.group("knife");
        // console.log("---- stopThrowTween ----");

        this.thrownTween.stop();

        // ナイフを初期位置に戻す
        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to({ y: (me.game.viewport.height / 5) * 4 - this.height / 2 }, 150)
            .onComplete(() => {
                this.canThrow = true;
                this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
            });
        this.thrownTween.start();

        // console.groupEnd();
    },
    fallOutTween: function() {
        // console.group("knife");
        // console.log("---- stopThrowTween ----");

        this.thrownTween.stop();

        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to({ y: me.game.viewport.height + this.height })
            .onComplete(() => {
                console.log("--- complete knife fall out ----- ");
                game.playScreen.reset();
            })
            .start();

        // console.groupEnd();
    },
    isCanThrow: function() {
        return this.canThrow;
    }
});
