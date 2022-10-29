import { calculate, calculatorButtons, createError, createNumber, createSymbol, IButton, mergeNumbers, solve } from './Buttons';
import { describe, test, expect } from 'vitest';

describe('addition', () => {

    test('1+2=3', () => {
        const primer: IButton[] = [
            createSymbol(1),
            createSymbol('+'),
            createSymbol(2)
        ];
        const plus = primer[1];
        expect(plus?.func).toBeTruthy();

        if (plus?.func) {
            expect(plus?.func(primer, 1)).toMatchObject([createSymbol(3)]);
        }
    });

    test('1-2=-1', () => {
        const primer: IButton[] = [
            createSymbol(1),
            createSymbol('-'),
            createSymbol(2)
        ];
        const plus = primer[1];
        expect(plus?.func).toBeTruthy();

        if (plus?.func) {
            expect(plus?.func(primer, 1)).toMatchObject([createNumber(-1)]);
        }
    });


    test('11-11=0', () => {
        const primer: IButton[] = [
            createNumber(11),
            createSymbol('-'),
            createNumber(11),
        ];
        const plus = primer[1];
        expect(plus?.func).toBeTruthy();

        if (plus?.func) {
            expect(plus?.func(primer, 1)).toMatchObject([createNumber(0)]);
        }
    });

    test('1000-999=0', () => {
        const primer: IButton[] = [
            createNumber(1000),
            createSymbol('-'),
            createNumber(999),
        ];
        const plus = primer[1];
        expect(plus?.func).toBeTruthy();

        if (plus?.func) {
            expect(plus?.func(primer, 1)).toMatchObject([createNumber(1)]);
        }
    });

});

describe('multiplication', () => {    

    test('2*3=6', () => {
        const primer: IButton[] = [
            createNumber(2),
            createSymbol('×'),
            createNumber(3)
        ];
        const mul = primer[1];

        expect(mul?.func).toBeTruthy();
        if (mul?.func) {
            expect(mul?.func(primer, 1)).toMatchObject([createNumber(6)]);
        }
    });

    test('-2*3=-6', () => {
        const primer: IButton[] = [
            createNumber(-2),
            createSymbol('×'),
            createNumber(3)
        ];
        const mul = primer[1];

        expect(mul?.func).toBeTruthy();
        if (mul?.func) {
            expect(mul?.func(primer, 1)).toMatchObject([createNumber(-6)]);
        }
    });

    test('-2*(-3)=6', () => {
        const primer: IButton[] = [
            createNumber(-2),
            createSymbol('×'),
            createNumber(-3)
        ];
        const mul = primer[1];

        expect(mul?.func).toBeTruthy();
        if (mul?.func) {
            expect(mul?.func(primer, 1)).toMatchObject([createNumber(6)]);
        }
    });

});

describe('square root', () => {
    test('√16=4', () => {
        const primer: IButton[] = [
            createSymbol('√'),
            createNumber(16)
        ];
        const sqrt = primer[0];
        expect(sqrt?.func).toBeTruthy();
        if (sqrt?.func) {
            expect(sqrt.func(primer, 0)).toMatchObject([createSymbol(4)]);
        }
    });

    test('√-16=err', () => {
        const primer: IButton[] = [
            createSymbol('√'),
            createNumber(-16)
        ];
        const sqrt = primer[0];
        expect(sqrt?.func).toBeTruthy();
        if (sqrt?.func) {
            expect(sqrt.func(primer, 0)).toMatchObject([createError()]);
        }
    });
});

describe('percent', () => {
    test('12% -> 0.12', () => {
        const primer: IButton[] = [
            createNumber(12),
            createSymbol('%'),
        ];
        const percent = primer[1];
        expect(percent?.func).toBeTruthy();
        if (percent?.func) {
            expect(percent.func(primer, 1)).toMatchObject([createNumber(0.12)]);
        }
    });

    test('12%% -> 0.0012', () => {
        const primer: IButton[] = [
            createNumber(12),
            createSymbol('%'),
            createSymbol('%'),
        ];
        const solved = solve(primer);
        expect(solved).toMatchObject(createNumber(0.0012));
    });
});

describe('merging primer', () => {
    test('1, 2 => 12', () => {
        const primer: IButton[] = [
            createSymbol('1'),
            createSymbol('2')
        ];
        const merged = mergeNumbers(primer);
        expect(merged).toMatchObject([createNumber(12)]);
    });

    test('1,/, 2 => 1 / 2', () => {
        const primer: IButton[] = [
            createSymbol('1'),
            createSymbol('/'),
            createSymbol('2')
        ];
        const merged = mergeNumbers(primer);
        expect(merged).toMatchObject(primer);
    });

    test('2 - 2 => 2 - 2', () => {
        const primer: IButton[] = [
            createSymbol('2'),
            createSymbol('-'),
            createSymbol('2')
        ];
        const merged = mergeNumbers(primer);
        expect(merged).toMatchObject(primer);
    });

   
});

describe('solve', () => {
    test('-2 - 2 => -4', () => {
        const primer: IButton[] = [
            createSymbol('-'),
            createSymbol('2'),
            createSymbol('-'),
            createSymbol('2')
        ];
        const solved = solve(primer);
        expect(solved).toMatchObject(createNumber(-4));
    });

    test('-√4 => -2', () => {
        const primer: IButton[] = [
            createSymbol('-'),
            createSymbol('√'),
            createSymbol('4'),
        ];
        const solved = solve(primer);

        expect(solved).toMatchObject(createNumber(-2));
    });

    
});

describe('calculate', () => {
    test('-√(-2 * (-2)) => -2', () => {
        const primer: IButton[] = [
            createSymbol('-'),
            createSymbol('√'),
            createSymbol('('),
            createSymbol('-'),
            createSymbol('2'),
            createSymbol('×'),
            createSymbol('('),
            createSymbol('-'),
            createSymbol('2'),
            createSymbol(')'),
            createSymbol(')'),
        ];
        const solved = calculate(primer, calculatorButtons);

        expect(solved).toMatchObject([
            createSymbol('-'),
            createSymbol('2')
        ]);
    });
});

describe('parenthesis', () => {
    test('(2/2) * (-√16)/(4.5-0.5) => -1', () => {
        const primer: IButton[] = [
            createSymbol('('),
            createSymbol('2'),
            createSymbol('/'),
            createSymbol('2'),
            createSymbol(')'),
            createSymbol('×'),
            createSymbol('('),
            createSymbol('-'),
            createSymbol('√'),
            createSymbol('1'),
            createSymbol('6'),
            createSymbol(')'),
            createSymbol('/'),
            createSymbol('('),
            createSymbol('4'),
            createSymbol(','),
            createSymbol('5'),
            createSymbol('-'),
            createSymbol('0'),
            createSymbol(','),
            createSymbol('5'),
            createSymbol(')'),
        ];
        const solved = calculate(primer, calculatorButtons);
        expect(solved).toMatchObject([
            createSymbol('-'),
            createSymbol('1')
        ]);
    });

    test('√(-16) => Error', () => {
        const primer: IButton[] = [
            createSymbol('√'),
            createSymbol('('),
            createSymbol('-'),
            createSymbol('1'),
            createSymbol('6'),
            createSymbol(')'),
        ];
        const solved = calculate(primer, calculatorButtons);
        expect(solved).toMatchObject([createError()]);
    });
});
