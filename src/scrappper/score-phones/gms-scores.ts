import axios from 'axios';
import type Cheerio from 'cheerio';
const cheerio = require('cheerio');
// const cheerio = require('cheerio') as typeof Cheerio;
import fs from 'fs';
export const getGMSScores = async () => {
  const rawData = await axios.get(
    'https://www.gsmarena.com/benchmark-test.php3',
  );
  const htmlData = rawData.data;
  const $ = cheerio.load(htmlData);
  const scoreTable = $('#review-body > table.keywords.persist-area > tbody')
    .find('tr')
    .toArray()
    .map((element, index) => {
      const phoneName = $(element.firstChild).text();

      const [benchA, benchB] = $(element)
        .find('b')
        .toArray()
        .map((element) => $(element).text());

      //   console.log('BENCH A NESSA PORRA ', benchA);
      //   console.log('BENCH B NESSA PORRA ', benchB);

      //   console.log(phoneName);
      return {
        [phoneName]: { benchA, benchB },
      };
    });
  //   console.dir(scoreTable);

  return { score: scoreTable };
};
