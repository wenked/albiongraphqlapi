import { RESTDataSource } from 'apollo-datasource-rest';
import {
	getRole,
	organizeKillers,
	organizeDeaths,
	handleguild,
} from './utils/zergUtils';
import _ from 'lodash';
import {
	formatedPlayer,
	Battle,
	playerInfoWithWeapon,
	BattleListStyle,
} from './utils/types';
import { resultHandler } from './utils/resultHandler';
import playersHandler from './utils/playersHandler';
import zergCompHandler from './utils/zergCompHandler';

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
			const {
				winnerGuildsStrings,
				loserGuildsStrings,
				winnerAllysStrings,
				loserAllysStrings,
			} = resultHandler(battle);

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
				winnerGuilds: winnerGuildsStrings,
				winnerAllys: winnerAllysStrings,
				losersAllys: loserAllysStrings,
				losersGuilds: loserGuildsStrings,
			};
		});
	}

	async getBattleById(id: number) {
		let offset = 0;
		let events: Battle[] = [];
		const killboard: BattleListStyle = await this.get(`battles/${id}`);
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

		let playersWithItems = battleFlat
			.map((eventkill) =>
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
			)
			.flat();

		let playersInfo = _.uniqBy(playersWithItems, 'id');

		const formatedPlayers = playersHandler(
			killboard,
			killersAndAssistsEvents,
			deathEvents,
			playersInfo
		);

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
		} = resultHandler(killboard, formatedPlayers);

		const guildsWithComp = zergCompHandler(
			winnerGuilds.concat(loserGuilds),
			formatedPlayers
		);

		return {
			battleId: killboard.id,
			totalKills: killboard.totalKills,
			guilds: guildsWithComp,
			totalFame: killboard.totalFame,
			players: formatedPlayers,
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
