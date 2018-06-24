game.PlayScreen = me.ScreenObject.extend({
    // action to perform on state change
    onResetEvent: function() {
        console.log(" call playScreen reset event");
        me.game.world.addChild(new me.ColorLayer("background", "#444444"), 0);

        const targetImage = me.loader.getImage("target");
        this.target = me.pool.pull(
            "target",
            me.game.viewport.width / 2 - targetImage.width / 2,
            400 - targetImage.height / 2
        );

        console.log(this.target.pos.x, this.target.pos.y);
        console.log(this.target.width, this.target.height);
        console.log(this.target.pos.x + (this.target.width / 2));
        console.log(this.target.pos.y + (this.target.height / 2));

        this.knifeImage = me.loader.getImage("knife");
        this.throwingKnife = me.pool.pull(
            "throwingKnife",
            me.game.viewport.width / 2 - 0.5 - this.knifeImage.width / 2,
            (me.game.viewport.height / 5) * 4 - this.knifeImage.height / 2,
            this.target
        );
        // this.throwingKnife = me.pool.pull(
        //     "throwingKnife",
        //     this.target.pos.x + this.target.width / 2,
        //     this.target.pos.y + this.target.height,
        //     this.target
        // );

        this.hitKnifeManager = me.pool.pull('hitKnifeManager');

        // this.knifeManager = new game.KnifeManager();
        // me.game.world.addChild(this.hitKnifeManager, 0);
        me.game.world.addChild(this.throwingKnife, 2);
        me.game.world.addChild(this.target, 2);
        // me.game.world.addChild(this.knifeManager, 1);

        // registere on the 'pointerdown' event
        me.input.registerPointerEvent(
            "pointerdown",
            me.game.viewport,
            this.pointerDown.bind(this)
        );
    },
    pointerDown: function(pointer) {
        // TODO: なんとかマネージャー？つかたほうがいいのかも
        // this.knife.thrown();
        this.thrownKnife();

        return false;
    },
    // TODO:
    thrownKnife: function() {
        console.group("playScreen");
        console.log(" call thrownKnife ");

        this.throwingKnife.throw();

        console.groupEnd();
    },

    // action to perform when leaving this screen (state change)
    onDestroyEvent: function() {
        console.log(" call playScreen destroy event");

        me.input.releasePointerEvent("pointerdown", me.game.viewport);
    },
    //  TODO:
    checkIfLoss: function() {}
});
