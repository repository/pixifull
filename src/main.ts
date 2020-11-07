import cheerio from "cheerio";
import dotenv from "dotenv";
import Eris from "eris";
import fetch, { Headers, Response } from "node-fetch";

import { Metadata } from "./Metadata";

dotenv.config();

const PIXIV_REGEX = /https?:\/\/(?:www\.|)pixiv\.net\/(?:en\/|)artworks\/(\d+)/g;
const IMAGE_HEADERS = new Headers({
  Referer: "http://www.pixiv.net/",
});

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
        if (resp.status != 200 && !resp.ok) return res(null);

        const $ = cheerio.load(await resp.text());

        const meta: Metadata = JSON.parse(
          $("#meta-preload-data").prop("content")
        );

        res(meta.illust[Object.keys(meta.illust)[0]].urls.original);
      })
    );
  }

  const urls = (await Promise.all(pUrls)).filter(Boolean);
  const pImgs: Promise<Buffer | null>[] = [];
  for (const url of urls) {
    pImgs.push(
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (res) => {
        if (!url) return res(null);

        const head = await fetch(url, {
          method: "HEAD",
          headers: IMAGE_HEADERS,
        });
        if (head.status != 200) return res(null);
        if (parseInt(head.headers.get("content-length") ?? "0") > 8388608)
          return res(null);

        const rImg = await fetch(url, { headers: IMAGE_HEADERS });
        if (rImg.status != 200 && !rImg.ok) return res(null);

        res(await rImg.buffer());
      })
    );
  }
});

bot.connect();
