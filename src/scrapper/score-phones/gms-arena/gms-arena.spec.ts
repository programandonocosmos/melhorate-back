import { getGMSScores } from ".";
describe("GMS Arena scrapper", () => {
  it("gets data from gmsarena", async () => {
    const response = await getGMSScores();
    console.log("the response: ", response);
  });
});
