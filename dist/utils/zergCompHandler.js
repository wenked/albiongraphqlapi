"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zergCompHandler = (guilds, players) => {
    const guildmap = guilds.map((guild) => {
        let guildPlayers = players.filter((player) => player.guildName === guild.name);
        let tankCount = guildPlayers.filter((player) => player.role === 'Tank')
            .length;
        let healerCount = guildPlayers.filter((player) => player.role === 'Healer')
            .length;
        let rangedDpsCount = guildPlayers.filter((player) => player.role === 'Ranged Dps').length;
        let supportCount = guildPlayers.filter((player) => player.role === 'Support').length;
        let meleeCount = guildPlayers.filter((player) => player.role === 'Melee Dps').length;
        return Object.assign(Object.assign({}, guild), { tankCount,
            healerCount,
            rangedDpsCount,
            supportCount,
            meleeCount });
    });
    return guildmap;
};
exports.default = zergCompHandler;
//# sourceMappingURL=zergCompHandler.js.map