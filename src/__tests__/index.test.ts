import { isEqual } from 'lodash';
import Country from '../classes/country';
import MapGrid from '../classes/map';

test('Result map should have all keys', () => {
    const diffusionResult = new MapGrid([
        new Country('France', { xl: 1, yl: 4, xh: 4, yh: 6 }),
        new Country('Spain', { xl: 3, yl: 1, xh: 6, yh: 3 }),
        new Country('Portugal', { xl: 1, yl: 1, xh: 2, yh: 2 }),
    ]).startDiffusionEmulation();
    expect(isEqual(
        Array.from(diffusionResult.keys()).sort(),
        ['France', 'Spain', 'Portugal'].sort(),
    ))
    .toBe(true);
});

test('Should throw an error if one country does not have neighbors', () => {
    expect(() => new MapGrid([
        new Country('Test 1', { xl: 1, yl: 1, xh: 1, yh: 1 }),
        new Country('Test 2', { xl: 3, yl: 3, xh: 3, yh: 3 }),
    ])).toThrow();
});

describe('Should work correctly with sample input', () => {
    test('Sample case 1', () => {
        const diffusionResult = new MapGrid([
            new Country('France', { xl: 1, yl: 4, xh: 4, yh: 6 }),
            new Country('Spain', { xl: 3, yl: 1, xh: 6, yh: 3 }),
            new Country('Portugal', { xl: 1, yl: 1, xh: 2, yh: 2 }),
        ]).startDiffusionEmulation();
        expect(diffusionResult.get('Spain')).toBe(382);
        expect(diffusionResult.get('Portugal')).toBe(416);
        expect(diffusionResult.get('France')).toBe(1325);
    });

    test('Sample case 2', () => {
        const diffusionResult = new MapGrid([
            new Country('Luxembourg', { xl: 1, yl: 1, xh: 1, yh: 1 }),
        ]).startDiffusionEmulation();
        expect(diffusionResult.get('Luxembourg')).toBe(0);
    });

    test('Sample case 3', () => {
        const diffusionResult = new MapGrid([
            new Country('Netherlands', { xl: 1, yl: 3, xh: 2, yh: 4 }),
            new Country('Belgium', { xl: 1, yl: 1, xh: 2, yh: 2 }),
        ]).startDiffusionEmulation();
        expect(diffusionResult.get('Netherlands')).toBe(2);
        expect(diffusionResult.get('Belgium')).toBe(2);
    });
});
