import { gql } from 'apollo-server-express';

export const typeDefs = gql`
	type Battle1 {
		BattleId: Int
	}

	type Battle2 {
		battleId: Int
		totalKills: Int
		totalFame: Int
		guilds: [String]
	}

	type Query {
		battles(guildname: String!): [Battle1]
		battleById(id: Int!): Battle2
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
