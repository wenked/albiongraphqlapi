"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zergUtils_1 = require("./zergUtils");
const lodash_1 = __importDefault(require("lodash"));
const playersHandler = (killboard, killersAndAssistsEvents, deathEvents, playersInfo) => {
    const playersKb = lodash_1.default.map(killboard.players, (players) => players);
    const playersArray = playersInfo
        .map((player) => {
        if (player !== undefined && killboard.players[player === null || player === void 0 ? void 0 : player.id] !== undefined) {
            let objplayer = killboard.players[player === null || player === void 0 ? void 0 : player.id];
            return Object.assign(Object.assign({}, objplayer), { weapon: player === null || player === void 0 ? void 0 : player.weapon, role: player === null || player === void 0 ? void 0 : player.role });
        }
        return {};
    })
        .map((player) => {
        if (player.killFame > 0) {
            let newplayer = killersAndAssistsEvents[player.id];
            return Object.assign(Object.assign({}, player), { averageIp: newplayer === null || newplayer === void 0 ? void 0 : newplayer.AverageItemPower });
        }
        else {
            let newplayer = deathEvents[player.id];
            return Object.assign(Object.assign({}, player), { averageIp: newplayer === null || newplayer === void 0 ? void 0 : newplayer.AverageItemPower });
        }
    });
    const mergePlayers = lodash_1.default.map(playersKb, (player) => {
        let player2 = lodash_1.default.find(playersArray, { id: player.id });
        if (player2 !== undefined) {
            return player2;
        }
        return Object.assign(Object.assign({}, player), { role: '', weapon: '', averageIp: 0 });
    });
    const mergeWithItems = mergePlayers.map((player2) => {
        if (player2.role !== '') {
            return player2;
        }
        if (player2.killFame > 0) {
            let newplayer = killersAndAssistsEvents[player2.id];
            return Object.assign(Object.assign({}, player2), { weapon: newplayer !== undefined
                    ? newplayer.Equipment.MainHand !== null
                        ? newplayer.Equipment.MainHand.Type
                        : ''
                    : '', role: newplayer !== undefined
                    ? newplayer.Equipment.MainHand !== null
                        ? zergUtils_1.getRole(newplayer.Equipment.MainHand.Type)
                        : ''
                    : '', averageIp: newplayer !== undefined && newplayer.AverageItemPower
                    ? newplayer.AverageItemPower
                    : 0 });
        }
        let newplayer = deathEvents[player2.id];
        return Object.assign(Object.assign({}, player2), { weapon: newplayer !== undefined
                ? newplayer.Equipment.MainHand !== null
                    ? newplayer.Equipment.MainHand.Type
                    : ''
                : '', role: newplayer !== undefined
                ? newplayer.Equipment.MainHand !== null
                    ? zergUtils_1.getRole(newplayer.Equipment.MainHand.Type)
                    : ''
                : '', averageIp: newplayer !== undefined && newplayer.AverageItemPower
                ? newplayer.AverageItemPower
                : 0 });
    });
    const formatedPlayers = mergeWithItems.map((player) => {
        return Object.assign(Object.assign({}, player), { averageIp: player.averageIp == null ? 0 : player.averageIp });
    });
    return formatedPlayers;
};
exports.default = playersHandler;
//# sourceMappingURL=playersHandler.js.map