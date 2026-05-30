(() => {
    const _Sprite_Character_update = Sprite_Character.prototype.update;

    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);

        if (!this._character || !this._character.event) return;

        const event = this._character.event();
        if (!event || !event.event) return;

        const note = event.event().note || "";

        if (!note.includes("<ScaleBounce>")) return;

        const t = Graphics.frameCount * 0.12;

        const scaleY = 1 + Math.sin(t) * 0.04;
        const scaleX = 1 - Math.sin(t) * 0.015;

        this.scale.x = scaleX;
        this.scale.y = scaleY;
    };
})();