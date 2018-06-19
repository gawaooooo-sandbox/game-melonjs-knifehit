game.KnifeManager = me.Container.extend({
    // 刺さったナイフの管理
    init: function() {
        console.log("call knife manager init");
        this._super(me.Container, "init");
    },
    createKnife: function(x, y, canThrow) {
        console.log(`knife manager create knife ${x}, ${y}, ${canThrow}`);
        this.addChild(me.pool.pull("knife", x, y, canThrow));
        this.updateChildBounds();

        // me.game.world.addChild(this);
    },
    onActivateEvent: function() {
        console.log(" knife manager on activate event");
    },
    onDeactivateEvent: function() {
        console.log("knife manager on deactivate event");
    },
    update: function(time) {
        this._super(me.Container, "update", [time]);
        this.updateChildBounds();
    },
    getKnifes: function() {
        console.log(this.children.length);
    }
});
