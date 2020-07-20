import { Alliance, Guild, formatedPlayer, BattleListStyle } from './types';
import _ from 'lodash';

const sortTopFame = (a: any, b: any): number => b.killFame - a.killFame;
const reducer = (acc: any, vAt: any) => {
	return acc + vAt.killFame;
};
export const resultHandler = (
	killboard: BattleListStyle,
	mergeWithItems?: formatedPlayer[]
) => {
	const arrAlly: Alliance[] = _.map(
		killboard.alliances,
		(alliance) => alliance
	).sort(sortTopFame);

	const arrGuild: Guild[] = _.map(killboard.guilds, (guild) => guild)
		.sort(sortTopFame)
		.map((guild) => {
			return {
				...guild,
				totalPlayers: _.map(killboard.players, (players) => players).filter(
					(player) => player.guildName === guild.name
				).length,
			};
		});

	const winnerAlly = arrAlly[0];

	const winnerGuild = arrGuild[0];

	if (mergeWithItems === undefined) {
		if (winnerGuild.killFame > winnerAlly.killFame) {
			const winnerGuilds = arrGuild.filter(
				(guild) => guild.name === winnerGuild.name
			);
			const losersGuilds = arrGuild.filter(
				(guild) => guild.name !== winnerGuild.name
			);

			return {
				winnerGuildsStrings: winnerGuilds.map((guild) => guild.name),
				loserGuildsStrings: losersGuilds.map((guild) => guild.name),
				loserAllysStrings: arrAlly.map((guild) => guild.name),
				winnerAllysStrings: [],
			};
		}
		const winnerAllys = arrAlly.filter(
			(guild) => guild.name === winnerAlly.name
		);

		const loserAllys = arrAlly.filter(
			(guild) => guild.name !== winnerAlly.name
		);

		const winnerGuilds = arrGuild.filter(
			(guild) => guild.alliance === winnerAlly.name
		);

		const loserGuilds = arrGuild.filter(
			(guild) => guild.alliance !== winnerAlly.name
		);

		return {
			winnerGuildsStrings: winnerGuilds.map((guild) => guild.name),
			loserGuildsStrings: loserGuilds.map((guild) => guild.name),
			winnerAllysStrings: winnerAllys.map((guild) => guild.name),
			loserAllysStrings: loserAllys.map((guild) => guild.name),
		};
	}

	if (winnerGuild.killFame > winnerAlly.killFame) {
		const winnerGuilds = arrGuild.filter(
			(guild) => guild.name === winnerGuild.name
		);
		const losersGuilds = arrGuild.filter(
			(guild) => guild.name !== winnerGuild.name
		);

		const playersWinners = mergeWithItems.filter(
			(player) => player.guildName === winnerGuild.name
		);

		const playersLosers = mergeWithItems.filter(
			(player) => player.guildName !== winnerGuild.name
		);

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

	const winnerGuilds = arrGuild.filter(
		(guild) => guild.alliance === winnerAlly.name
	);

	const loserGuilds = arrGuild.filter(
		(guild) => guild.alliance !== winnerAlly.name
	);

	const playersWinners = mergeWithItems.filter(
		(player) => player.allianceName === winnerAlly.name
	);
	const playersLosers = mergeWithItems.filter(
		(player) => player.allianceName !== winnerAlly.name
	);

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
