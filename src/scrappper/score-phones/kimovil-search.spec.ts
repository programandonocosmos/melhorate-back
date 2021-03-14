import { searchInKimovil } from './kimovil';

describe('searchInKimovil', () => {
  it('should the antutu score of MI A3', async () => {
    const score = searchInKimovil('MI A3', 1);
    expect(score).toBeTruthy();
  });
});
