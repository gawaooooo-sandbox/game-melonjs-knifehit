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
    }
});

game.HitKnifeManager = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, "init", [
            0,
            0,
            me.game.viewport.width,
            me.game.viewport.height
        ]);

        this.hitKnifes = [];
    },
    hit: function(throwKnife, target) {
        const x = throwKnife.pos.x;
        const y = throwKnife.pos.y;

        const knife = me.pool.pull(
            "hitKnife",
            x,
            y,
            target,
            this.hitKnifes.length
        );

        this.hitKnifes.push(knife);

        me.game.world.addChild(knife, 1);
    }
});

game.HitKnifeEntity = game.KnifeEntity.extend({
    init: function(x, y, target, num) {
        this._super(game.KnifeEntity, "init", [x, y, target]);

        this.target = target;
        this.type = "hit";
        this.id = num;
        this.angle = 90;

        this.anchorPoint.set(0, 0.5);
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
        this._super(game.KnifeEntity, "init", [x, y, target]);

        this.type = "throwing";

        this.thrownTween = null;

        this.isLeagalHit = true;

        this.canThrow = true;
    },
    throw: function() {
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

        // not solid
        return false;
    },

    stopThrowTween: function() {
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
    },
    fallOutTween: function() {
        this.thrownTween.stop();

        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to({ y: me.game.viewport.height + this.height })
            .onComplete(() => {
                console.log("--- complete knife fall out ----- ");
                game.playScreen.reset();
            })
            .start();
    },
    isCanThrow: function() {
        return this.canThrow;
    }
});
