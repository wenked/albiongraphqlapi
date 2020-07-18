"use strict";
exports.__esModule = true;
var apollo_server_express_1 = require("apollo-server-express");
var typeDefs_1 = require("./models/typeDefs");
//import { resolvers } from './models/resolvers';
var express_1 = require("express");
var albionDataSource_1 = require("./albionDataSource");
var dotenv_1 = require("dotenv");
var app = express_1["default"]();
dotenv_1["default"].config();
var resolvers = {
    Query: {
        battleList: function (obj, args, _a, info) {
            var dataSources = _a.dataSources;
            return dataSources.albionApi.getBattles(args.guildName);
        },
        battleById: function (obj, args, _a, info) {
            var dataSources = _a.dataSources;
            return dataSources.albionApi.getBattleById(args.id);
        }
    }
};
var server = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers,
    engine: {
        reportSchema: true
    },
    dataSources: function () {
        return { albionApi: new albionDataSource_1.AlbionApiDataSource() };
    }
});
server.applyMiddleware({ app: app });
app.listen({ port: process.env.PORT || 4000 }, function () {
    return console.log("server ready at http://localhost:4000" + server.graphqlPath);
});
