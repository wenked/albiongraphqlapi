"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultHandler = void 0;
const lodash_1 = __importDefault(require("lodash"));
const sortTopFame = (a, b) => b.killFame - a.killFame;
const reducer = (acc, vAt) => {
    return acc + vAt.killFame;
};
exports.resultHandler = (killboard, mergeWithItems) => {
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
//# sourceMappingURL=resultHandler.js.map