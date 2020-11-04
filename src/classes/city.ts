const INITIAL_COINS_COUNT = 1000000;
const REPRESENTATIVE_PORTION = INITIAL_COINS_COUNT / 1000;

export class City {
    coinTypes: string[];
    countryName: string;
    neighbors: City[];
    coins: number[];
    cache: number[];
    representativePortion: number;

    /**
     * Create a City
     * @param {string[]} coinTypes - type of available coins
     * @param {string} countryName
     * @param {number} initialCoinsCount
     * @param {number} representativePortion
     */
    constructor(coinTypes: string[],
        countryName: string,
        initialCoinsCount = INITIAL_COINS_COUNT,
        representativePortion: number = REPRESENTATIVE_PORTION,
    ) {
        this.countryName = countryName;
        this.coinTypes = coinTypes;
        this.neighbors = [];

        this.coins = new Array(coinTypes.length).fill(0);
        this.cache = new Array(coinTypes.length).fill(0);

        const countryIndex = this.coinTypes.indexOf(this.countryName);

        this.coins[countryIndex] = initialCoinsCount;
        this.representativePortion = representativePortion;
    }

    /**
     * Checks if city have coins of each motif
     * @returns {boolean}
     */
    isCompleted(): boolean {
        return this.coins.every((coin) => coin > 0);
    }

    /**
     * Transport coins to neighbors
     */
    transportCoinsToNeighbors(): void {
        this.coins.forEach((coinCount, index) => {
            const share = Math.floor(coinCount / this.representativePortion);
            this.neighbors.forEach((city) => {
                city.cache[index] += share;
                this.coins[index] -= share;
            });
        });
    }

    /**
     * Update coins number
     */
    updateCoins(): void {
        for (let coinTypeIndex = 0; coinTypeIndex < this.coinTypes.length; coinTypeIndex++) {
            this.coins[coinTypeIndex] += this.cache[coinTypeIndex];
            this.cache[coinTypeIndex] = 0;
        }
    }
}

export default City;
