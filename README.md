Graphql wrapper to Albion online official API , this wrapper helps to find battles and zerg compositions of each guild in battles . 


Ex: 

 queryBattleList = `query Battles($guildName: String!,$offSet: Int!){
	battleList(guildName: $guildName, offSet: $offSet){
		endTime
		totalFame
		totalKills
		totalPlayers
		id
		winnerGuilds
		losersGuilds
		winnerAllys
		losersAllys
	}
}`;

 queryBattleDetail = `
query Battle($id: Int!) {
	battleById(id: $id) {
	  battleId
	  totalKills
	  totalFame
	  totalPlayers
	  guilds {
		alliance
		deaths
		totalPlayers
		kills
		name
		guildAverageIp
		killFame
		tanks {
			weapon
			role	
		}
		healers	{
			weapon
			role	
		}
		supports {
			weapon
			role	
		}
		rangedDps{
			weapon
			role	
		}
		melees{
			weapon
			role	
		}

	  }
	  winners {
		players{
			id
			name
			kills
			deaths
			guildName
			allianceName
			weapon
			averageIp
			killFame
		  }
		guilds {
		  alliance
		  deaths
		  totalPlayers
		  kills
		  name
		  guildAverageIp
		  killFame
		  
		}
	  }
	  losers {
		players{
			id
			name
			kills
			deaths
			guildName
			allianceName
			weapon
			averageIp
			killFame
			
		  }
		guilds {
		  alliance
		  deaths
		  totalPlayers
		  kills
		  name
		  guildAverageIp
		  killFame
		  
		}
	  }
	}
  }

`;

https://ablionapigraphql.herokuapp.com/graphql
