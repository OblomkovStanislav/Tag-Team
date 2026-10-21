/**
 * Утилитарный класс для работы с числами.
 * Предоставляет статические методы для генерации случайных чисел.
 */

export class NumberUtility {
    /**
     * Генерирует случайное целое число в заданном диапазоне.
     *
     * @param {number} fromInclusive - Нижняя граница диапазона (включительно).
     * @param {number} toExclusive - Верхняя граница диапазона (исключительно).
     * @returns {number} Случайное целое число в диапазоне [fromInclusive, toExclusive).
     *
     * @throws {RangeError} Если fromInclusive >= toExclusive, выбрасывает ошибку.
     *
     * @example
     * // Генерация числа от 1 до 10 (не включая 10)
     * const randomNumber = NumberUtility.getRandomIntegerNumber(1, 10);
     * console.log(randomNumber); // 1, 2, 3, ... 9
     *
     * @example
     * // Генерация числа от 0 до 5 (не включая 5)
     * const randomNumber = NumberUtility.getRandomIntegerNumber(0, 5);
     * console.log(randomNumber); // 0, 1, 2, 3, 4
     */

    //Получить случайное целове число
    getRandomIntegerNumber(fromInclusive, toExclusive) {
        return Math.floor(Math.random() * (toExclusive - fromInclusive)) + fromInclusive;
    }
}
