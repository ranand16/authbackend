export function generateUUID10() {
    // Ensure that we generate a number with 10 digits by taking a portion of a random number
    return Math.floor(Math.random() * 9000000000) + 1000000000; // Ensures the number is 10 digits long
}