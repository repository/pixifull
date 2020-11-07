import cheerio from "cheerio";
import dotenv from "dotenv";
import Eris from "eris";
import fetch, { Response } from "node-fetch";

import { Metadata } from "./Metadata";

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

  const pUrls: Promise<string | null>[] = [];
  for (const id of ids) {
    pUrls.push(
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (res) => {
        let resp: Response;
        try {
          resp = await fetch("https://www.pixiv.net/artworks/" + id);
        } catch {
          return res(null);
        }
        if (resp.status != 200) return res(null);

        const $ = cheerio.load(await resp.text());

        const meta: Metadata = JSON.parse(
          $("#meta-preload-data").prop("content")
        );

        res(meta.illust[Object.keys(meta.illust)[0]].urls.original);
      })
    );
  }

  const urls = (await Promise.all(pUrls)).filter(Boolean);
  for (const url of urls) {
    console.log(url);
  }
});

bot.connect();
