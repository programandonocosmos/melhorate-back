import axios from 'axios';
import { Phone } from './phone';
import { Logger } from '@nestjs/common';

const logger = new Logger('findPhones');

const findPhones = () => {
  const brands = ['Xiaomi', 'Samsung', 'Motorola', 'Apple'];
  const sources = [
    {
      name: 'Mercado Livre',
      url: 'https://www.mercadolivre.com.br',
    },
    {
      name: 'Amazon',
      url: 'https://www.amazon.com.br',
    },
    {
      name: 'Magazine Luiza',
      url: 'https://www.magazineluiza.com.br',
    },
  ];
};

const amazonSearch = async (term: string): Promise<Phone[]> => {
  logger.log('Searching for new phones on amazon...');
  let phones: Phone[] = [];

  let currentPage = 1;
  let searching = true;
  while (searching) {
    logger.log(`Analyzing page number ${currentPage}`);
    let result: string[];
    try {
      result = (
        await axios.get(
          `https://www.amazon.com.br/s/query?k=smartphone ${term}&page=${currentPage}`,
          {
            headers: { 'content-type': 'application/json' },
          },
        )
      ).data.split('&&&');
    } catch {
      logger.log(
        `Page not found (https://www.amazon.com.br/s/query?k=smartphone ${term}&page=${currentPage})`,
      );
    }

    if (result && !result.includes(`Nenhum resultado para ${term}.`)) {
      let newPhones: Promise<Phone>[] = [];

      logger.log('Looping through all results of the current page');
      result.forEach(async (element, index) => {
        try {
          let parsedObj = JSON.parse(element.replace(/\n/g, ''))[2].html;

          let intialPosUrl =
            parsedObj.indexOf('a-link-normal s-no-outline" href="') + 34;
          let finalPosUrl = parsedObj.indexOf('"', intialPosUrl + 1);

          let initialPosName = parsedObj.indexOf('class="s-image"\nalt="') + 21;
          if (initialPosName === 20) initialPosName = 0;
          let finalPosName = parsedObj.indexOf(
            '"\nsrcset="https://m.media-amazon.com/ima',
            initialPosName,
          );
          if (finalPosName === -1) finalPosName = 0;

          let initialPosImage =
            parsedObj.indexOf(
              '>\n<div class="a-section aok-relative s-image-square-aspect">\n\n\n\n<img src="',
            ) + 74;
          if (initialPosImage === 73) initialPosImage = 0;
          let finalPosImage = parsedObj.indexOf('class="s-image"\nalt="') - 2;
          if (finalPosImage === -3) finalPosImage = 0;

          if (
            initialPosName &&
            finalPosName &&
            initialPosImage &&
            finalPosImage
          ) {
            const name: string = parsedObj.slice(initialPosName, finalPosName);
            const url: string = parsedObj.slice(intialPosUrl, finalPosUrl);
            const picture: string = parsedObj.slice(
              initialPosImage,
              finalPosImage,
            );

            const phone: Promise<Phone> = amazonGetPostInfo(url)
              .then(({ ram, rom }) => ({
                brand: term,
                model: name,
                url,
                ram,
                rom,
                picture,
              }))
              .catch((err) => err);

            newPhones = [...newPhones, phone];
          }
        } catch {}
      });

      let newResolvedPhones = await Promise.all(newPhones);
      newResolvedPhones = newResolvedPhones.filter(
        (x) => !(x instanceof Error),
      );

      if (newResolvedPhones.length === 0) {
        logger.log('Not getting new phones, stopping scrap');
        searching = false;
      } else {
        console.log(newResolvedPhones[0]);
        phones = [...phones, ...newResolvedPhones];

        currentPage++;
      }
    } else {
      logger.log(
        `Page not found (https://www.amazon.com.br/s/query?k=smartphone ${term}&page=${currentPage})`,
      );
      searching = false;
    }
  }

  logger.log(phones.length);
  console.log(phones);

  return phones;
};

