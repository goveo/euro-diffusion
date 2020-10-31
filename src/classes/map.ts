import City from './city';
import Country from './country';

export const INITIAL_COINS_COUNT = 1000000;
export const REPRESENTATIVE_PORTION = INITIAL_COINS_COUNT / 1000;

type Coordinates = { x: number, y: number };

class GridDictionary {
    private map = new Map<string, City>();

    private key(coords: Coordinates) {
        return `${coords.x}-${coords.y}`;
    }

    set(coords: Coordinates, value: City) {
        const key = this.key(coords);
        this.map.set(key, value);
    }

    get(coords: Coordinates) {
        const key = this.key(coords);
        return this.map.get(key);
    }
}

export class MapGrid {
    countries: Country[];
    countriesGrid = new GridDictionary();

    minX: number;
    minY: number;
    maxX: number;
    maxY: number;

    /**
     * Create a MapGrid
     * @param {Country[]} countries - Array of countries to set in MapGrid
     */
    constructor(countries: Country[]) {
        this.countries = countries;
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;

        // find max/min coords
        countries.forEach((country) => {
            this.minX = Math.min(this.minX, country.coordinates.xl);
            this.minY = Math.min(this.minY, country.coordinates.yl);
            this.maxX = Math.max(this.maxX, country.coordinates.xh);
            this.maxY = Math.max(this.maxY, country.coordinates.yh);
        });

        this.addCitiesToCountries();
        this.addNeighborsToCities();
    }

    /**
     * Checks if all cities have coins of each motif
     * @returns {boolean} Flag that shows is diffusion completed
     */
    isCompleted(): boolean {
        return this.countries.every((country) => country.isCompleted());
    }

    /**
     * Create and set cities to countries
     */
    addCitiesToCountries(): void {
        const coinTypes = this.countries.map((country) => country.name);
        this.countries.forEach((country, countryIndex) => {
            for (let x = country.coordinates.xl; x <= country.coordinates.xh; x += 1) {
                for (let y = country.coordinates.yl; y <= country.coordinates.yh; y += 1) {
                    const city = new City(coinTypes, country.name, INITIAL_COINS_COUNT, REPRESENTATIVE_PORTION);
                    this.countriesGrid.set({ x, y }, city);
                    this.countries[countryIndex].addCity(city);
                }
            }
        });
    }

    /**
     * Fill neighbors array in cities
     */
    addNeighborsToCities(): void {
        for (let x = this.minX; x <= this.maxX; x += 1) {
            for (let y = this.minY; y <= this.maxY; y += 1) {
                const city = this.countriesGrid.get({ x, y });
                if (!city) {
                    continue;
                }

                const neighbors: City[] = [];

                const addNeighbor = (x: number, y: number) => {
                    const neighborCity = this.countriesGrid.get({ x, y });
                    if (neighborCity) {
                        neighbors.push(neighborCity);
                    }
                };

                if (x + 1 <= this.maxX) {
                    addNeighbor(x + 1, y); // right neighbor
                }
                if (x - 1 >= this.minY) {
                    addNeighbor(x - 1, y); // left neighbor
                }
                if (y + 1 <= this.maxY) {
                    addNeighbor(x, y + 1); // up neighbor
                }
                if (y - 1 >= this.minY) {
                    addNeighbor(x, y - 1); // down neighbor
                }

                if (this.countries.length > 1 && !neighbors.length) {
                    throw new Error(`City in ${city.countryName} has no neighbors`);
                }

                city.neighbors = neighbors;
            }
        }
    }

    /**
     * Start emulation of euro diffusion
     * @returns {Map<string, number>} Map, where
     *      key - name of country
     *      value - days of diffusion
     *
     */
    startDiffusionEmulation(): Map<string, number> {
        this.countriesGrid = new GridDictionary();
        const result = new Map<string, number>();
        let currentDay = 0;

        do {
            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.transportCoinsToNeighbors();
                });

                if (country.isCompleted()) {
                    if (!result.has(country.name)) {
                        result.set(country.name, currentDay);
                    }
                }
            });

            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.updateCoins();
                });
            });
            currentDay += 1;
        } while (!this.isCompleted());

        // check if result have all countries
        this.countries.forEach((country) => {
            if (!result.has(country.name)) {
                result.set(country.name, currentDay);
            }
        });

        return result;
    }
}

export default MapGrid;
