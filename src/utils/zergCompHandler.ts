import { formatedPlayer, Guild } from './types';

const zergCompHandler = (guilds: Guild[], players: formatedPlayer[]) => {
	const guildmap = guilds.map((guild) => {
		let guildPlayers = players.filter(
			(player) => player.guildName === guild.name
		);
		let tankCount = guildPlayers.filter((player) => player.role === 'Tank')
			.length;
		let healerCount = guildPlayers.filter((player) => player.role === 'Healer')
			.length;
		let rangedDpsCount = guildPlayers.filter(
			(player) => player.role === 'Ranged Dps'
		).length;
		let supportCount = guildPlayers.filter(
			(player) => player.role === 'Support'
		).length;
		let meleeCount = guildPlayers.filter(
			(player) => player.role === 'Melee Dps'
		).length;

		return {
			...guild,
			tankCount,
			healerCount,
			rangedDpsCount,
			supportCount,
			meleeCount,
		};
	});

	return guildmap;
};

export default zergCompHandler;
