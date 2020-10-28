import City from './city';
import Country from './country';

export const INITIAL_COINS_COUNT = 1000000;
export const REPRESENTATIVE_PORTION = INITIAL_COINS_COUNT / 1000;

type CoordsTuple = [x: number, y: number];

class GridDictionary {
    private map = new Map<string, City>();

    private key(p: CoordsTuple) {
        return `${p[0]}-${p[1]}`;
    }

    set(p: CoordsTuple, value: City) {
        const key = this.key(p);
        this.map.set(key, value);
    }

    get(p: CoordsTuple) {
        const key = this.key(p);
        return this.map.get(key);
    }
}

export class MapGrid {
    countries: Country[];
    countriesGrid = new GridDictionary();
    width: number;
    height: number;

    /**
     * Create a MapGrid
     * @param {Country[]} countries - Array of countries to set in MapGrid
     */
    constructor(countries: Country[]) {
        this.countries = countries;
        this.width = 0;
        this.height = 0;
        this.setMapSize();
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
     * Find and set height and width of map-grid
     */
    setMapSize(): void {
        const xCoords: number[] = [];
        const yCoords: number[] = [];

        this.countries.forEach((country) => {
            xCoords.push(country.coordinates.xl, country.coordinates.xh);
            yCoords.push(country.coordinates.yl, country.coordinates.yh);
        });

        this.width = Math.max(...xCoords) - Math.min(...xCoords) + 1;
        this.height = Math.max(...yCoords) - Math.min(...yCoords) + 1;
    }

    /**
     * Create and set cities to countries
     */
    addCitiesToCountries(): void {
        const coinTypes = this.countries.map((country) => country.name);
        this.countries.forEach((country, countryIndex) => {
            for (let i = 0; i < country.coordinates.xh - country.coordinates.xl + 1; i++) {
                for (let j = 0; j < country.coordinates.yh - country.coordinates.yl + 1; j++) {
                    const x = country.coordinates.xl + i;
                    const y = country.coordinates.yl + j;
                    const city = new City(coinTypes, country.name, INITIAL_COINS_COUNT, REPRESENTATIVE_PORTION);
                    this.countriesGrid.set([x, y], city);
                    this.countries[countryIndex].addCity(city);
                }
            }
        });
    }

    /**
     * Fill neighbors array in cities
     */
    addNeighborsToCities(): void {
        [...Array(this.width).keys()].forEach((x) => {
            [...Array(this.height).keys()].forEach((y) => {
                const city = this.countriesGrid.get([x, y]);
                if (!city) return;

                const neighbors: City[] = [];

                const addNeighbor = (x: number, y: number) => {
                    const city = this.countriesGrid.get([x, y]);
                    if (city) {
                        neighbors.push(city);
                    }
                };

                if (x + 1 <= this.width) {
                    addNeighbor(x + 1, y); // right neighbor
                }
                if (x - 1 >= 0) {
                    addNeighbor(x - 1, y); // left neighbor
                }
                if (y + 1 <= this.height) {
                    addNeighbor(x, y + 1); // up neighbor
                }
                if (y - 1 >= 0) {
                    addNeighbor(x, y - 1); // down neighbor
                }

                city.neighbors = neighbors;
            });
        });
    }

    /**
     * Start emulation of euro diffusion
     * @returns {Map<key, value>} Map, where
     *      key - name of country
     *      value - days of diffusion
     *
     */
    startDiffusionEmulation(): Map<string, number> {
        this.countriesGrid = new GridDictionary();
        const result = new Map<string, number>();
        let days = 0;

        do {
            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.transportCoinsToNeighbors();
                });

                if (country.isCompleted()) {
                    if (!result.has(country.name)) {
                        result.set(country.name, days);
                    }
                }
            });

            this.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    city.updateCoins();
                });
            });
            days += 1;
        } while (!this.isCompleted());

        // check if result have all countries
        this.countries.forEach((country) => {
            if (!result.has(country.name)) {
                result.set(country.name, days);
            }
        });

        return result;
    }
}

export default MapGrid;
