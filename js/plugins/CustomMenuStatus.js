/*:
 * @target MZ
 * @plugindesc 自訂主選單：只顯示金錢、選項、保存、遊戲結束，置中排版
 */

(() => {
    Scene_Menu.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createCommandWindow();
        this.createGoldWindow();
        this.createStatusWindow();
    };

    Scene_Menu.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);

        if (this._commandWindow) {
            this._commandWindow.refresh();
        }

        if (this._statusWindow) {
            this._statusWindow.refresh();
        }
    };

    Scene_Menu.prototype.commandWindowRect = function() {
        const ww = 360;
        const wh = 300;
        const wx = Math.floor((Graphics.boxWidth - ww) / 2);
        const wy = Math.floor((Graphics.boxHeight - wh) / 2);
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_Menu.prototype.createGoldWindow = function() {
        // 不建立預設金錢視窗
    };

    Scene_Menu.prototype.createStatusWindow = function() {
        // 建立但隱藏，避免 MZ 內部 refresh 報錯
        const rect = new Rectangle(0, 0, 1, 1);
        this._statusWindow = new Window_MenuStatus(rect);
        this._statusWindow.hide();
        this._statusWindow.deactivate();
        this.addWindow(this._statusWindow);
    };

    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addOptionsCommand();
        this.addSaveCommand();
        this.addGameEndCommand();
    };

    Window_MenuCommand.prototype.itemHeight = function() {
        return 54;
    };

    Window_MenuCommand.prototype.itemRect = function(index) {
        const rect = Window_Selectable.prototype.itemRect.call(this, index);
        rect.y += 90;
        return rect;
    };

    Window_MenuCommand.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        this.drawText(this.commandName(index), rect.x, rect.y, rect.width, "center");
    };

    const _Window_MenuCommand_refresh = Window_MenuCommand.prototype.refresh;
    Window_MenuCommand.prototype.refresh = function() {
        _Window_MenuCommand_refresh.call(this);

        const goldText = `${$gameParty.gold()} ${TextManager.currencyUnit}`;

        this.changeTextColor(ColorManager.systemColor());
        this.drawText("玩家金錢", 0, 16, this.contentsWidth(), "center");

        this.resetTextColor();
        this.drawText(goldText, 0, 48, this.contentsWidth(), "center");
    };
})();