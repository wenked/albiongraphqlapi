import { ApolloServer, IResolverObject } from 'apollo-server-express';
import { typeDefs } from './models/typeDefs';
//import { resolvers } from './models/resolvers';
import express from 'express';
import { AlbionApiDataSource } from './albionDataSource';

const app = express();

const resolvers: IResolverObject = {
	Query: {
		battleList: (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattles(args.guildName);
		},
		battleById: (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattleById(args.id);
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers: resolvers as any,
	dataSources: () => {
		return { albionApi: new AlbionApiDataSource() };
	},
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
	console.log(`server ready at http://localhost:4000${server.graphqlPath}`)
);
