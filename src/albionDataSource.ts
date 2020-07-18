import { RESTDataSource } from 'apollo-datasource-rest';
import {
	getRole,
	organizeKillers,
	organizeDeaths,
	handleguild,
} from './utils/zergUtils';
import _ from 'lodash';
import {
	Guild,
	Alliance,
	Player,
	formatedPlayer,
	Battle,
	playerInfoWithWeapon,
	BattleListStyle,
} from './utils/types';

const sortTopFame = (a: any, b: any): number => b.killFame - a.killFame;
const reducer = (acc: any, vAt: any) => {
	return acc + vAt.killFame;
};

export class AlbionApiDataSource extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://gameinfo.albiononline.com/api/gameinfo/';
	}

	async getBattles(guildname: string) {
		const data = await this.get(`search?q=${guildname}`);

		const battles: BattleListStyle[] | undefined = await this.get(
			`battles?offset=0&limit=50&sort=recent&guildId=${data.guilds[0].Id}`
		);

		return battles?.map((battle: BattleListStyle) => {
			return {
				alliances: _.map(battle.alliances, (alliance) => alliance),
				battle_TIMEOUT: battle.battle_TIMEOUT,
				endTime: battle.endTime,
				guilds: _.map(battle.guilds, (guild) => guild),
				id: battle.id,
				startTime: battle.startTime,
				totalFame: battle.totalFame,
				totalKills: battle.totalKills,
				totalPlayers: _.map(battle.players, (player) => player).length,
			};
		});
	}

	async getBattleById(id: number) {
		console.log(id);
		let offset = 0;
		let events: Battle[] = [];
		const killboard = await this.get(`battles/${id}`);
		let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);

		for (offset = 0; data.length > 0; offset += 50) {
			data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
			events.push(data);
		}

		let battleFlat = events.flat();

		let participansFlat = _.uniqBy(
			battleFlat.map((event) => event.Participants).flat(),
			'Id'
		);

		let killersAndAssistsEvents = participansFlat.reduce(organizeKillers, {});

		let deathEvents = battleFlat.reduce(organizeDeaths, {});

		let playersWithItems = battleFlat.map((eventkill) =>
			eventkill.GroupMembers.map(
				(member): playerInfoWithWeapon => {
					if (member.Equipment.MainHand === null) {
						return {
							name: member.Name,
							guild: handleguild(member.GuildName),
							weapon: 'no weapon',
							id: member.Id,
							role: '',
							guildid: member.GuildId,
						};
					}
					return {
						name: member.Name,
						guild: handleguild(member.GuildName),
						weapon: member.Equipment.MainHand.Type,
						id: member.Id,
						role: getRole(member.Equipment.MainHand.Type),
						guildid: member.GuildId,
					};
				}
			)
		);

		const noFilterPlayersInfo = playersWithItems.flat();

		let playersInfo = _.uniqBy(noFilterPlayersInfo, 'id');

		const newPlayersObj: formatedPlayer[] = playersInfo
			.map((player) => {
				if (
					player !== undefined &&
					killboard.players[player?.id] !== undefined
				) {
					let objplayer = killboard.players[player?.id];

					return {
						...objplayer,
						weapon: player?.weapon,
						role: player?.role,
					};
				}

				return {};
			})
			.map((player) => {
				if (player.killFame > 0) {
					let newplayer = killersAndAssistsEvents[player.id];

					return {
						...player,
						averageIp: newplayer?.AverageItemPower,
					};
				} else {
					let newplayer = deathEvents[player.id];
					return {
						...player,
						averageIp: newplayer?.AverageItemPower,
					};
				}
			});
		console.log(newPlayersObj);
		const playersKb = _.map(killboard.players, (players) => players);
		const mergePlayers = _.map(playersKb, (player) => {
			let player2 = _.find(newPlayersObj, { id: player.id });
			if (player2 !== undefined) {
				return player2;
			}

			return {
				...player,
				role: '',
				weapon: '',
				averageIp: null,
			};
		});

		const mergeWithItems = mergePlayers.map((player2) => {
			if (player2.role !== '') {
				return player2;
			}
			if (player2.killFame > 0) {
				let newplayer = killersAndAssistsEvents[player2.id];
				return {
					...player2,
					weapon:
						newplayer !== undefined &&
						newplayer !== undefined &&
						null &&
						newplayer.Equipment.MainHand.Type,
					role:
						newplayer !== undefined &&
						getRole(newplayer.Equipment.MainHand.Type),
					averageIp:
						newplayer !== undefined && newplayer.AverageItemPower
							? newplayer.AverageItemPower
							: null,
				};
			}
			let newplayer = deathEvents[player2.id];
			return {
				...player2,
				weapon:
					newplayer !== undefined &&
					newplayer !== undefined &&
					null &&
					newplayer.Equipment.MainHand.Type,
				role:
					newplayer !== undefined &&
					newplayer !== undefined &&
					null &&
					getRole(newplayer.Equipment.MainHand.Type),
				averageIp:
					newplayer !== undefined && newplayer.AverageItemPower
						? newplayer.AverageItemPower
						: null,
			};
		});

		const handlerResult = () => {
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

			const winnerAllys = arrAlly.filter(
				(guild) => guild.name === winnerAlly.name
			);

			const loserAllys = arrAlly.filter(
				(guild) => guild.name !== winnerAlly.name
			);

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

		return {
			battleId: killboard.id,
			totalKills: killboard.totalKills,
			totalFame: killboard.totalFame,
			players: newPlayersObj,
			startTime: killboard.startTime,
			endTime: killboard.endTime,
			totalPlayers: _.map(killboard.players, (players) => players).length,
			winners: {
				alliances: handlerResult().winnerAllys,
				guilds: handlerResult().winnerGuilds,
				totalFame: handlerResult().winnerTotalFame,
				players: handlerResult().playersWinners.sort(
					(a, b) => b.killFame - a.killFame
				),
				kills: handlerResult().winnerTotalKIlls,
				deaths: handlerResult().winnerTotalDeaths,
				totalPlayers: handlerResult().playersWinners.length,
			},
			losers: {
				alliances: handlerResult().loserAllys,
				guilds: handlerResult().loserGuilds,
				totalFame: handlerResult().loserTotalFame,
				players: handlerResult().playersLosers.sort(
					(a, b) => b.killFame - a.killFame
				),
				kills: handlerResult().loserTotalKills,
				deaths: handlerResult().loserTotalDeaths,
				totalPlayers: handlerResult().playersLosers.length,
			},
		};
	}
}
