/*:
 * @target MZ
 * @plugindesc 自動切換玩家名稱、頭貼、行走圖
 * @author ChatGPT
 *
 * @help
 * 當對話名稱為 \N[1] 時，
 * 自動根據「玩家角色」變數切換頭貼。
 *
 * 同時遊戲啟動時會自動：
 * - 更新玩家名稱
 * - 更新玩家頭貼
 * - 更新玩家行走圖
 *
 * -----------------------------------
 * 變數名稱：
 * 玩家角色
 *
 * 變數值：
 * 0 = 男主
 * 1 = 女主
 * -----------------------------------
 */

(() => {

    //==============================
    // 變數名稱
    //==============================
    const PLAYER_VARIABLE_NAME = "玩家角色";

    //==============================
    // 玩家角色設定
    //==============================
    const FACE_CONFIG = {

        // 男主
        0: {

            // 玩家名稱
            playerName: "小羲",

            // 對話頭貼
            faceName: "客製_頭像_1",
            faceIndex: 1,

            // 行走序列圖
            playerAnimationSheet: "$小羲"
        },

        // 女主
        1: {

            // 玩家名稱
            playerName: "小可",

            // 對話頭貼
            faceName: "客製_頭像",
            faceIndex: 0,

            // 行走序列圖
            playerAnimationSheet: "$小可"
        }
    };

    //==============================
    // 取得變數ID
    //==============================
    function getVariableIdByName(variableName) {
        const variables = $dataSystem.variables;

        for (let i = 1; i < variables.length; i++) {
            if (variables[i] === variableName) {
                return i;
            }
        }

        return 0;
    }

    //==============================
    // 更新玩家資料
    //==============================
    function refreshPlayerData() {
        if (!$gameVariables)
            return;

        const variableId =
            getVariableIdByName(PLAYER_VARIABLE_NAME);

        if (variableId <= 0) {
            console.warn(
                `[AutoPlayerFace] 找不到變數: ${PLAYER_VARIABLE_NAME}`
            );
            return;
        }

        const actorType =
            $gameVariables.value(variableId);

        const config =
            FACE_CONFIG[actorType];

        if (!config) {
            console.warn(
                `[AutoPlayerFace] 找不到角色設定: ${actorType}`
            );
            return;
        }

        const actor =
            $gameActors.actor(1);

        if (!actor)
            return;

        // 名稱
        actor.setName(
            config.playerName
        );

        // 頭貼
        actor.setFaceImage(
            config.faceName,
            config.faceIndex
        );

        // 行走圖
        actor.setCharacterImage(
            config.playerAnimationSheet,
            0
        );

        $gamePlayer.refresh();
    }

    //==============================
    // 遊戲啟動時更新
    //==============================
    const _Scene_Map_start =
        Scene_Map.prototype.start;

    Scene_Map.prototype.start = function () {
        _Scene_Map_start.call(this);

        refreshPlayerData();
    };

    //==============================
    // 攔截 Show Text
    //==============================
    const _Game_Interpreter_command101 =
        Game_Interpreter.prototype.command101;

    Game_Interpreter.prototype.command101 =
        function (params) {
            const faceName = params[0];
            const faceIndex = params[1];
            const background = params[2];
            const positionType = params[3];
            const speakerName = params[4];

            let finalFaceName = faceName;
            let finalFaceIndex = faceIndex;

            const convertedName =
                Window_Base.prototype.convertEscapeCharacters(
                    speakerName
                );

            const actor =
                $gameActors.actor(1);

            if (speakerName === "\\N[1]") {
                const variableId =
                    getVariableIdByName(
                        PLAYER_VARIABLE_NAME
                    );

                const actorType =
                    $gameVariables.value(variableId);

                const config =
                    FACE_CONFIG[actorType];

                if (config) {
                    finalFaceName =
                        config.faceName;

                    finalFaceIndex =
                        config.faceIndex;
                }
            }

            const newParams = [
                finalFaceName,
                finalFaceIndex,
                background,
                positionType,
                speakerName
            ];

            return _Game_Interpreter_command101.call(
                this,
                newParams
            );
        };

})();