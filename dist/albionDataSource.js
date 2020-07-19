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
const playersHandler_1 = __importDefault(require("./utils/playersHandler"));
const zergCompHandler_1 = __importDefault(require("./utils/zergCompHandler"));
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
        console.log(playersKb);
        for (offset = 0; data.length > 0; offset += 50) {
            data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
            events.push(data);
        }
        let battleFlat = events.flat();
        let participansFlat = lodash_1.default.uniqBy(battleFlat.map((event) => event.Participants).flat(), 'Id');
        let killersAndAssistsEvents = participansFlat.reduce(zergUtils_1.organizeKillers, {});
        let deathEvents = battleFlat.reduce(zergUtils_1.organizeDeaths, {});
        console.log(deathEvents);
        let playersWithItems = battleFlat
            .map((eventkill) => eventkill.GroupMembers.map((member) => {
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
        }))
            .flat();
        let playersInfo = lodash_1.default.uniqBy(playersWithItems, 'id');
        const formatedPlayers = playersHandler_1.default(killboard, killersAndAssistsEvents, deathEvents, playersInfo);
        const { winnerGuilds, winnerAllys, loserAllys, loserGuilds, loserTotalDeaths, loserTotalFame, loserTotalKills, playersLosers, playersWinners, winnerTotalDeaths, winnerTotalFame, winnerTotalKIlls, } = resultHandler_1.resultHandler(killboard, formatedPlayers);
        const guildsWithComp = zergCompHandler_1.default(winnerGuilds.concat(loserGuilds), formatedPlayers);
        return {
            battleId: killboard.id,
            totalKills: killboard.totalKills,
            guilds: guildsWithComp,
            totalFame: killboard.totalFame,
            players: formatedPlayers,
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