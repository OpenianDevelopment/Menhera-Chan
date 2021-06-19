import { Player, Structure } from "erela.js";
export const filterPlugin = () => {
	Structure.extend(
		"Player",
		(Player) =>
			class extends Player {
				isNightcore = false;
				isVapor = false;
				isBass = false;
				isPop = false;
				isSoft = false;
				isTreblebass = false;
				reset() {
					this.isNightcore = false;
					this.isBass = false;
					this.isPop = false;
					this.isVapor = false;
					this.isTreblebass = false;
					this.isSoft = false;
					this.node.send({
						op: "filters",
						guildId: this.guild,
					});
				}

				setNightcore() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						timescale: {
							speed: 1.2999999523162842,
							pitch: 1.2999999523162842,
							rate: 1,
						},
					});
					this.isNightcore = true;
				}

				setVaporWave() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						equalizer: [
							{ band: 1, gain: 0.3 },
							{ band: 0, gain: 0.3 },
						],
						timescale: { pitch: 0.5 },
						tremolo: { depth: 0.3, frequency: 14 },
					});
					this.isVapor = true;
				}

				setBass() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						equalizer: [
							{ band: 0, gain: 0.6 },
							{ band: 1, gain: 0.67 },
							{ band: 2, gain: 0.67 },
							{ band: 3, gain: 0 },
							{ band: 4, gain: -0.5 },
							{ band: 5, gain: 0.15 },
							{ band: 6, gain: -0.45 },
							{ band: 7, gain: 0.23 },
							{ band: 8, gain: 0.35 },
							{ band: 9, gain: 0.45 },
							{ band: 10, gain: 0.55 },
							{ band: 11, gain: 0.6 },
							{ band: 12, gain: 0.55 },
							{ band: 13, gain: 0 },
						],
					});
					this.isBass = true;
				}

				setPop() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						equalizer: [
							{ band: 0, gain: 0.65 },
							{ band: 1, gain: 0.45 },
							{ band: 2, gain: -0.45 },
							{ band: 3, gain: -0.65 },
							{ band: 4, gain: -0.35 },
							{ band: 5, gain: 0.45 },
							{ band: 6, gain: 0.55 },
							{ band: 7, gain: 0.6 },
							{ band: 8, gain: 0.6 },
							{ band: 9, gain: 0.6 },
							{ band: 10, gain: 0 },
							{ band: 11, gain: 0 },
							{ band: 12, gain: 0 },
							{ band: 13, gain: 0 },
						],
					});
					this.isPop = true;
				}

				setSoft() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						equalizer: [
							{ band: 0, gain: 0 },
							{ band: 1, gain: 0 },
							{ band: 2, gain: 0 },
							{ band: 3, gain: 0 },
							{ band: 4, gain: 0 },
							{ band: 5, gain: 0 },
							{ band: 6, gain: 0 },
							{ band: 7, gain: 0 },
							{ band: 8, gain: -0.25 },
							{ band: 9, gain: -0.25 },
							{ band: 10, gain: -0.25 },
							{ band: 11, gain: -0.25 },
							{ band: 12, gain: -0.25 },
							{ band: 13, gain: -0.25 },
						],
					});
					this.isSoft = true;
				}

				setTreblebass() {
					this.node.send({
						op: "filters",
						guildId: this.guild,
						equalizer: [
							{ band: 0, gain: 0.6 },
							{ band: 1, gain: 0.67 },
							{ band: 2, gain: 0.67 },
							{ band: 3, gain: 0 },
							{ band: 4, gain: -0.5 },
							{ band: 5, gain: 0.15 },
							{ band: 6, gain: -0.45 },
							{ band: 7, gain: 0.23 },
							{ band: 8, gain: 0.35 },
							{ band: 9, gain: 0.45 },
							{ band: 10, gain: 0.55 },
							{ band: 11, gain: 0.6 },
							{ band: 12, gain: 0.55 },
							{ band: 13, gain: 0 },
						],
					});
					this.isTreblebass = true;
				}
			}
	);
};
