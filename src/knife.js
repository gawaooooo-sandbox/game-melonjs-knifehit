game.Knife = me.Entity.extend({
    init: function(x, y, canThrow) {
        console.log(" call game.Knife init", x, y, canThrow);
        const image = me.loader.getImage("knife");

        this._super(me.Entity, "init", [
            x,
            y,
            { width: image.width, height: image.height }
        ]);

        // create a renderable
        this.renderable = new me.Sprite(0, 0, { image: image });
        // 投げられるナイフかどうか
        this.canThrow = canThrow;

        if (this.canThrow) {
            this.isLeagalHit = true;
        }

        this.impactAngle = 0;

        // collision
        this.body.setVelocity(0, 0);
        console.log(
            `PROJECTILE_OBJECT: ${me.collision.types.PROJECTILE_OBJECT}`
        );
        console.log(`ACTION_OBJECT: ${me.collision.types.ACTION_OBJECT}`);
        this.body.collisionType = this.canThrow
            ? me.collision.types.PROJECTILE_OBJECT
            : me.collision.types.ACTION_OBJECT;

        console.log(`body collisionTYpe : ${this.body.collisionType}`);
    },
    update: function(time) {
        // console.log(time);
        // this._super(me.Entity, "update", [time]);

        // console.log(this.canThrow, this.isLeagalHit);
        // 投げるナイフかつ丸太にHITしなかったら落ちる
        if (this.canThrow && !this.isLeagalHit) {
            console.log(" knife rotate ....");
            this.renderable.currentTransform.rotate((8 / 180) * Math.PI);
        }

        // if (this.canThrow) {
        this.body.update();
        me.collision.check(this);
        // }

        return true;
    },
    // TODO: 自ら飛ぶ -> あたったあとの話しはあとで
    thrown: function(target) {
        console.log(" ------- get knifes ------ ");
        console.log(game.playScreen.knifeManager.getKnifes());

        if (!target) {
            console.log("need target object");
            return;
        }

        if (!this.canThrow) {
            console.log(" can not throw knife ");
            return;
        }
        console.log(" call knife thrown ");
        // console.log(game.playScreen.canThrow);

        // if (!game.playScreen.getCanThrow()) {
        //     console.log(" not throw knife");
        //     return;
        // }
        // game.playScreen.setCanThrow(false);

        // console.log(this.pos.y);
        // TODO: tween test
        const throwTween = new me.Tween(this.pos)
            // .to({ y: target.pos.y + target.width / 2 + this.height / 2 }, 1000)
            .to({ y: target.pos.y + target.width / 2 + this.height / 2 }, 150)
            .onUpdate(time => {
                // console.log(" thrown onUpdate ....");
                // // todo 投げられるかつ legalhitの場合はアニメーションストップ
                // if (game.playScreen.getCanThrow() && this.isLeagalHit) {
                //     console.log("   stop throw knife animation");
                //     throwTween.stop();
                // }
            })
            .onComplete(() => {
                console.log(" knife thrown complete ");
                // at the moment, this is a legal hit
                // TODO: 自分の中で自分を複製するの違和感あるんだけど

                // game.playScreen.setCanThrow(true);
                // this.resetThrowKnife();
                // game.playScreen.knifeManager.createKnife(
                //     this.pos.x,
                //     this.pos.y,
                //     false
                // );
            })
            .start();
    },
    // TODO:
    createHitKnife: function() {
        console.log(" create hit knife ");

        console.log(" target transform ??? ");
        console.log(game.playScreen.target);
        game.playScreen.knifeManager.createKnife(this.pos.x, this.pos.y, false);
        // this.impactAngle = game.playScreen.target.currentTransform;

        // const knife = me.pool.pull("knife", this.pos.x, this.pos.y, false);
        // me.game.world.addChild(knife);

        // todo: impactAngle??
        // this.resetThrowKnife();
    },
    resetThrowKnife: function() {
        console.log(" call reset thrown Knife");
        this.pos.y = (me.game.viewport.height / 5) * 4 - this.height / 2;
        game.playScreen.setCanThrow(true);
    },

    // TODO : onCollisionでtrueを返すかfalseを返すか
    onCollision: function(response, other) {
        console.log(`knife oncollisiont ${this.body.collisionType}`);
        console.log(`othre.bodhy.collisionType: ${other.body.collisionType}`);
        console.log(response);
        console.log(other);
        if (other.body.collisionType === me.collision.types.ACTION_OBJECT) {
            console.log("collision othre knife....");
            // ナイフに当たったとみなして、リセットする、、
            // tween to throw the knife
            if (this.canThrow) {
                this.isLeagalHit = false;
            }

            new me.Tween(this.pos)
                .to(
                    {
                        y: me.game.viewport.height + this.height
                    },
                    150 * 4
                )
                .onUpdate(time => {
                    // console.log(` knife collision update ${this.pos.y}`);
                })
                .onComplete(() => {
                    console.log(" complete knife おちる");
                    game.playScreen.reset();
                })
                .start();
            return true;
        }

        // ナイフにあたらなかった場合はナイフを丸太に付与してナイフの位置をリセット
        this.isLeagalHit = true;
        this.resetThrowKnife();
        this.createHitKnife();

        // // this.currentCollisionType = other.body.collisionType;
        // // if (this.currentCollisionType === this.beforeCollisionType) {
        // //     console.log(" 同じcollitionTypeなので無視をする、、");
        // //     return false;
        // // }

        // this.beforeCollisionType = this.currentCollisionType;

        /*
        if (other.body.collisionType === me.collision.types.ACTION_OBJECT) {
            console.log(" hit target !!!");

            game.playScreen.setCanThrow(true);
            this.createHitKnife();
            this.resetThrowKnife();
            return true;
        }

*/
        return false;
    }
});
