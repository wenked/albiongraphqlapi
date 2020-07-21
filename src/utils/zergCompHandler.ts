import { formatedPlayer, Guild } from './types';

const zergCompHandler = (guilds: Guild[], players: formatedPlayer[]) => {
	const guildmap = guilds.map((guild) => {
		let guildPlayers = players.filter(
			(player) => player.guildName === guild.name
		);
		let tankCount = guildPlayers.filter((player) => player.role === 'Tank');
		let healerCount = guildPlayers.filter((player) => player.role === 'Healer');
		let rangedDpsCount = guildPlayers.filter(
			(player) => player.role === 'Ranged Dps'
		);
		let supportCount = guildPlayers.filter(
			(player) => player.role === 'Support'
		);
		let meleeCount = guildPlayers.filter(
			(player) => player.role === 'Melee Dps'
		);

		let guildAverageIp =
			guildPlayers.reduce((acc: any, vat: any) => acc + vat.averageIp, 0) !==
				0 &&
			Math.floor(
				guildPlayers.reduce((acc: any, vat: any) => acc + vat.averageIp, 0) /
					guildPlayers.filter((player) => player.averageIp !== 0).length
			);

		return {
			...guild,
			guildAverageIp,
			tanks: tankCount,
			healers: healerCount,
			rangedDps: rangedDpsCount,
			supports: supportCount,
			melees: meleeCount,
		};
	});

	return guildmap;
};

export default zergCompHandler;
