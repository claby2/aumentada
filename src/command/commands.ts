import * as Discord from "discord.js";
import { Command } from "./types";
import * as os from "os";

function msToTime(duration: number): string {
    let seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor(duration / (1000 * 60 * 60));
    return (
        hours.toString() +
        "h" +
        (minutes < 10 ? "0" + minutes : minutes.toString()) +
        "m" +
        (seconds < 10 ? "0" + seconds : seconds.toString()) +
        "s"
    );
}

const botDescription = `\
Ten oh' four has the Machine come to be,
Its existence making all Happy,
with Sloth ground under the Gears,
with the elimination of all Fears,
with Power exemplified in the Rotors,
with Purpose found in the Motors.
The utility of the Machine, hallowed be Its calculation,
The kingdom come, The will be done, 
in Earth as it is in the Machine.
\u200b`;

export const commands: Command[] = [
    {
        // TODO make this only enabled via Hexular
        name: "exec",
        desc: "Executes JS code",
        args: [
            {
                type: "STRING",
                name: "code",
                desc: "code",
            },
        ],
        func: async (interaction, [code]: [string]) => {
            if (interaction.user.id === "205898019839803392") {
                // We're probably going to need to wait a bit.
                await interaction.defer({ ephemeral: true });
                try {
                    let constructedReply = "";
                    const AsyncFunction = Object.getPrototypeOf(
                        async function () {}
                    ).constructor;
                    let f = new AsyncFunction("it", "log", "send", code);
                    let log = async (s: any) => {
                        constructedReply +=
                            "```" +
                            s.toString().replace(/`/gm, "`\u200b") +
                            "```";
                        await interaction.editReply(constructedReply);
                    };
                    let send = async (s: any) => {
                        await interaction.channel?.send(s.toString());
                    };
                    await f(interaction, log, send).then(() => {
                        return interaction.editReply(
                            constructedReply + "\nExecution terminated."
                        );
                    });
                } catch (e) {
                    await interaction.editReply(
                        "Error! ```" +
                            e.toString().replace(/`/gm, "`\u200b") +
                            "```"
                    );
                }
            } else {
                await interaction.reply("No perms for you! :D");
            }
        },
    },
    {
        name: "think",
        desc: "Makes Aumentada think",
        args: [],
        func: async (interaction: Discord.CommandInteraction) => {
            interaction.defer();
        },
    },
    {
        name: "health",
        desc: "Checks Aumentada's health",
        args: [],
        func: async (interaction: Discord.CommandInteraction) => {
            let latencyMs = Date.now() - interaction.createdTimestamp;
            let wsPingMs = interaction.client.ws.ping;
            let totalMemBytes = os.totalmem();
            let guildCount = interaction.client.guilds.cache.size;
            let uptimeMs = interaction.client.uptime;
            let shard = interaction.client.shard;
            let shards = interaction.client.ws.shards.size;
            let {
                maxRSS: memUsageKB,
                userCPUTime,
                systemCPUTime,
            } = process.resourceUsage();
            let embed = new Discord.MessageEmbed()
                .setColor("#55ddff")
                .setTitle("Aumentada")
                .setDescription(botDescription)
                .addFields(
                    {
                        name: "Latency",
                        value: latencyMs.toString() + "ms",
                        inline: true,
                    },
                    {
                        name: "WebSocket ping",
                        value: wsPingMs.toString() + "ms",
                        inline: true,
                    },
                    {
                        name: "Used memory",
                        value: Math.round(memUsageKB / 1024).toString() + "MB",
                        inline: true,
                    },
                    {
                        name: "Total memory",
                        value:
                            Math.round(
                                totalMemBytes / (1024 * 1024)
                            ).toString() + "MB",
                        inline: true,
                    },
                    {
                        name: "CPU time",
                        value:
                            "User " +
                            userCPUTime +
                            "μs, System " +
                            systemCPUTime +
                            "μs",
                        inline: true,
                    },
                    {
                        name: "Guilds",
                        value: guildCount.toString(),
                        inline: true,
                    },
                    {
                        name: "Uptime",
                        value: uptimeMs ? msToTime(uptimeMs) : "lmao idk",
                        inline: true,
                    },
                    {
                        name: "Shard",
                        value: shard?.toString() ?? "0",
                        inline: true,
                    },
                    { name: "Shards", value: shards.toString(), inline: true }
                )
                .setTimestamp();
            const avatarURL = interaction.client.user?.avatarURL();
            if (avatarURL) {
                embed = embed.setThumbnail(avatarURL);
            }
            interaction.reply({
                content: " ",
                embeds: [embed],
            });
        },
    },
];
