"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbionApiDataSource = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const zergUtils_1 = require("./utils/zergUtils");
const lodash_1 = __importDefault(require("lodash"));
const resultHandler_1 = require("./utils/resultHandler");
class AlbionApiDataSource extends apollo_datasource_rest_1.RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://gameinfo.albiononline.com/api/gameinfo/';
    }
    async getBattles(guildname) {
        const data = await this.get(`search?q=${guildname}`);
        const battles = await this.get(`battles?offset=0&limit=50&sort=recent&guildId=${data.guilds[0].Id}`);
        return battles === null || battles === void 0 ? void 0 : battles.map((battle) => {
            return {
                alliances: lodash_1.default.map(battle.alliances, (alliance) => alliance),
                battle_TIMEOUT: battle.battle_TIMEOUT,
                endTime: battle.endTime,
                guilds: lodash_1.default.map(battle.guilds, (guild) => guild),
                id: battle.id,
                startTime: battle.startTime,
                totalFame: battle.totalFame,
                totalKills: battle.totalKills,
                totalPlayers: lodash_1.default.map(battle.players, (player) => player).length,
            };
        });
    }
    async getBattleById(id) {
        let offset = 0;
        let events = [];
        const killboard = await this.get(`battles/${id}`);
        let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
        const playersKb = lodash_1.default.map(killboard.players, (players) => players);
        for (offset = 0; data.length > 0; offset += 50) {
            data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
            events.push(data);
        }
        let battleFlat = events.flat();
        let participansFlat = lodash_1.default.uniqBy(battleFlat.map((event) => event.Participants).flat(), 'Id');
        let killersAndAssistsEvents = participansFlat.reduce(zergUtils_1.organizeKillers, {});
        let deathEvents = battleFlat.reduce(zergUtils_1.organizeDeaths, {});
        let playersWithItems = battleFlat.map((eventkill) => eventkill.GroupMembers.map((member) => {
            if (member.Equipment.MainHand === null) {
                return {
                    name: member.Name,
                    guild: zergUtils_1.handleguild(member.GuildName),
                    weapon: 'no weapon',
                    id: member.Id,
                    role: '',
                    guildid: member.GuildId,
                };
            }
            return {
                name: member.Name,
                guild: zergUtils_1.handleguild(member.GuildName),
                weapon: member.Equipment.MainHand.Type,
                id: member.Id,
                role: zergUtils_1.getRole(member.Equipment.MainHand.Type),
                guildid: member.GuildId,
            };
        }));
        const noFilterPlayersInfo = playersWithItems.flat();
        let playersInfo = lodash_1.default.uniqBy(noFilterPlayersInfo, 'id');
        const playersArray = playersInfo
            .map((player) => {
            if (player !== undefined &&
                killboard.players[player === null || player === void 0 ? void 0 : player.id] !== undefined) {
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
        const teste = mergeWithItems.map((player) => {
            return Object.assign(Object.assign({}, player), { averageIp: player.averageIp == null ? 0 : player.averageIp });
        });
        console.log(teste);
        const { winnerGuilds, winnerAllys, loserAllys, loserGuilds, loserTotalDeaths, loserTotalFame, loserTotalKills, playersLosers, playersWinners, winnerTotalDeaths, winnerTotalFame, winnerTotalKIlls, } = resultHandler_1.resultHandler(killboard, mergeWithItems);
        return {
            battleId: killboard.id,
            totalKills: killboard.totalKills,
            totalFame: killboard.totalFame,
            players: playersArray,
            startTime: killboard.startTime,
            endTime: killboard.endTime,
            totalPlayers: lodash_1.default.map(killboard.players, (players) => players).length,
            winners: {
                alliances: winnerAllys,
                guilds: winnerGuilds,
                totalFame: winnerTotalFame,
                players: playersWinners.sort((a, b) => b.killFame - a.killFame),
                kills: winnerTotalKIlls,
                deaths: winnerTotalDeaths,
                totalPlayers: playersWinners.length,
            },
            losers: {
                alliances: loserAllys,
                guilds: loserGuilds,
                totalFame: loserTotalFame,
                players: playersLosers.sort((a, b) => b.killFame - a.killFame),
                kills: loserTotalKills,
                deaths: loserTotalDeaths,
                totalPlayers: playersLosers.length,
            },
        };
    }
}
exports.AlbionApiDataSource = AlbionApiDataSource;
//# sourceMappingURL=albionDataSource.js.map