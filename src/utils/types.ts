export interface Guild {
	alliance: string;
	allianceId: string;
	deaths: number;
	id: string;
	killFame: number;
	kills: number;
	name: string;
	totalPlayers: number,
}

export interface BattleListStyle {
	alliances: any;
	battle_TIMEOUT: number;
	endTime: string;
	guilds: any;
	id: number;
	players: any;
	startTime: string;
	timeout: string;
	totalFame: number;
	totalKills: number;
}

export interface Alliance {
	deaths: number;
	id: string;
	killFame: number;
	kills: number;
	name: string;
}

export interface Player {
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

export interface formatedPlayer {
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

export interface Battle {
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

export interface playerInfoWithWeapon {
	name: string;
	guild: string;
	weapon: string;
	id: string;
	role: string;
	guildid: string;
}
