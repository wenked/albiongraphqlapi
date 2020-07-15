import { RESTDataSource } from 'apollo-datasource-rest';
import _ from 'lodash';

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
	GuildName: 'History of insanity';
	Id: string;
	KillFame: number;
	Name: string;
	SupportHealingDone: number;
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

export class AlbionApiDataSource extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = 'https://gameinfo.albiononline.com/api/gameinfo/';
	}

	async getBattles(guildname: string) {
		const data = await this.get(`search?q=${guildname}`);
		console.log(data.guilds[0].Id);
		const battles = await this.get(
			`events?limit=51&offset=0&guildId=${data.guilds[0].Id}`
		);
		console.log(
			battles.map((battle: Battle) => {
				return {
					BattleId: battle.BattleId,
				};
			})
		);
		return battles.map((battle: Battle) => {
			return {
				BattleId: battle.BattleId,
			};
		});
	}

	async getBattleById(id: number) {
		let teste = 0;
		let offset = 0;
		let events: Battle[] = [];
		const killboard = await this.get(
			`https://gameinfo.albiononline.com/api/gameinfo/battles/${id}`
		);
		let data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);

		for (offset = 0; data.length > 0; offset += 50) {
			data = await this.get(`events/battle/${id}?offset=${offset}&limit=51`);
			events.push(data);
		}

		console.log(events.flat().length);
		let battleFlat = events.flat();
		let totalFame = battleFlat.reduce((accum, curr): number => {
			return accum + curr.TotalVictimKillFame;
		}, 0);
		let groupGuilds = _.groupBy(battleFlat, (event) => event.Killer.GuildName);
		//console.log(groupGuilds);
		//const data = await this.get(`events/battle/${id}?offset=0&limit=51`);
		let guildsString = Object.keys(groupGuilds);
		let guilds = _.map(groupGuilds, (guild) => {
			return {
				id: guild[0].Killer.GuildId,
				guildName: guild[0].Killer.GuildName,
				alliance: guild[0].Killer.AllianceName,
				allianceId: guild[0].Killer.AllianceId,
				totalKills: guild.length,
				killFame: guild.reduce((acc, curr): number => {
					return acc + curr.TotalVictimKillFame;
				}, 0),
			};
		});

		console.log(guilds);
		return {
			battleId: battleFlat[0].BattleId,
			totalKills: battleFlat.length,
			totalFame: totalFame,
			guilds: guildsString,
		};
	}
}

// https://gameinfo.albiononline.com/api/gameinfo/events/battle/100273044?offset=450&limit=51

//https://gameinfo.albiononline.com/api/gameinfo/events/battle/100273044?offset=0&limit=51

//https://gameinfo.albiononline.com/api/gameinfo/search?q=elevate
