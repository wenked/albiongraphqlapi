'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const apollo_server_express_1 = require('apollo-server-express');
const typeDefs_1 = require('./models/typeDefs');
const express_1 = __importDefault(require('express'));
const albionDataSource_1 = require('./albionDataSource');
const dotenv_1 = __importDefault(require('dotenv'));
const app = express_1.default();
dotenv_1.default.config();
const resolvers = {
	Query: {
		battleList: (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattles(args.guildName);
		},
		battleById: (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattleById(args.id);
		},
	},
};
const server = new apollo_server_express_1.ApolloServer({
	typeDefs: typeDefs_1.typeDefs,
	resolvers: resolvers,
	engine: {
		reportSchema: true,
	},
	dataSources: () => {
		return { albionApi: new albionDataSource_1.AlbionApiDataSource() };
	},
});
server.applyMiddleware({ app });
app.listen({ port: process.env.PORT || 4000 }, () =>
	console.log(`server ready at http://localhost:4000${server.graphqlPath}`)
);
