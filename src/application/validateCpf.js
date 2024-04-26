"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const FACTOR_FIRST_DIGIT = 10;
const FACTOR_SECOND_DIGIT = 11;
function validate(rawCpf) {
    if (!rawCpf)
        return false;
    const cpf = removeNonDigits(rawCpf);
    if (!isValidLength(cpf))
        return false;
    if (allDigitsEqual(cpf))
        return false;
    const firstDigit = calculateDigit(cpf, FACTOR_FIRST_DIGIT);
    const secondDigit = calculateDigit(cpf, FACTOR_SECOND_DIGIT);
    return extractDigit(cpf) === `${firstDigit}${secondDigit}`;
}
exports.validate = validate;
function removeNonDigits(cpf) {
    return cpf.replace(/\D/g, "");
}
function isValidLength(cpf) {
    return cpf.length === 11;
}
function allDigitsEqual(cpf) {
    const [firstDigit] = cpf;
    return cpf.split("").every(digit => digit === firstDigit);
}
function calculateDigit(cpf, factor) {
    let total = 0;
    for (const digit of cpf) {
        if (factor > 1)
            total += parseInt(digit) * factor--;
    }
    const remainder = total % 11;
    return (remainder < 2) ? 0 : 11 - remainder;
}
function extractDigit(cpf) {
    return cpf.slice(9);
}
