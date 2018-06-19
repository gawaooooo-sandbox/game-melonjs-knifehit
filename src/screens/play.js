game.PlayScreen = me.ScreenObject.extend({
    // action to perform on state change
    onResetEvent: function() {
        console.log(" call playScreen reset event");
        me.game.world.addChild(new me.ColorLayer("background", "#444444"), 0);

        const targetImage = me.loader.getImage("target");
        this.target = me.pool.pull(
            "targetEntity",
            me.game.viewport.width / 2 - targetImage.width / 2,
            400 - targetImage.height / 2
        );
        this.knifeImage = me.loader.getImage("knife");
        this.knife = me.pool.pull(
            "knife",
            me.game.viewport.width / 2 - 0.5 - this.knifeImage.width / 2,
            (me.game.viewport.height / 5) * 4 - this.knifeImage.height / 2,
            true
        );

        this.knifeManager = new game.KnifeManager();

        me.game.world.addChild(this.knife, 1);
        me.game.world.addChild(this.target, 2);
        me.game.world.addChild(this.knifeManager, 1);

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

        this.knife.thrown(this.target);
    },

    // action to perform when leaving this screen (state change)
    onDestroyEvent: function() {
        console.log(" call playScreen destroy event");

        me.input.releasePointerEvent("pointerdown", me.game.viewport);
    },
    //  TODO:
    checkIfLoss: function() {}
});
