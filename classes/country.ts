import City from './city';

export interface CountryCoordinates {
    xl: number;
    yl: number;
    xh: number;
    yh: number;
}

export class Country {
    cities: City[];
    name: string;
    coordinates: CountryCoordinates;
    static MAX_COORDINATE = 10;

    /**
     * Create a Country
     * @param {string} name - Name of country
     * @throws Will throw an error if country have invalid coordinates
     */
    constructor(name: string, coordinates: CountryCoordinates) {
        if (!Country.areCoordinatesValid(coordinates)) {
            throw new Error('Coordinates are invalid');
        }
        this.cities = [];
        this.name = name;
        this.coordinates = coordinates;
    }

    /**
     * Checks if coordinates are valid
     * @param {CountryCoordinates}
     */
    static areCoordinatesValid({ xl, yl, xh, yh }: CountryCoordinates): boolean {
        const isCorrectLowHighRange = (low: number, high: number) => {
            return low <= high;
        };

        const isInBounds = (coordinate: number) => {
            return ((coordinate >= 0) && (coordinate <= Country.MAX_COORDINATE));
        };

        return [isInBounds(xl),
            isInBounds(yl),
            isInBounds(xh),
            isInBounds(yh),
            isCorrectLowHighRange(xl, xh),
            isCorrectLowHighRange(yl, yh)]
            .every((result) => result === true);
    }

    /**
     * Checks if coordinates are valid
     * @param {City} city - City to add
     */
    addCity(city: City): void {
        this.cities.push(city);
    }

    /**
     * Checks if coordinates are valid
     * @returns {boolean} Flag that shows is diffusion completed in country
     */
    isCompleted(): boolean {
        return this.cities.every((city) => city.completed);
    }

    /**
     * Get country object form string
     * @param {string} countryString - string in format '{name} {xl} {yl} {xh} {yh}'
     * @returns {Country}
     */
    static parseCountryString(countryString: string): Country {
        const [name, ...coordinates] = countryString.split(' ');

        if (name.length > 25) {
            throw new Error('Name must be less than 25 characters');
        }

        const [xl, yl, xh, yh] = coordinates.map((coordinate) => parseInt(coordinate) - 1);
        return new Country(name, { xl, yl, xh, yh } as CountryCoordinates);
    }
}

export default Country;
