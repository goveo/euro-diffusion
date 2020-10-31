import fs from 'fs';

export class Reader {
    /**
     * Parse input file
     * @param {string} filename - path to input file
     * @returns {string[][]} Array of diffusion-cases
     * @throws {Error} Will throw an error if input file have wrong structure
     */
    static parseInputFile = (filename: string): string[][] => {
        if (!filename) {
            throw new Error('Filename is required');
        }
        const countryStrings: string[][] = [];
        const lines = fs.readFileSync(filename).toString().split('\n').map((line) => line.replace('\r', ''));

        let lineIndex = 0;
        while (lineIndex < lines.length - 2) {
            const currentLine = lines[lineIndex];
            const countryNumber = parseInt(currentLine);
            if (countryNumber) {
                lineIndex += 1; // move to first country line
                const countries = [];
                for (let countryLineIndex = lineIndex; countryLineIndex < countryNumber + lineIndex; countryLineIndex++) {
                    countries.push(lines[countryLineIndex]);
                }
                lineIndex += countryNumber; // move to next number of countries
                countryStrings.push(countries);
            } else {
                throw new Error(`Error in input file at '${lines[lineIndex]}'. Expected a number of countries`);
            }
        }

        if (lines[lines.length - 1] !== '0') {
            throw new Error("Input file must end with '0' line");
        }

        return countryStrings;
    };
}

export default Reader;
