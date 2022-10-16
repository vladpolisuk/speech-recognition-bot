/**
 * The function that return a random element from array
 * @param {array} array - list of elements
 * @return {element} random element from `array` 
 */
const getRandomElement = (array) => array.sort(() => 0.5 - Math.random())[0];
export default getRandomElement;