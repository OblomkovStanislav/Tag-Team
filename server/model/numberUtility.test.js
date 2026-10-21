import {NumberUtility} from "./numberUtility.js";

describe("NumberUtility", () => {
    let numberUtility;

    beforeEach(() => {
        numberUtility = new NumberUtility();
    });

    test("getRandomIntegerNumber should return number within range", () => {
        const from = 1;
        const to = 10;
        const result = numberUtility.getRandomIntegerNumber(from, to);

        expect(result).toBeGreaterThanOrEqual(from);
        expect(result).toBeLessThan(to);
        expect(Number.isInteger(result)).toBe(true);
    });

    test("getRandomIntegerNumber should return different values", () => {
        const results = new Set();
        for (let i = 0; i < 100; i++) {
            results.add(numberUtility.getRandomIntegerNumber(1, 10));
        }
        expect(results.size).toBeGreaterThan(1);
    });

    test("getRandomIntegerNumber should work with negative numbers", () => {
        const from = -10;
        const to = -1;
        const result = numberUtility.getRandomIntegerNumber(from, to);

        expect(result).toBeGreaterThanOrEqual(from);
        expect(result).toBeLessThan(to);
    });

    test("getRandomIntegerNumber should work with zero", () => {
        const result = numberUtility.getRandomIntegerNumber(0, 5);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThan(5);
    });
});
