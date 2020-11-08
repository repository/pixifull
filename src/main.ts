import dotenv from "dotenv";
import Eris from "eris";

import { getWorkData, setWorkFile } from "./pixiv";
import { WorkData } from "./WorkData";

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

  const pWorks: Promise<WorkData | undefined>[] = [];
  for (const id of ids) {
    pWorks.push(
      getWorkData(id)
        .then(setWorkFile)
        .catch(() => undefined)
    );
  }

  const works = (await Promise.all(pWorks)).filter(Boolean);
  if (works.length < 1) return;

  await m.edit({ flags: 4 });
  for (const work of works) {
    bot.createMessage(
      m.channel.id,
      {
        embed: {
          title: work?.title,
          description: work?.description,
          url: work?.url,
          image: {
            url: "attachment://" + work?.file_name,
          },
          author: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            name: work!.author,
            url: work?.author_url,
          },
          footer: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            text: work!.footer,
          },
        },
      },
      {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        file: work!.file,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name: work!.file_name,
      }
    );
  }
});

bot.connect();
