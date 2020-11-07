import cheerio from "cheerio";
import dotenv from "dotenv";
import Eris from "eris";
import fetch from "node-fetch";

dotenv.config();

const PIXIV_REGEX = /https?:\/\/(?:www\.|)pixiv\.net\/(?:en\/|)artworks\/(\d+)/g;

const token = process.env["TOKEN"];
if (!token) throw "Token not specified";

const bot = Eris(token);

bot.on("ready", () => {
  console.log("connected to gateway");
});

bot.on("messageCreate", async (m) => {
  if (m.author.bot) return;

  let match = PIXIV_REGEX.exec(m.content);
  if (!match) return;

  let ids: number[] = [];
  do {
    ids.push(parseInt(match[1]));
  } while ((match = PIXIV_REGEX.exec(m.content)) !== null);

  ids = [...new Set(ids)];

  for (const id of ids) {
    console.log(id);
  }
});

bot.connect();
