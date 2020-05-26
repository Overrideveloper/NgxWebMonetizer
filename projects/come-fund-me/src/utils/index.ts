import * as humanNumber from 'human-number'

export function TRUNCATE_TEXT(text: string, length: number) {
    return text.length <= length ? text : `${text.split('').slice(0, length).join('')}...`;
}

export function FORMAT_NUMBER_READABLE(value: number) {
    const output: any = humanNumber(value);
    
    return output.toString().replace('G', 'B');
}

export function CALCULATE_PERCENTAGE(numerator, denominator) {
    return (numerator/denominator) * 100;
}