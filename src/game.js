/* Game namespace */
const game = {
    // // an object whre to store game information
    // data: {
    //     score: 0
    // }

    // Run on page load
    onload: function() {
        // Initialize the video
        if (!me.video.init(750, 1334, { wrapper: "screen", scale: "auto" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (me.game.HASH.debug === true) {
            me.device.onReady(function() {
                me.plugin.register.defer(
                    this,
                    me.debug.Panel,
                    "debug",
                    me.input.KEY.V
                );
            });
        }

        // set and load all resources.
        // (this will also automatcally switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loade.
    loaded: function() {
        console.log(" preloaded ... ");
        // TODO: entity
        me.pool.register("target", game.TargetEntity);
        me.pool.register("throwingKnife", game.ThrowingKnifeEntity);

        // set the 'Play/Ingame' Screen Object
        this.playScreen = new game.PlayScreen();
        me.state.set(me.state.PLAY, this.playScreen);

        console.info(me.state);

        // Start the game
        me.state.change(me.state.PLAY);
    }
};
