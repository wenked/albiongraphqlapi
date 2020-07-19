import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Player {
		name: String
		kills: Int
		deaths: Int
		guildName: String
		guildId: String
		allianceName: String
		allianceId: String
		id: String
		weapon: String
		role: String
		killFame: Int
		averageIp: Float
	}

	type Ally {
		name: String
		kills: Int
		killFame: Int
		id: String
		deaths: Int
	}

	type Guild {
		alliance: String
		allianceId: String
		deaths: Int
		id: String
		killFame: Int
		kills: Int
		name: String
		totalPlayers: Int
	}

	type GuildWithComp {
		alliance: String
		allianceId: String
		deaths: Int
		id: String
		killFame: Int
		kills: Int
		name: String
		totalPlayers: Int
		tankCount: Int
		healerCount: Int
		rangedDpsCount: Int
		supportCount: Int
		meleeCount: Int
	}

	type Stats {
		alliances: [Ally]
		guilds: [Guild]
		totalFame: Int
		players: [Player]
		kills: Int
		deaths: Int
		totalPlayers: Int
	}

	type Battle {
		battleId: Int
		totalKills: Int
		guilds: [GuildWithComp]
		totalFame: Int
		players: [Player]
		startTime: String
		endTime: String
		winners: Stats
		losers: Stats
		totalPlayers: Int
	}

	type Battle2 {
		alliances: [Ally]
		endTime: Int
		guilds: [Guild]
		startTime: String
		totalFame: Int
		totalKills: Int
		totalPlayers: Int
		id: Int
		battle_TIMEOUT: Int
	}

	type Query {
		battleList(guildName: String!): [Battle2]
		battleById(id: Int): Battle
	}
`;

/* 
type Guild {
		Id: String!
		AllianceId: String!
		AllianceName: String!
		Name: String!
	}

	type MainHand {
		Type: String
	}

	type Equipment {
		MainHand: MainHand
	}

	type Player {
		AllianceId: String!
		AllianceName: String!
		AllianceTag: String!
		AverageItemPower: Int
		DamageDone: Int
		DeathFame: Int
		Equipment: Equipment
		FameRatio: Int
		GuildId: String!
		GuildName: String
		Id: String!
		KillFame: Int
		Name: String!
		Inventory: [Equipment]
		SupportHealingDone: Int
		Avatar: String!
		AvatarRing: String!
		LifetimeStatistics:
	}

	type Battle {
		BattleId: Int!
		EventId: Int!
		GroupMembers: [Player!]!
		Killer: Player!
		Participants: [Player!]!
		TimeStamp: String!
		TotalVictimKillFame: Int
		Victim: Player!
		groupMemberCount: Int
		numberOfParticipants: Int
	}



*/

/*

AllianceId: "83XcNbDnTe6lXelFlUq1lw"
AllianceName: ""
DeathFame: 10766416965
Id: "an2NhYvESmuhzsm8iMr_5g"
KillFame: null
Name: "Elevate"


BattleId: 100256675
EventId: 100256675
GroupMembers: [{AverageItemPower: 0,…}]
0: {AverageItemPower: 0,…}
GvGMatch: null
KillArea: "OPEN_WORLD"
Killer: {AverageItemPower: 1173.67834,…}
Location: null
Participants: [{AverageItemPower: 1173.67834,…}]
0: {AverageItemPower: 1173.67834,…}
TimeStamp: "2020-07-14T19:47:10.745831300Z"
TotalVictimKillFame: 64870
Type: "KILL"
Version: 4
Victim: {AverageItemPower: 1124.18,…}
groupMemberCount: 1
numberOfParticipants: 1
1: {groupMemberCount: 1, numberOfParticipants: 1, EventId: 100256669,…}
BattleId: 100256669
EventId: 100256669
GroupMembers: [{AverageItemPower: 0,…}]
GvGMatch: null
KillArea: "OPEN_WORLD"
Killer: {AverageItemPower: 1127.09509,…}
Location: null
Participants: [{AverageItemPower: 1127.09509,…}]
TimeStamp: "2020-07-14T19:47:10.215400400Z"
TotalVictimKillFame: 466895
Type: "KILL"
Version: 4
Victim: {AverageItemPower: 1231.77332,…}
groupMemberCount: 1
numberOfParticipants: 1

*/
