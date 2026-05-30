(() => {

    // ===== 可調整設定 =====
    const se = {
        name: "click", // 音效名稱
        volume: 90,
        pitch: 100,
        pan: 0
    };

    // ===== 攔截開始訊息 =====
    const _Window_Message_startMessage =
        Window_Message.prototype.startMessage;

    Window_Message.prototype.startMessage = function () {

        AudioManager.playSe(se);

        _Window_Message_startMessage.call(this);
    };

})();