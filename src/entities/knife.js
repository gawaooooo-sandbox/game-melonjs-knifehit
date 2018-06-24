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
        this.isCollide = false;

        this.target = target;

        console.groupEnd();
    }
});

// TODO: test
// TODO: 参照私してるのがだめなのかもって思ったなこれ。
game.HitKnifeManager = me.Renderable.extend({
    init: function() {
        console.group('hitknifeMnager');
        console.log("----- HitKnifeManager init -----");

        this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);

        this.hitKnifes = [];

        console.groupEnd();
    },
    hit: function(throwKnife, target, hitAngle) {
        console.group('hitknifeMnager');
        console.log("----- HitKnifeManager hit -----");
        // console.log(target);

        // console.log(`random x : ${random}`);
        // const knife = me.pool.pull(
            //     'hitKnife',
            //     throwKnife.pos.x,
            //     throwKnife.pos.y,
            //     target
            // );
        console.log(`target.currentAngle: ${target.currentAngle}, currentAngle" ${hitAngle}`);
            
        const rad = Number.prototype.degToRad(target.currentAngle);
        const testX = (target.width / 2) * Math.cos(rad) + (me.game.viewport.width / 2);
        const testY = (target.width / 2) * Math.sin(rad) + (400 - target.height / 2);

        // const random = Number.prototype.random(0, 500);
        // const knife = new game.HitKnifeEntity(
        //     testX,
        //     testY,
        //     // throwKnife.pos.x,
        //     // throwKnife.pos.y,
        //     // Number.prototype.random(0, 600),
        //     // Number.prototype.random(0, 600),
        //     target,
        //     this.hitKnifes.length
        // );

        const knife = me.pool.pull(
            'hitKnife',
            testX,
            testY,
            target,
            this.hitKnifes.length
        );

        console.log(knife);
        this.hitKnifes.push(knife);

        me.game.world.addChild(knife, 3);

        // console.log(this.hitKnifes);

        console.groupEnd();
    },
    update: function(dt) {
        // console.log(dt);
        // this.hitKnifes.forEach(knife => {
        //     // me.game.world.addChild(knife, 1);
        //     // console.log(knife);
        //     // knife.angle += 3;
        //     const rad = Number.prototype.degToRad(knife.angle);
        //     // console.log(`knife rad ${rad}`);
        //     const testX = (knife.target.width  / 2) * Math.cos(rad) + (me.game.viewport.width / 2);
        //     const testY = (knife.target.width / 2) * Math.sin(rad) + (400 - knife.target.height / 2);
        //     // console.log(`testX: ${testX}, testY: ${testY}`);
            
        //     knife.pos.x = testX;
        //     knife.pos.y = testY;
        // });
        return true;
    }
});

game.HitKnifeEntity = game.KnifeEntity.extend({
    init: function(x, y, target, num) {
        console.group('hitknife');
        console.log("----- HitKnifeEntity init -----");
        console.log(`hit knife entity init: ${x}, ${y}, ${num}`);        

        this._super(game.KnifeEntity, "init", [x, y, target]);

        // TODO' rad 間違ってるかも 角度がプラスしか取れてないのがだめ
        // me.Matrix2d
        // this.val

        // TODO この角度が違うはずなのに、全部同じ点で回ってる
        this.impactAngleDeg = target.currentAngle;

        console.log(`angledeg ${this.impactAngleDeg}`);

        // TODO target.currentAngleにするとだめか？？
        // this.angle = target.currentAngle;
        this.angle = Number.prototype.random(0, 360);
        // console.log(`hitknife impactAngleDeg: ${this.impactAngleDeg}`);

        this.target = target;

        this.type = "hit";

        this.id = num;

        this.anchorPoint.set(0, 0.5);

        console.groupEnd();
    },
    update: function(dt) {
        // me.collision.check(this);
        // this.angle = (this.angle + 3) % 360;
        this.angle += 3;
        // console.log(`${this.id}:::::::: ${Number.prototype.degToRad(this.angle)}`);

        // console.log(this.angle);
        // const radians = Number.prototype.degToRad(this.angle + 90);
        // const radians = Number.prototype.degToRad(this.angle + 90);
        // const x = this.target.pos.x + (this.target.width / 2) * Math.cos(radians);
        // const y = this.target.pos.y + this.target.height * Math.sin(radians);

        const rad = Number.prototype.degToRad(this.angle);
        const testX = (this.target.width / 2) * Math.cos(rad) + (me.game.viewport.width / 2);
        const testY = (this.target.width / 2) * Math.sin(rad) + (400 - this.target.height / 2);

        // console.log(`testX ' ${testX}, testY: ${testY}`);

        // console.log(x);
        // console.log(y);
        // console.log(x, y);
        this.pos.x = testX;
        this.pos.y = testY;

        // TODO: 回転するはず、、
        // this.renderable.currentTransform.rotate(Number.prototype.degToRad(3));

        return true;
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

        this.isLeagalHit = true;

        this.canThrow = true;

        console.groupEnd();
    },
    update: function(dt) {
        // TODO: test
        if (this.isCollide) {
            // this.stopThrowTween();
            return false;
        }

        // 刺さっているナイフに当たったときのアニメーション
        if (!this.isLeagalHit) {
            this.renderable.currentTransform.rotate((8 / 180) * Math.PI);
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

        console.log(response);
        console.log(`${this.pos.x}, ${this.pos.y}`);

        // TODO: test
        if (other.type === "target") {
        //     this.collide = true;
            this.stopThrowTween();
            // TODO: knifeを追加しないと
            game.playScreen.hitKnifeManager.hit(this, this.target, this.target.currentAngle);
        }
        // } else {
        //     // this.isLeagalHit = false;
        //     // this.fallOutTween();
        // }

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
                this.isCollide = false;
                console.log(
                    `stop thrown tween onComplete ${this.canThrow}, collide ${
                        this.isCollide
                    }`
                );
            });
        this.thrownTween.start();

        console.groupEnd();
    },
    fallOutTween: function() {
        console.group("knife");
        console.log("---- stopThrowTween ----");

        this.thrownTween.stop();

        this.thrownTween = me.pool
            .pull("me.Tween", this.pos)
            .to({ y: me.game.viewport.height + this.height })
            .onComplete(() => {
                console.log("--- complete knife fall out ----- ");
                game.playScreen.reset();
            })
            .start();

        console.groupEnd();
    },
    isCanThrow: function() {
        return this.canThrow;
    }
});
