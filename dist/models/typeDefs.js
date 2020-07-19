"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql `
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
//# sourceMappingURL=typeDefs.js.map