"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AlbionApiDataSource = void 0;
var apollo_datasource_rest_1 = require("apollo-datasource-rest");
var zergUtils_1 = require("./utils/zergUtils");
var lodash_1 = require("lodash");
var sortTopFame = function (a, b) { return b.killFame - a.killFame; };
var reducer = function (acc, vAt) {
    return acc + vAt.killFame;
};
var AlbionApiDataSource = /** @class */ (function (_super) {
    __extends(AlbionApiDataSource, _super);
    function AlbionApiDataSource() {
        var _this = _super.call(this) || this;
        _this.baseURL = 'https://gameinfo.albiononline.com/api/gameinfo/';
        return _this;
    }
    AlbionApiDataSource.prototype.getBattles = function (guildname) {
        return __awaiter(this, void 0, void 0, function () {
            var data, battles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.get("search?q=" + guildname)];
                    case 1:
                        data = _a.sent();
                        return [4 /*yield*/, this.get("battles?offset=0&limit=50&sort=recent&guildId=" + data.guilds[0].Id)];
                    case 2:
                        battles = _a.sent();
                        return [2 /*return*/, battles === null || battles === void 0 ? void 0 : battles.map(function (battle) {
                                return {
                                    alliances: lodash_1["default"].map(battle.alliances, function (alliance) { return alliance; }),
                                    battle_TIMEOUT: battle.battle_TIMEOUT,
                                    endTime: battle.endTime,
                                    guilds: lodash_1["default"].map(battle.guilds, function (guild) { return guild; }),
                                    id: battle.id,
                                    startTime: battle.startTime,
                                    totalFame: battle.totalFame,
                                    totalKills: battle.totalKills,
                                    totalPlayers: lodash_1["default"].map(battle.players, function (player) { return player; }).length
                                };
                            })];
                }
            });
        });
    };
    AlbionApiDataSource.prototype.getBattleById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var offset, events, killboard, data, battleFlat, participansFlat, killersAndAssistsEvents, deathEvents, playersWithItems, noFilterPlayersInfo, playersInfo, newPlayersObj, playersKb, mergePlayers, mergeWithItems, handlerResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(id);
                        offset = 0;
                        events = [];
                        return [4 /*yield*/, this.get("battles/" + id)];
                    case 1:
                        killboard = _a.sent();
                        return [4 /*yield*/, this.get("events/battle/" + id + "?offset=" + offset + "&limit=51")];
                    case 2:
                        data = _a.sent();
                        offset = 0;
                        _a.label = 3;
                    case 3:
                        if (!(data.length > 0)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.get("events/battle/" + id + "?offset=" + offset + "&limit=51")];
                    case 4:
                        data = _a.sent();
                        events.push(data);
                        _a.label = 5;
                    case 5:
                        offset += 50;
                        return [3 /*break*/, 3];
                    case 6:
                        battleFlat = events.flat();
                        participansFlat = lodash_1["default"].uniqBy(battleFlat.map(function (event) { return event.Participants; }).flat(), 'Id');
                        killersAndAssistsEvents = participansFlat.reduce(zergUtils_1.organizeKillers, {});
                        deathEvents = battleFlat.reduce(zergUtils_1.organizeDeaths, {});
                        playersWithItems = battleFlat.map(function (eventkill) {
                            return eventkill.GroupMembers.map(function (member) {
                                if (member.Equipment.MainHand === null) {
                                    return {
                                        name: member.Name,
                                        guild: zergUtils_1.handleguild(member.GuildName),
                                        weapon: 'no weapon',
                                        id: member.Id,
                                        role: '',
                                        guildid: member.GuildId
                                    };
                                }
                                return {
                                    name: member.Name,
                                    guild: zergUtils_1.handleguild(member.GuildName),
                                    weapon: member.Equipment.MainHand.Type,
                                    id: member.Id,
                                    role: zergUtils_1.getRole(member.Equipment.MainHand.Type),
                                    guildid: member.GuildId
                                };
                            });
                        });
                        noFilterPlayersInfo = playersWithItems.flat();
                        playersInfo = lodash_1["default"].uniqBy(noFilterPlayersInfo, 'id');
                        newPlayersObj = playersInfo
                            .map(function (player) {
                            if (player !== undefined &&
                                killboard.players[player === null || player === void 0 ? void 0 : player.id] !== undefined) {
                                var objplayer = killboard.players[player === null || player === void 0 ? void 0 : player.id];
                                return __assign(__assign({}, objplayer), { weapon: player === null || player === void 0 ? void 0 : player.weapon, role: player === null || player === void 0 ? void 0 : player.role });
                            }
                            return {};
                        })
                            .map(function (player) {
                            if (player.killFame > 0) {
                                var newplayer = killersAndAssistsEvents[player.id];
                                return __assign(__assign({}, player), { averageIp: newplayer === null || newplayer === void 0 ? void 0 : newplayer.AverageItemPower });
                            }
                            else {
                                var newplayer = deathEvents[player.id];
                                return __assign(__assign({}, player), { averageIp: newplayer === null || newplayer === void 0 ? void 0 : newplayer.AverageItemPower });
                            }
                        });
                        console.log(newPlayersObj);
                        playersKb = lodash_1["default"].map(killboard.players, function (players) { return players; });
                        mergePlayers = lodash_1["default"].map(playersKb, function (player) {
                            var player2 = lodash_1["default"].find(newPlayersObj, { id: player.id });
                            if (player2 !== undefined) {
                                return player2;
                            }
                            return __assign(__assign({}, player), { role: '', weapon: '', averageIp: null });
                        });
                        mergeWithItems = mergePlayers.map(function (player2) {
                            if (player2.role !== '') {
                                return player2;
                            }
                            if (player2.killFame > 0) {
                                var newplayer_1 = killersAndAssistsEvents[player2.id];
                                return __assign(__assign({}, player2), { weapon: newplayer_1 !== undefined &&
                                        newplayer_1 !== undefined &&
                                        null &&
                                        newplayer_1.Equipment.MainHand.Type, role: newplayer_1 !== undefined &&
                                        zergUtils_1.getRole(newplayer_1.Equipment.MainHand.Type), averageIp: newplayer_1 !== undefined && newplayer_1.AverageItemPower
                                        ? newplayer_1.AverageItemPower
                                        : null });
                            }
                            var newplayer = deathEvents[player2.id];
                            return __assign(__assign({}, player2), { weapon: newplayer !== undefined &&
                                    newplayer !== undefined &&
                                    null &&
                                    newplayer.Equipment.MainHand.Type, role: newplayer !== undefined &&
                                    newplayer !== undefined &&
                                    null &&
                                    zergUtils_1.getRole(newplayer.Equipment.MainHand.Type), averageIp: newplayer !== undefined && newplayer.AverageItemPower
                                    ? newplayer.AverageItemPower
                                    : null });
                        });
                        handlerResult = function () {
                            var arrAlly = lodash_1["default"].map(killboard.alliances, function (alliance) { return alliance; }).sort(sortTopFame);
                            var arrGuild = lodash_1["default"].map(killboard.guilds, function (guild) { return guild; })
                                .sort(sortTopFame)
                                .map(function (guild) {
                                return __assign(__assign({}, guild), { totalPlayers: lodash_1["default"].map(killboard.players, function (players) { return players; }).filter(function (player) { return player.guildName === guild.name; }).length });
                            });
                            var winnerAlly = arrAlly[0];
                            var winnerGuild = arrGuild[0];
                            if (winnerGuild.killFame > winnerAlly.killFame) {
                                var winnerGuilds_1 = arrGuild.filter(function (guild) { return guild.name === winnerGuild.name; });
                                var losersGuilds = arrGuild.filter(function (guild) { return guild.name !== winnerGuild.name; });
                                var playersWinners_1 = mergeWithItems.filter(function (player) { return player.guildName === winnerGuild.name; });
                                var playersLosers_1 = mergeWithItems.filter(function (player) { return player.guildName !== winnerGuild.name; });
                                return {
                                    loserAllys: arrAlly,
                                    winnerAllys: [],
                                    winnerGuilds: winnerGuilds_1,
                                    loserGuilds: losersGuilds,
                                    winnerTotalFame: winnerGuild.killFame,
                                    winnerTotalKIlls: winnerGuild.kills,
                                    winnerTotalDeaths: winnerGuild.deaths,
                                    loserTotalFame: arrAlly.reduce(reducer, 0),
                                    loserTotalDeaths: arrAlly.reduce(function (acc, vat) {
                                        return acc + vat.deaths;
                                    }, 0),
                                    loserTotalKills: arrAlly.reduce(function (acc, vat) {
                                        return acc + vat.kills;
                                    }, 0),
                                    playersWinners: playersWinners_1,
                                    playersLosers: playersLosers_1
                                };
                            }
                            var winnerAllys = arrAlly.filter(function (guild) { return guild.name === winnerAlly.name; });
                            var loserAllys = arrAlly.filter(function (guild) { return guild.name !== winnerAlly.name; });
                            var winnerTotalFame = winnerAllys.reduce(reducer, 0);
                            var loserTotalFame = loserAllys.reduce(reducer, 0);
                            var winnerGuilds = arrGuild.filter(function (guild) { return guild.alliance === winnerAlly.name; });
                            var loserGuilds = arrGuild.filter(function (guild) { return guild.alliance !== winnerAlly.name; });
                            var playersWinners = mergeWithItems.filter(function (player) { return player.allianceName === winnerAlly.name; });
                            var playersLosers = mergeWithItems.filter(function (player) { return player.allianceName !== winnerAlly.name; });
                            return {
                                loserAllys: loserAllys,
                                winnerAllys: winnerAllys,
                                winnerGuilds: winnerGuilds,
                                loserGuilds: loserGuilds,
                                winnerTotalFame: winnerTotalFame,
                                loserTotalFame: loserTotalFame,
                                playersWinners: playersWinners,
                                playersLosers: playersLosers,
                                winnerTotalKIlls: winnerAlly.kills,
                                winnerTotalDeaths: winnerAlly.deaths,
                                loserTotalKills: loserAllys.reduce(function (acc, vat) {
                                    return acc + vat.kills;
                                }, 0),
                                loserTotalDeaths: loserAllys.reduce(function (acc, vat) {
                                    return acc + vat.deaths;
                                }, 0)
                            };
                        };
                        return [2 /*return*/, {
                                battleId: killboard.id,
                                totalKills: killboard.totalKills,
                                totalFame: killboard.totalFame,
                                players: newPlayersObj,
                                startTime: killboard.startTime,
                                endTime: killboard.endTime,
                                totalPlayers: lodash_1["default"].map(killboard.players, function (players) { return players; }).length,
                                winners: {
                                    alliances: handlerResult().winnerAllys,
                                    guilds: handlerResult().winnerGuilds,
                                    totalFame: handlerResult().winnerTotalFame,
                                    players: handlerResult().playersWinners,
                                    kills: handlerResult().winnerTotalKIlls,
                                    deaths: handlerResult().winnerTotalDeaths,
                                    totalPlayers: handlerResult().playersWinners.length
                                },
                                losers: {
                                    alliances: handlerResult().loserAllys,
                                    guilds: handlerResult().loserGuilds,
                                    totalFame: handlerResult().loserTotalFame,
                                    players: handlerResult().playersLosers,
                                    kills: handlerResult().loserTotalKills,
                                    deaths: handlerResult().loserTotalDeaths,
                                    totalPlayers: handlerResult().playersLosers.length
                                }
                            }];
                }
            });
        });
    };
    return AlbionApiDataSource;
}(apollo_datasource_rest_1.RESTDataSource));
exports.AlbionApiDataSource = AlbionApiDataSource;
