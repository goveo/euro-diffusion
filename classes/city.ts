export class City {
    completed: boolean;
    coinTypesNumber: number;
    neighbors: City[];
    coins: number[];
    cache: number[];
    representativePortion: number;

    /**
     * Create a City
     * @param {number} coinTypesNumber - number of possible coin types
     * @param {number} initialCoinsCount
     * @param {number} representativePortion
     */
    constructor(coinTypesNumber: number,
        countryIndex: number,
        initialCoinsCount = 1000000,
        representativePortion: number = initialCoinsCount / 1000,
    ) {
        this.completed = false;
        this.neighbors = [];
        this.coinTypesNumber = coinTypesNumber;

        this.coins = new Array(coinTypesNumber).fill(0);
        this.cache = new Array(coinTypesNumber).fill(0);

        this.coins[countryIndex] = initialCoinsCount;
        this.representativePortion = representativePortion;
    }

    /**
     * Transport coins to neighbors
     */
    transportCoinsToNeighbors(): void {
        if (this.coins.every((coin) => coin > 0)) {
            this.completed = true;
        }

        this.coins.forEach((coinCount, index) => {
            if (coinCount >= this.representativePortion) {
                const share = Math.floor(coinCount / this.representativePortion);

                this.neighbors.forEach((city, cityIndex) => {
                    this.neighbors[cityIndex].cache[index] += share;
                    this.coins[index] -= share;
                });
            }
        });
    }

    /**
     * Update coins number
     */
    updateCoins(): void {
        for (let coinType = 0; coinType < this.coinTypesNumber; coinType++) {
            this.coins[coinType] += this.cache[coinType];
            this.cache[coinType] = 0;
        }
    }
}

export default City;
