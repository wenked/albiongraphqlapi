import { formatedPlayer, BattleListStyle, playerInfoWithWeapon } from './types';
import { getRole } from './zergUtils';
import _ from 'lodash';

const playersHandler = (
	killboard: BattleListStyle,
	killersAndAssistsEvents: any,
	deathEvents: any,
	playersInfo: playerInfoWithWeapon[]
): formatedPlayer[] => {
	const playersKb = _.map(killboard.players, (players) => players);
	const playersArray: formatedPlayer[] = playersInfo
		.map((player) => {
			if (player !== undefined && killboard.players[player?.id] !== undefined) {
				let objplayer = killboard.players[player?.id];

				return {
					...objplayer,
					weapon: player?.weapon,
					role: player?.role,
				};
			}

			return {};
		})
		.map((player) => {
			if (player.killFame > 0) {
				let newplayer = killersAndAssistsEvents[player.id];

				return {
					...player,
					averageIp: newplayer?.AverageItemPower,
				};
			} else {
				let newplayer = deathEvents[player.id];
				return {
					...player,
					averageIp: newplayer?.AverageItemPower,
				};
			}
		});

	const mergePlayers = _.map(playersKb, (player) => {
		let player2 = _.find(playersArray, { id: player.id });
		if (player2 !== undefined) {
			return player2;
		}

		return {
			...player,
			role: '',
			weapon: '',
			averageIp: 0,
		};
	});

	const mergeWithItems = mergePlayers.map((player2) => {
		if (player2.role !== '') {
			return player2;
		}
		if (player2.killFame > 0) {
			let newplayer = killersAndAssistsEvents[player2.id];

			return {
				...player2,
				weapon:
					newplayer !== undefined
						? newplayer.Equipment.MainHand !== null
							? newplayer.Equipment.MainHand.Type
							: ''
						: '',

				role:
					newplayer !== undefined
						? newplayer.Equipment.MainHand !== null
							? getRole(newplayer.Equipment.MainHand.Type)
							: ''
						: '',

				averageIp:
					newplayer !== undefined && newplayer.AverageItemPower
						? newplayer.AverageItemPower
						: 0,
			};
		}
		let newplayer = deathEvents[player2.id];
		return {
			...player2,
			weapon:
				newplayer !== undefined
					? newplayer.Equipment.MainHand !== null
						? newplayer.Equipment.MainHand.Type
						: ''
					: '',
			role:
				newplayer !== undefined
					? newplayer.Equipment.MainHand !== null
						? getRole(newplayer.Equipment.MainHand.Type)
						: ''
					: '',
			averageIp:
				newplayer !== undefined && newplayer.AverageItemPower
					? newplayer.AverageItemPower
					: 0,
		};
	});

	const formatedPlayers: formatedPlayer[] = mergeWithItems.map((player) => {
		return {
			...player,
			averageIp: player.averageIp == null ? 0 : player.averageIp,
		};
	});

	return formatedPlayers;
};

export default playersHandler;
