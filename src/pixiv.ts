import cheerio from "cheerio";
import fetch, { Headers, Response } from "node-fetch";

import { Metadata } from "./Metadata";
import { WorkData } from "./WorkData";

const PIXIV_HEADERS = new Headers({
  Referer: "http://www.pixiv.net/",
});

function formatDesc(desc: string) {
  desc = desc.replace(/<br\s*[\\/]?>/gi, "\n");
  desc = desc.replace(/(<([^>]+)>)/gi, "");

  if (desc.length > 277) {
    desc = desc.substr(0, 277) + "...";
  }

  return desc;
}

export async function getWorkData(id: number): Promise<WorkData> {
  const url = "https://www.pixiv.net/artworks/" + id;

  let resp: Response;
  try {
    resp = await fetch(url);
  } catch {
    throw "unable to get metadata";
  }
  if (resp.status != 200 && !resp.ok) throw "unable to get metadata";
  const $ = cheerio.load(await resp.text());

  const meta: Metadata = JSON.parse($("#meta-preload-data").prop("content"));
  const illust = meta.illust[Object.keys(meta.illust)[0]];

  const iUrl = illust.urls.original;

  return {
    id,
    title: illust.title,
    url,
    author: illust.userName,
    author_url: "https://www.pixiv.net/en/users/" + illust.userId,
    description:
      illust.description !== ""
        ? formatDesc(illust.description)
        : illust.extraData.meta.twitter.description,
    file_url: iUrl,
    file_name: iUrl.split("/").pop(),
  } as WorkData;
}

export async function setWorkFile(work: WorkData): Promise<WorkData> {
  const head = await fetch(work.file_url, {
    method: "HEAD",
    headers: PIXIV_HEADERS,
  });
  if (head.status != 200 && !head.ok) throw "unable to get headers";
  if (parseInt(head.headers.get("content-length") ?? "0") > 8388608)
    throw "file too big";

  const rImg = await fetch(work.file_url, { headers: PIXIV_HEADERS });
  if (rImg.status != 200 && !rImg.ok) throw "unable to get image data";

  work.file = await rImg.buffer();
  return work;
}
