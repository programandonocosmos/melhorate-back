const axios = require("axios");

import type Cheerio from "cheerio";
const cheerio = require("cheerio") as typeof Cheerio;

const encoding = "lowercase-";

const searchUrl = `https://www.kimovil.com/pt/comparar-celulares/`;
const XHRSearchUrl =
  "https://www.kimovil.com/pt/comparar-celulares/name.xiaomi,page.1?xhr=1";

export const searchInKimovil = async (
  term: string,
  page: number
): Promise<{ score?: string; deviceName?: string }> => {
  const rawResult = await axios.get(`${searchUrl}name.${term}`);
  const result: string = rawResult.data;
  const phoneLinkRegex = new RegExp(
    'href="https://www.kimovil.com/pt/onde-comprar-.+([a-z])+#'
  );
  const multiDeviceNamesRegex = new RegExp('data-device="(w+-)+w+"');

  const regexResults = result.match(phoneLinkRegex);
  const deviceLink = regexResults[0].replace('href="', "");
  const multiDeviceNames = result.match(multiDeviceNamesRegex);
  const uniqueDeviceNames = [...new Set(multiDeviceNames)];
  console.log(uniqueDeviceNames);
  let $ = cheerio.load(result);
  // const deviceElement = $('.open-newtab');
  // const deviceName = deviceElement.text();
  // const grandFatherElement = deviceElement
  //   .parent()
  //   .parent()
  //   .parent()
  //   .children()
  //   .children();
  // console.log(grandFatherElement.html());
  // const linkToPhone = $('.device-link').attr('href');
  const deviceName = deviceLink.replace(
    "https://www.kimovil.com/pt/onde-comprar-",
    ""
  );
  console.log("link to phone: ", deviceLink, "device name: ", deviceName);

  if (!deviceLink) return {};
  let rawPhonePage;
  try {
    rawPhonePage = await axios.get(deviceLink);
  } catch (error) {
    console.log(error);
    return;
  }

  const phonePage = rawPhonePage.data;
  $ = cheerio.load(phonePage);
  const rawAntutuScore = $("tbody > tr > td > a  >div").text();
  const scoreRegex = /\d+.\d\d\d+/gm;
  console.log(rawAntutuScore);
  const [phoneScore] = rawAntutuScore.match(scoreRegex);
  return { score: phoneScore, deviceName };
};