const amazonGetPostInfo = async (
  url: string,
): Promise<{ ram: number; rom: number }> => {
  const page = (
    await axios.get(`https://www.amazon.com.br/${url}`, {
      headers: {
        authority: 'www.amazon.com.br',
        rtt: '50',
        downlink: '10',
        ect: '4g',
        'upgrade-insecure-requests': '1',
        'user-agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'service-worker-navigation-preload': 'true',
        'sec-fetch-site': 'none',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        cookie:
          'session-id=147-6426764-5560312; i18n-prefs=BRL; ubid-acbbr=132-9544237-6919931; session-token=5okO7K+SyjXOQLmk1p1Oc4Y9TkOJCLnqgMxnfQP2Bs/ijOA1z5o7kUbYAS/u2Df6fe82SqZvFtPSAu2X2XOQXwDaOGBGRGy5Wbra2ZuZbwQ9jJKuXXxZPvSWSMJgdONFhuiyYvZ/eduXPuhcfWr+Pdk8Ljxdh0ZoukM4Gu5FRK5IAVBeHH6EXw1/G1KfAIJk; session-id-time=2082758401l; csm-hit=tb:ZMX6XQD9728E5XJ0R0M0+s-HEZ8Z9MTFCY1HCR9NCWA|1614557014051&t:1614557014051&adb:adblk_yes',
      },
    })
  ).data;

  const initialPosRomOption1 =
    page.indexOf(
      'prodDetAttrValue">',
      page.indexOf(
        '<th class="a-color-secondary a-size-base prodDetSectionEntry">\nCapacidade de armazenamento digital\n</th>',
      ),
    ) + 18;
  const finalPosRomOption1 = page.indexOf('</td>', initialPosRomOption1);
  let romOption1 = parseInt(
    page
      .slice(initialPosRomOption1, finalPosRomOption1)
      .toLowerCase()
      .replace('gb', '')
      .trim(),
  );
  if (isNaN(romOption1)) romOption1 = 0;

  const initialPosRomOption2 =
    page.indexOf(
      'prodDetAttrValue">',
      page.indexOf(
        '<th class="a-color-secondary a-size-base prodDetSectionEntry">\nCapacidade de armazenamento da memória\n</th>',
      ),
    ) + 18;
  const finalPosRomOption2 = page.indexOf('</td>', initialPosRomOption2);
  let romOption2 = parseInt(
    page
      .slice(initialPosRomOption2, finalPosRomOption2)
      .toLowerCase()
      .replace('gb', '')
      .trim(),
  );
  if (isNaN(romOption2)) romOption2 = 0;

  const initialPosRomOption3 =
    page.indexOf(
      'prodDetAttrValue">',
      page.indexOf(
        '<th class="a-color-secondary a-size-base prodDetSectionEntry">\nTamanho da memória externa\n</th>',
      ),
    ) + 18;
  const finalPosRomOption3 = page.indexOf('</td>', initialPosRomOption3);
  let romOption3 = parseInt(
    page
      .slice(initialPosRomOption3, finalPosRomOption3)
      .toLowerCase()
      .replace('gb', '')
      .trim(),
  );
  if (isNaN(romOption3)) romOption3 = 0;

  let rom;
  if (!romOption1 && !romOption2 && !romOption3) {
    rom = NaN;
  } else {
    rom = Math.max(romOption1, romOption2, romOption3);
  }

  const initialPosRamOption1 =
    page.indexOf(
      'prodDetAttrValue">',
      page.indexOf(
        '<th class="a-color-secondary a-size-base prodDetSectionEntry">\nRAM\n</th>',
      ),
    ) + 18;
  const finalPosRamOption1 = page.indexOf('</td>', initialPosRamOption1);
  let ramOption1 = parseInt(
    page
      .slice(initialPosRamOption1, finalPosRamOption1)
      .toLowerCase()
      .replace('gb', '')
      .trim(),
  );

  const initialPosRamOption2 =
    page.indexOf(
      'prodDetAttrValue">',
      page.indexOf(
        '<th class="a-color-secondary a-size-base prodDetSectionEntry">\nTamanho da memória RAM instalada\n</th>',
      ),
    ) + 18;
  const finalPosRamOption2 = page.indexOf('</td>', initialPosRamOption2);
  let ramOption2 = parseInt(
    page
      .slice(initialPosRamOption2, finalPosRamOption2)
      .toLowerCase()
      .replace('gb', '')
      .trim(),
  );

  const ram = isNaN(ramOption1) ? ramOption2 : ramOption1;

  if (isNaN(ram))
    throw new Error(`ram is NaN, going to manual analysis (${url})`);
  if (isNaN(rom))
    throw new Error(`rom is NaN, going to manual analysis (${url})`);

  return { ram, rom };
};

export default findPhones;
export { amazonSearch };
