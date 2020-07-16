import { RESTDataSource } from 'apollo-datasource-rest';
import objItems from './utils/objItems';
import { getRole } from './utils/zergUtils';
import _ from 'lodash';

const handleguild = (guild: string) => {
	if (guild === '' || null) {
		return 'No Guild';
	}
	return guild;
};

type formated = {
	[key: string]: any;
};

interface Guild {
	alliance: string;
	allianceId: string;
	deaths: number;
	id: string;
	killFame: number;
	kills: number;
	name: string;
}

interface Alliance {
	deaths: number;
	id: string;
	killFame: number;
	kills: number;
	name: string;
}

interface Player {
	AllianceId: string;
	AllianceName: string;
	AllianceTag: string;
	AverageItemPower: number;
	DamageDone: number;
	DeathFame: number;
	Equipment: {
		MainHand: {
			Type: string;
		};
	};
	FameRatio: number;
	GuildId: string;
	GuildName: string;
	Id: string;
	KillFame: number;
	Name: string;
	SupportHealingDone: number;
}

interface formatedPlayer {
	name: string;
	kills: number;
	deaths: number;
	guildName: string;
	guildId: string;
	allianceName: string;
	allianceId: string;
	id: string;
	weapon: string;
	role: string;
	killFame: number;
	averageIp: number;
}

interface Battle {
	BattleId: number;
	EventId: number;
	GroupMembers: Player[];
	Killer: Player;
	Participants: Player[];
	TimeStamp: string;
	TotalVictimKillFame: number;
	Type: string;
	Version: number;
	Victim: Player;
	groupMemberCount: number;
	numberOfParticipants: number;
}

interface playerInfoWithWeapon {
	name: string;
	guild: string;
	weapon: string;
	id: string;
	role: string;
	guildid: string;
}
/*
interface killboard {
	alliances: {
		[key:string]: {
			deaths: number,
id: string,
killFame: number,
kills: number,
name: string,
		}
	}
battle_TIMEOUT: number,
clusterName: null
endTime: string,
guilds: 
id: number,
players: 
startTime: string,
timeout: string,
totalFame: number,
totalKills: number,
}
*/

const organizeKillers = (obj: any, item: any) => {
	if (item !== null) {
		return Object.assign(obj, {
			[item.Id]: item,
		});
	}
	return Object.assign(obj, { nada: 'nada' });
};

const organizeDeaths = (obj: any, item: any) => {
	if (item.Victim !== null) {
		return Object.assign(obj, {
			[item.Victim.Id]: item.Victim,
		});
	}
	return Object.assign(obj, { nada: 'nada' });
};

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

		const battles = await this.get(
			`events?limit=51&offset=0&guildId=${data.guilds[0].Id}`
		);

		return battles.map((battle: Battle) => {
			return {
				BattleId: battle.BattleId,
			};
		});
	}

	async getBattleById(id: number) {
		let offset = 0;
		let events: Battle[] = [];
		const killboard = await this.get(`battles/${id}`);
		let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);

		for (offset = 0; data.length > 0; offset += 50) {
			data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
			events.push(data);
		}

		//console.log(events.flat().length);
		let battleFlat = events.flat();
		let participansFlat = _.uniqBy(
			battleFlat.map((event) => event.Participants).flat(),
			'Id'
		);

		//console.log(participansFlat);
		//let participantsEvents = participansFlat.reduce()
		let killersAndAssistsEvents = participansFlat.reduce(organizeKillers, {});
		//console.log(killersAndAssistsEvents);
		let deathEvents = battleFlat.reduce(organizeDeaths, {});
		//	console.log(deathEvents);
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

		let playersInfo = Array.from(
			new Set(noFilterPlayersInfo.map((a) => a.name))
		).map((name) => {
			return noFilterPlayersInfo.find((a) => a.name === name);
		});

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
					//console.log(newplayer);

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

		const handlerResult = () => {
			const arrAlly: Alliance[] = _.map(
				killboard.alliances,
				(alliance) => alliance
			).sort(sortTopFame);

			const arrGuild: Guild[] = _.map(killboard.guilds, (guild) => guild).sort(
				sortTopFame
			);
			const winnerAlly = arrAlly[0];

			const winnerGuild = arrGuild[0];

			if (winnerGuild.killFame > winnerAlly.killFame) {
				const winnerGuilds = arrGuild.filter(
					(guild) => guild.name === winnerGuild.name
				);
				const losersGuilds = arrGuild.filter(
					(guild) => guild.name !== winnerGuild.name
				);

				const playersWinners = newPlayersObj.filter(
					(player) => player.guildName === winnerGuild.name
				);

				const playersLosers = newPlayersObj.filter(
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

			const playersWinners = newPlayersObj.filter(
				(player) => player.allianceName === winnerAlly.name
			);
			const playersLosers = newPlayersObj.filter(
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
			totalPlayers: newPlayersObj.length,
			winners: {
				alliances: handlerResult().winnerAllys,
				guilds: handlerResult().winnerGuilds,
				totalFame: handlerResult().winnerTotalFame,
				players: handlerResult().playersWinners,
				kills: handlerResult().winnerTotalKIlls,
				deaths: handlerResult().winnerTotalDeaths,
				totalPlayers: handlerResult().playersWinners.length,
			},
			losers: {
				alliances: handlerResult().loserAllys,
				guilds: handlerResult().loserGuilds,
				totalFame: handlerResult().loserTotalFame,
				players: handlerResult().playersLosers,
				kills: handlerResult().loserTotalKills,
				deaths: handlerResult().loserTotalDeaths,
				totalPlayers: handlerResult().playersLosers.length,
			},
		};
	}
}

/*
startTime: "2020-07-15T00:02:58.520408400Z"
endTime: "2020-07-15T00:03:58.639706800Z"
timeout: "2020-07-15T00:06:58.639706800Z"
totalFame: 65081
totalKills: 5

*/

// https://gameinfo.albiononline.com/api/gameinfo/events/battle/100273044?offset=450&limit=51

//https://gameinfo.albiononline.com/api/gameinfo/events/battle/100273044?offset=0&limit=51

//https://gameinfo.albiononline.com/api/gameinfo/search?q=elevate
