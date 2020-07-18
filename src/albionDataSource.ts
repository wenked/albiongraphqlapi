import { RESTDataSource } from 'apollo-datasource-rest';
import {
	getRole,
	organizeKillers,
	organizeDeaths,
	handleguild,
} from './utils/zergUtils';
import _, { merge } from 'lodash';
import {
	formatedPlayer,
	Battle,
	playerInfoWithWeapon,
	BattleListStyle,
} from './utils/types';
import { resultHandler } from './utils/resultHandler';

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
		let offset = 0;
		let events: Battle[] = [];
		const killboard: BattleListStyle = await this.get(`battles/${id}`);
		let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
		const playersKb = _.map(killboard.players, (players) => players);

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

		const playersArray: formatedPlayer[] = playersInfo
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

		const mergePlayers = _.map(playersKb, (player) => {
			let player2 = _.find(playersArray, { id: player.id });
			if (player2 !== undefined) {
				return player2;
			}

			return {
				...player,
				role: '',
				weapon: '',
				averageIp: 0,
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
						newplayer !== undefined
							? newplayer.Equipment.MainHand !== null
								? newplayer.Equipment.MainHand.Type
								: ''
							: '',

					role:
						newplayer !== undefined
							? newplayer.Equipment.MainHand !== null
								? getRole(newplayer.Equipment.MainHand.Type)
								: ''
							: '',

					averageIp:
						newplayer !== undefined && newplayer.AverageItemPower
							? newplayer.AverageItemPower
							: 0,
				};
			}
			let newplayer = deathEvents[player2.id];
			return {
				...player2,
				weapon:
					newplayer !== undefined
						? newplayer.Equipment.MainHand !== null
							? newplayer.Equipment.MainHand.Type
							: ''
						: '',
				role:
					newplayer !== undefined
						? newplayer.Equipment.MainHand !== null
							? getRole(newplayer.Equipment.MainHand.Type)
							: ''
						: '',
				averageIp:
					newplayer !== undefined && newplayer.AverageItemPower
						? newplayer.AverageItemPower
						: 0,
			};
		});

		const teste = mergeWithItems.map((player) => {
			return {
				...player,
				averageIp: player.averageIp == null ? 0 : player.averageIp,
			};
		});

		console.log(teste);

		const {
			winnerGuilds,
			winnerAllys,
			loserAllys,
			loserGuilds,
			loserTotalDeaths,
			loserTotalFame,
			loserTotalKills,
			playersLosers,
			playersWinners,
			winnerTotalDeaths,
			winnerTotalFame,
			winnerTotalKIlls,
		} = resultHandler(killboard, mergeWithItems);

		return {
			battleId: killboard.id,
			totalKills: killboard.totalKills,
			totalFame: killboard.totalFame,
			players: playersArray,
			startTime: killboard.startTime,
			endTime: killboard.endTime,
			totalPlayers: _.map(killboard.players, (players) => players).length,
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
