import { ApolloServer, IResolverObject } from 'apollo-server-express';
import { typeDefs } from './models/typeDefs';
//import { resolvers } from './models/resolvers';
import express from 'express';
import { AlbionApiDataSource } from './albionDataSource';

const app = express();

type argsResolver = {
	guildname: string;
};

const resolvers: IResolverObject = {
	Query: {
		battles: (obj, args: argsResolver, { dataSources }, info) => {
			return dataSources.albionApi.getGuilds(args.guildname);
		},

		battleById: (obj, args, { dataSources }, info) => {
			return dataSources.albionApi.getBattleById(args.id);
		},

		/*guilds2: async (obj, args: argsResolver, context, info) => {
			const response = await axios.get(
				`https://gameinfo.albiononline.com/api/gameinfo/search?q=${args.guildname}`
			);

			return response.data.guilds;
		},*/
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
