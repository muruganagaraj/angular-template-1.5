String.prototype['endsWith'] = function(str: string): boolean {
    if (!str) {
        return true;
    }
    if (str.length > this.length) {
        return false;
    }
    return this.indexOf(str, this.length - str.length) === 0;
};

String.prototype['padLeft'] = function(width: number, padChar: string = ' '): string {
    padChar = padChar || ' ';
    return this.length >= width ? this : new Array(width - this.length + 1).join(padChar) + this;
};

String.prototype['padRight'] = function(width: number, padChar: string = ' '): string {
    padChar = padChar || ' ';
    return this.length >= width ? this : this + new Array(width - this.length + 1).join(padChar);
};

String.prototype['snakeCaseToCamelCase'] = function(): string {
    return this.replace(/\W+(.)/g, function (x: string, chr: string): string {
        return chr.toUpperCase();
    }).replace('-', '');
};

String.prototype['startsWith'] = function(str: string): boolean {
    if (!str) {
        return true;
    }
    if (str.length > this.length) {
        return false;
    }
    return this.indexOf(str) === 0;
};

interface String {
    endsWith(str: string): boolean;
    padLeft(width: number, padChar: string): string;
    padRight(width: number, padChar: string): string;
    snakeCaseToCamelCase(): string;
    startsWith(str: string): boolean;
}
