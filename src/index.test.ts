import { isEqual } from 'lodash';
import Country from './classes/country';
import MapGrid from './classes/map';

const countries = [
    new Country('France', { xl: 1, yl: 4, xh: 4, yh: 6 }),
    new Country('Spain', { xl: 3, yl: 1, xh: 6, yh: 3 }),
    new Country('Portugal', { xl: 1, yl: 1, xh: 2, yh: 2 }),
];

test('Result map should have all keys', () => {
    const diffusionResult = new MapGrid(countries).startDiffusionEmulation();
    expect(isEqual(
        Array.from(diffusionResult.keys()).sort(),
        ['France', 'Spain', 'Portugal'].sort(),
    ))
    .toBe(true);
});

test('Result should have correct values', () => {
    const diffusionResult = new MapGrid(countries).startDiffusionEmulation();
    expect(diffusionResult.get('Spain')).toBe(382);
    expect(diffusionResult.get('Portugal')).toBe(416);
    expect(diffusionResult.get('France')).toBe(1325);
});
