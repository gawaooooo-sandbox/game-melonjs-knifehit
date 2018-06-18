game.PlayScreen = me.ScreenObject.extend({
    // action to perform on state change
    onResetEvent: function() {
        console.log(" call playScreen reset event");
        me.game.world.addChild(new me.ColorLayer("background", "#444444"), 0);

        this.knifeImage = me.loader.getImage("knife");

        this.target = me.pool.pull("target");
        this.knife = me.pool.pull(
            "knife",
            me.game.viewport.width / 2 - 0.5 - this.knifeImage.width / 2,
            (me.game.viewport.height / 5) * 4 - this.knifeImage.height / 2
        );

        me.game.world.addChild(this.knife, 1);
        me.game.world.addChild(this.target, 2);

        // registere on the 'pointerdown' event
        me.input.registerPointerEvent(
            "pointerdown",
            me.game.viewport,
            this.pointerDown.bind(this)
        );

        this.canThrow = true;
    },
    pointerDown: function(pointer) {
        // TODO: なんとかマネージャー？つかたほうがいいのかも
        // this.knife.thrown();
        this.thrownKnife();

        return false;
    },
    setCanThrow: function(isCanThrow) {
        console.log(" call set can throw ");
        this.canThrow = isCanThrow;
    },
    getCanThrow: function() {
        return this.canThrow;
    },

    // TODO: ここでいいのか、、
    thrownKnife: function() {
        console.log(" call thrownKnife ");

        if (!this.canThrow) {
            console.log(" not throw knife ");
            return;
        }
        this.canThrow = false;

        console.log(`knife y position ${this.knife.pos.y}`);
        console.log(
            `target y position ${this.target.pos.y}, target width ${
                this.target.width
            }`
        );
        console.log(`${this.target.pos.y} と ${this.target.width / 2}`);

        const tween = new me.Tween(this.knife.pos)
            .to(
                {
                    y:
                        this.target.pos.y +
                        this.target.width / 2 -
                        this.knife.height / 2
                },
                150
            )
            .onUpdate(function() {
                console.log(this.y);
            })
            // function to be executed once tween has been completed
            .onComplete(() => {
                console.log(" oncomplete ");
                // console.log(this);
                // console.log(tween);

                // at the moment, this is a legal hit
                let legalHit = false;
                // let legalHit = true;
                // getting an array with all rotating knives TODO: knife達どうするか
                // ささってるナイフのグループを保持して、なげたナイフがあたってるかどうかをチェク

                // is this a legal hit?
                if (legalHit) {
                    // player can now throw again
                    this.canThrow = true;
                    // adding the rotating knife in the same place of the knife just landed on target
                    const knife = me.pool.pull(
                        "knife",
                        this.knife.pos.x,
                        this.knife.pos.y
                    );
                    const targetTransform = this.target.currentTransform;
                    let rad = Math.atan2(
                        targetTransform.val[1],
                        targetTransform.val[0]
                    );
                    if (rad < 0) {
                        // angle is > Math.PI
                        rad += Math.PI * 2;
                    }
                    knife.impactAngle = rad;

                    console.log(knife);

                    // adding the rotating knife to xxxx

                    // bringing back the knife to its starting position
                    this.knife.pos.y =
                        (me.game.viewport.height / 5) * 4 -
                        this.knifeImage.height / 2;
                } else {
                    // in case this is not a legal hit
                    console.log(" this is not a legal hit!!!");
                    console.log(this.knife);

                    // tween to throw the knife
                    const t = new me.Tween(this.knife.pos)
                        .to(
                            {
                                y: me.game.viewport.height + this.knife.height
                            },
                            15 * 4
                        )
                        .onUpdate(dt => {
                            console.log(dt);

                            // this.knife.currentTransform.translate(me.game.viewport.width / 2, 400);
                            console.log(this.knife.currentTransform);
                            // this.knife.currentTransform.rotate(
                            //     (dt / 180) * Math.PI
                            // );
                        })
                        .onComplete(() => {
                            console.log(" knife not hit onComplete");
                            // me.state.change(me.state.PLAY);
                            console.info(me.state);

                            // me.state.change(me.state.GAMEOVER);

                            setTimeout(() => {
                                this.reset();
                            }, 1000);
                        })
                        .start();
                }
            });

        tween.start();
    },

    // action to perform when leaving this screen (state change)
    onDestroyEvent: function() {
        console.log(" call playScreen destroy event");

        me.input.releasePointerEvent("pointerdown", me.game.viewport);
    },
    //  TODO:
    checkIfLoss: function() {}
});
