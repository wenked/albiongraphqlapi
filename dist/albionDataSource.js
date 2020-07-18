"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbionApiDataSource = void 0;
const apollo_datasource_rest_1 = require("apollo-datasource-rest");
const zergUtils_1 = require("./utils/zergUtils");
const lodash_1 = __importDefault(require("lodash"));
const sortTopFame = (a, b) => b.killFame - a.killFame;
const reducer = (acc, vAt) => {
    return acc + vAt.killFame;
};
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
        console.log(id);
        let offset = 0;
        let events = [];
        const killboard = await this.get(`battles/${id}`);
        let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
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
        const newPlayersObj = playersInfo
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
        console.log(newPlayersObj);
        const playersKb = lodash_1.default.map(killboard.players, (players) => players);
        const mergePlayers = lodash_1.default.map(playersKb, (player) => {
            let player2 = lodash_1.default.find(newPlayersObj, { id: player.id });
            if (player2 !== undefined) {
                return player2;
            }
            return Object.assign(Object.assign({}, player), { role: '', weapon: '', averageIp: null });
        });
        const mergeWithItems = mergePlayers.map((player2) => {
            if (player2.role !== '') {
                return player2;
            }
            if (player2.killFame > 0) {
                let newplayer = killersAndAssistsEvents[player2.id];
                return Object.assign(Object.assign({}, player2), { weapon: newplayer !== undefined &&
                        newplayer !== undefined &&
                        null &&
                        newplayer.Equipment.MainHand.Type, role: newplayer !== undefined &&
                        newplayer !== undefined &&
                        null &&
                        zergUtils_1.getRole(newplayer.Equipment.MainHand.Type), averageIp: newplayer !== undefined && newplayer.AverageItemPower
                        ? newplayer.AverageItemPower
                        : null });
            }
            let newplayer = deathEvents[player2.id];
            return Object.assign(Object.assign({}, player2), { weapon: newplayer !== undefined &&
                    newplayer !== undefined &&
                    null &&
                    newplayer.Equipment.MainHand.Type, role: newplayer !== undefined &&
                    newplayer !== undefined &&
                    null &&
                    zergUtils_1.getRole(newplayer.Equipment.MainHand.Type), averageIp: newplayer !== undefined && newplayer.AverageItemPower
                    ? newplayer.AverageItemPower
                    : null });
        });
        const handlerResult = () => {
            const arrAlly = lodash_1.default.map(killboard.alliances, (alliance) => alliance).sort(sortTopFame);
            const arrGuild = lodash_1.default.map(killboard.guilds, (guild) => guild)
                .sort(sortTopFame)
                .map((guild) => {
                return Object.assign(Object.assign({}, guild), { totalPlayers: lodash_1.default.map(killboard.players, (players) => players).filter((player) => player.guildName === guild.name).length });
            });
            const winnerAlly = arrAlly[0];
            const winnerGuild = arrGuild[0];
            if (winnerGuild.killFame > winnerAlly.killFame) {
                const winnerGuilds = arrGuild.filter((guild) => guild.name === winnerGuild.name);
                const losersGuilds = arrGuild.filter((guild) => guild.name !== winnerGuild.name);
                const playersWinners = mergeWithItems.filter((player) => player.guildName === winnerGuild.name);
                const playersLosers = mergeWithItems.filter((player) => player.guildName !== winnerGuild.name);
                return {
                    loserAllys: arrAlly,
                    winnerAllys: [],
                    winnerGuilds: winnerGuilds,
                    loserGuilds: losersGuilds,
                    winnerTotalFame: winnerGuild.killFame,
                    winnerTotalKIlls: winnerGuild.kills,
                    winnerTotalDeaths: winnerGuild.deaths,
                    loserTotalFame: arrAlly.reduce(reducer, 0),
                    loserTotalDeaths: arrAlly.reduce((acc, vat) => {
                        return acc + vat.deaths;
                    }, 0),
                    loserTotalKills: arrAlly.reduce((acc, vat) => {
                        return acc + vat.kills;
                    }, 0),
                    playersWinners,
                    playersLosers,
                };
            }
            const winnerAllys = arrAlly.filter((guild) => guild.name === winnerAlly.name);
            const loserAllys = arrAlly.filter((guild) => guild.name !== winnerAlly.name);
            const winnerTotalFame = winnerAllys.reduce(reducer, 0);
            const loserTotalFame = loserAllys.reduce(reducer, 0);
            const winnerGuilds = arrGuild.filter((guild) => guild.alliance === winnerAlly.name);
            const loserGuilds = arrGuild.filter((guild) => guild.alliance !== winnerAlly.name);
            const playersWinners = mergeWithItems.filter((player) => player.allianceName === winnerAlly.name);
            const playersLosers = mergeWithItems.filter((player) => player.allianceName !== winnerAlly.name);
            return {
                loserAllys,
                winnerAllys,
                winnerGuilds,
                loserGuilds,
                winnerTotalFame,
                loserTotalFame,
                playersWinners,
                playersLosers,
                winnerTotalKIlls: winnerAlly.kills,
                winnerTotalDeaths: winnerAlly.deaths,
                loserTotalKills: loserAllys.reduce((acc, vat) => {
                    return acc + vat.kills;
                }, 0),
                loserTotalDeaths: loserAllys.reduce((acc, vat) => {
                    return acc + vat.deaths;
                }, 0),
            };
        };
        return {
            battleId: killboard.id,
            totalKills: killboard.totalKills,
            totalFame: killboard.totalFame,
            players: newPlayersObj,
            startTime: killboard.startTime,
            endTime: killboard.endTime,
            totalPlayers: lodash_1.default.map(killboard.players, (players) => players).length,
            winners: {
                alliances: handlerResult().winnerAllys,
                guilds: handlerResult().winnerGuilds,
                totalFame: handlerResult().winnerTotalFame,
                players: handlerResult().playersWinners.sort((a, b) => b.killFame - a.killFame),
                kills: handlerResult().winnerTotalKIlls,
                deaths: handlerResult().winnerTotalDeaths,
                totalPlayers: handlerResult().playersWinners.length,
            },
            losers: {
                alliances: handlerResult().loserAllys,
                guilds: handlerResult().loserGuilds,
                totalFame: handlerResult().loserTotalFame,
                players: handlerResult().playersLosers.sort((a, b) => b.killFame - a.killFame),
                kills: handlerResult().loserTotalKills,
                deaths: handlerResult().loserTotalDeaths,
                totalPlayers: handlerResult().playersLosers.length,
            },
        };
    }
}
exports.AlbionApiDataSource = AlbionApiDataSource;
//# sourceMappingURL=albionDataSource.js.map