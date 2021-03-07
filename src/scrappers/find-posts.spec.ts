import { amazonSearch } from './find-posts';

describe('amazonSearch', () => {
  it('should return an array of xiaomi posts', async () => {
    const phones = await amazonSearch('xiaomi');
    console.log(phones);
    expect(Array.isArray(phones)).toBeTruthy();
    if (Array.isArray(phones)) {
      expect(phones.length).toBeGreaterThan(0);
      if (phones.length > 0)
        expect(phones[0]).toBeCalledWith(
          expect.objectContaining({
            brand: expect.stringContaining(''),
            url: expect.stringContaining(''),
            ram: expect.any(Number),
            rom: expect.any(Number),
            picture: expect.stringContaining(''),
          }),
        );
    }
  });
});
