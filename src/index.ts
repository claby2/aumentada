import "dotenv/config";
import * as Discord from "discord.js";
import { registerCmds } from "./command/register";
import { log, error } from "./util";

const client = new Discord.Client({
    intents: [
        "GUILDS",
        // "GUILD_MEMBERS", (Privileged).
        "GUILD_BANS",
        "GUILD_EMOJIS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        // "GUILD_PRESENCES", (Privileged).
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
    ],
});

client.on("ready", async () => {
    log("Logged in as " + client.user?.tag);
    await registerCmds(client).then(() => {
        log("Commands registered");
    });
});

client.on("error", async err => {
    error("Error event: " + err.toString());
});

client.login(process.env.BOT_TOKEN);
