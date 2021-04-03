import axios from "axios";
import cheerio from "cheerio";
// const cheerio = require('cheerio') as typeof Cheerio;

/**
 * Searchs benchmark scores at GMS Arena
 *
 */
export const getGMSScores = async () => {
  const rawData = await axios.get(
    "https://www.gsmarena.com/benchmark-test.php3"
  );
  const htmlData = rawData.data;
  const $ = cheerio.load(htmlData);
  const scoreTable = $("#review-body > table.keywords.persist-area > tbody")
    .find("tr")
    .toArray()
    .map((element) => {
      console.log(element);
      const phoneName = $(element.next).text();

      const [benchA, benchB] = $(element)
        .find("b")
        .toArray()
        .map((element) => $(element).text());
      return {
        [phoneName]: { benchA, benchB },
      };
    });
  return { score: scoreTable };
};
