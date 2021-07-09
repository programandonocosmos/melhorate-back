import getPhones from "../getPhonesMock";
import axios from "axios";

export const getInfoFromGeekbech = async (
  phoneName: string
): Promise<unknown> => {
  console.log("searching ", phoneName, "...");
  try {
    const benchmarks = await axios.get<{ devices: any[] }>(
      "https://browser.geekbench.com/mobile-benchmarks.json"
    );

    const phonesScores = benchmarks.data.devices.reduce((acc, device) => {
      return { ...acc, [device.name]: device.score };
    }, {});

    if (phonesScores[phoneName]) return phonesScores[phoneName];
  } catch (err) {
    console.log("deu bosta");
  }
};

export const scorePhones = async () => {
  const phones = await getPhones();

  const phonesHashMap = phones.map((phone) => {
    return getInfoFromGeekbech(phone.name);
  });

  const results = await Promise.all(phonesHashMap);
  console.log("phonesHashMap ", results);

  return results;
};
