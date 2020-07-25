import { ApolloServer, IResolverObject } from 'apollo-server-express';
import { typeDefs } from './models/typeDefs';
//import { resolvers } from './models/resolvers';
import express from 'express';
import { AlbionApiDataSource } from './albionDataSource';
import dotenv from 'dotenv';
import _ from 'lodash';

const app = express();
dotenv.config();
const resolvers: IResolverObject = {
	Query: {
		battleList: async (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattles(args.guildName, args.offSet);
		},
		battleById: async (obj, args, { dataSources, cache }, info) => {
			return dataSources.albionApi.getBattleById(args.id);
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers: resolvers as any,

	engine: {
		reportSchema: true,
	},
	dataSources: () => {
		return { albionApi: new AlbionApiDataSource() };
	},
});

server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () =>
	console.log(`server ready at http://localhost:4000${server.graphqlPath}`)
);
