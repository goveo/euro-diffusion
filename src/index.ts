import Reader from './classes/reader';
import MapGrid from './classes/map';
import Country from './classes/country';

/**
 * Process single case
 * @param {string[]} countriesStrings
 */
const processCase = (countriesStrings: string[]) => {
    try {
        const countries: Country[] = [];
        countriesStrings.forEach((countryString) => {
            countries.push(Country.parseCountryString(countryString));
        });
        const result = new MapGrid(countries).startDiffusionEmulation();
        console.log(MapGrid.diffusionResultToString(result));
    } catch (error) {
        console.error(error.toString());
    }
};

const main = () => {
    const countryStrings = Reader.parseInputFile('inputFile');
    countryStrings.forEach((caseCountries: string[], caseNumber) => {
        console.log(`Case Number ${caseNumber + 1}`);
        processCase(caseCountries);
    });
};

main();
