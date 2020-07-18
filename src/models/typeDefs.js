"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.typeDefs = void 0;
var apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = apollo_server_express_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\ttype Player {\n\t\tname: String\n\t\tkills: Int\n\t\tdeaths: Int\n\t\tguildName: String\n\t\tguildId: String\n\t\tallianceName: String\n\t\tallianceId: String\n\t\tid: String\n\t\tweapon: String\n\t\trole: String\n\t\tkillFame: Int\n\t\taverageIp: Float\n\t}\n\n\ttype Ally {\n\t\tname: String\n\t\tkills: Int\n\t\tkillFame: Int\n\t\tid: String\n\t\tdeaths: Int\n\t}\n\n\ttype Guild {\n\t\talliance: String\n\t\tallianceId: String\n\t\tdeaths: Int\n\t\tid: String\n\t\tkillFame: Int\n\t\tkills: Int\n\t\tname: String\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Stats {\n\t\talliances: [Ally]\n\t\tguilds: [Guild]\n\t\ttotalFame: Int\n\t\tplayers: [Player]\n\t\tkills: Int\n\t\tdeaths: Int\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Battle {\n\t\tbattleId: Int\n\t\ttotalKills: Int\n\t\ttotalFame: Int\n\t\tplayers: [Player]\n\t\tstartTime: String\n\t\tendTime: String\n\t\twinners: Stats\n\t\tlosers: Stats\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Battle2 {\n\t\talliances: [Ally]\n\t\tendTime: Int\n\t\tguilds: [Guild]\n\t\tstartTime: String\n\t\ttotalFame: Int\n\t\ttotalKills: Int\n\t\ttotalPlayers: Int\n\t\tid: Int\n\t\tbattle_TIMEOUT: Int\n\t}\n\n\ttype Query {\n\t\tbattleList(guildName: String!): [Battle2]\n\t\tbattleById(id: Int): Battle\n\t}\n"], ["\n\ttype Player {\n\t\tname: String\n\t\tkills: Int\n\t\tdeaths: Int\n\t\tguildName: String\n\t\tguildId: String\n\t\tallianceName: String\n\t\tallianceId: String\n\t\tid: String\n\t\tweapon: String\n\t\trole: String\n\t\tkillFame: Int\n\t\taverageIp: Float\n\t}\n\n\ttype Ally {\n\t\tname: String\n\t\tkills: Int\n\t\tkillFame: Int\n\t\tid: String\n\t\tdeaths: Int\n\t}\n\n\ttype Guild {\n\t\talliance: String\n\t\tallianceId: String\n\t\tdeaths: Int\n\t\tid: String\n\t\tkillFame: Int\n\t\tkills: Int\n\t\tname: String\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Stats {\n\t\talliances: [Ally]\n\t\tguilds: [Guild]\n\t\ttotalFame: Int\n\t\tplayers: [Player]\n\t\tkills: Int\n\t\tdeaths: Int\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Battle {\n\t\tbattleId: Int\n\t\ttotalKills: Int\n\t\ttotalFame: Int\n\t\tplayers: [Player]\n\t\tstartTime: String\n\t\tendTime: String\n\t\twinners: Stats\n\t\tlosers: Stats\n\t\ttotalPlayers: Int\n\t}\n\n\ttype Battle2 {\n\t\talliances: [Ally]\n\t\tendTime: Int\n\t\tguilds: [Guild]\n\t\tstartTime: String\n\t\ttotalFame: Int\n\t\ttotalKills: Int\n\t\ttotalPlayers: Int\n\t\tid: Int\n\t\tbattle_TIMEOUT: Int\n\t}\n\n\ttype Query {\n\t\tbattleList(guildName: String!): [Battle2]\n\t\tbattleById(id: Int): Battle\n\t}\n"])));
var templateObject_1;
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
