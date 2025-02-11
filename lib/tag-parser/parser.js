"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const tokenizer_1 = require("./tokenizer");
function createUnexpectedEndOfString() {
    return new errors_1.TagParserError("Unexpected end-of-string");
}
function createUnexpectedToken(token, expectation) {
    return new Error(`Unexpected token at ${token.position}: ${token.value} (${expectation})`);
}
function expectToken(token) {
    if (token.done) {
        throw createUnexpectedEndOfString();
    }
    return token;
}
function parsePrimitiveToken(token) {
    if (token.done) {
        throw createUnexpectedEndOfString();
    }
    const value = token.value.value;
    const char = value[0];
    if (value === "false") {
        return false;
    }
    else if (value === "true") {
        return true;
    }
    if ((0, tokenizer_1.isDigit)(char)) {
        return parseInt(value);
    }
    else if ((0, tokenizer_1.isQuote)(char)) {
        return value.slice(1, -1);
    }
    else {
        throw createUnexpectedToken(token.value, "expected a string, a boolean or a number");
    }
}
class BufferedGenerator {
    constructor(generator) {
        this.tokens = [];
        this.position = -1;
        do {
            this.tokens.push(generator.next());
        } while (!this.tokens[this.tokens.length - 1].done);
    }
    next() {
        if (this.position < this.tokens.length - 1) {
            this.position++;
        }
        return this.tokens[this.position];
    }
    peak(n = 1) {
        return this.tokens[this.position + n];
    }
}
class Parser {
    constructor(content) {
        this.content = content;
    }
    parse() {
        const tokens = new BufferedGenerator(new tokenizer_1.Tokenizer(this.content).tokens());
        let next = expectToken(tokens.next());
        if (!(0, tokenizer_1.isAt)(next.value.value)) {
            throw createUnexpectedToken(next.value, "expected tag to begin with '@'");
        }
        next = expectToken(tokens.next());
        if (!(0, tokenizer_1.isWordChar)(next.value.value[0])) {
            throw createUnexpectedToken(next.value, "expected tag to start with a property name");
        }
        const propertyName = next.value.value;
        next = expectToken(tokens.next());
        if (!(0, tokenizer_1.isOpeningParanthesis)(next.value.value)) {
            throw createUnexpectedToken(next.value, "expected opening paranthesis");
        }
        const isObjectMode = (0, tokenizer_1.isEqual)(expectToken(tokens.peak(2)).value.value);
        const entries = [];
        const values = [];
        if (isObjectMode) {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const key = expectToken(tokens.next()).value.value;
                next = expectToken(tokens.next());
                if (!(0, tokenizer_1.isEqual)(next.value.value)) {
                    throw createUnexpectedToken(next.value, "expected equal sign");
                }
                const value = parsePrimitiveToken(tokens.next());
                entries.push([key, value]);
                if (!(0, tokenizer_1.isComma)(expectToken(tokens.peak()).value.value)) {
                    break;
                }
                else {
                    tokens.next();
                }
            }
        }
        else {
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const value = parsePrimitiveToken(tokens.next());
                values.push(value);
                if (!(0, tokenizer_1.isComma)(expectToken(tokens.peak()).value.value)) {
                    break;
                }
                else {
                    tokens.next();
                }
            }
        }
        next = expectToken(tokens.next());
        if (next.done) {
            throw createUnexpectedEndOfString();
        }
        else if (!(0, tokenizer_1.isClosingParanthesis)(next.value.value)) {
            throw createUnexpectedToken(next.value, "expected closing paranthesis");
        }
        if (isObjectMode) {
            return {
                [propertyName]: Object.fromEntries(entries),
            };
        }
        else {
            return {
                [propertyName]: values.length === 1 ? values[0] : values,
            };
        }
    }
}
exports.default = Parser;
