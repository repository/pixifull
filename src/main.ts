import dotenv from "dotenv";
import Eris from "eris";

dotenv.config();

const PIXIV_REGEX = /https?:\/\/(?:www\.|)pixiv\.net\/(?:en\/|)artworks\/(\d+)/g;

const token = process.env["TOKEN"];
if (!token) throw "Token not specified";

const bot = Eris(token);

bot.on("ready", () => {
  console.log("connected to gateway");
});

bot.on("messageCreate", (m) => {
  if (m.author.bot) return;

  const links = PIXIV_REGEX.exec(m.content);
  if (!links) return;

  console.log(links);
});

bot.connect();
