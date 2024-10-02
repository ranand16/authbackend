
export function generateUUID10() {
    // Ensure that we generate a number with 10 digits by taking a portion of a random number
    return Math.floor(Math.random() * 9000000000) + 1000000000; // Ensures the number is 10 digits long
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function createDiscountCoupon(length = 5) {
    const discountCoupon = [];
    for (let index = 0; index < length; index++) {
        discountCoupon.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return discountCoupon.join("");
}
