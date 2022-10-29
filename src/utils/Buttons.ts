export interface IButton {
    text: string
    type: string
    func?: (items?: IButton[], idx?: number, buttons?: IButton[]) => IButton[]
    input?: any
    priority?: number
    ignore?: boolean
}

const deepestPair = (items: IButton[]) => {
    let indices: number[] = [];
    let max = 0;
    let count = 0;
    let last: number;

    items.forEach((c, i) => {
        if (c.text === '(') {
            last = i;
            count++;
            return;
        }
        if (c.text === ')') {
            if (count > max) {
                indices = [last, i];
                max = count;
            }
            count--;
        }
    });
    return indices;
}

const checkParentheses = (items: IButton[]) => {
    const parenthesis = items.filter(item => ['(', ')'].includes(item.text)).map(item => item.text);

    if (parenthesis.filter(t => t === '(').length !== parenthesis.filter(t => t === ')').length) {
        return false;
    }

    let lefts = 0;
    let rights = 0;
    for (let i = 0; i < parenthesis.length; i++) {
        if (parenthesis[i] === '(') {
            lefts++;
        } else {
            rights++;
        }
        if (rights > lefts) {
            return false;
        }
    }
    return true;
}

/**
 * solving primer without parenthesis
 * @param items items of primer
 */
export const solve = (newItems: IButton[]): IButton => {
    while (newItems.length > 1) {
        let maxPrior = -Infinity;
        let maxPriorIdx = -1;
        for (let i = 0; i < newItems.length; i++) {
            if ((newItems[i].priority ?? 0) > maxPrior) {
                maxPrior = newItems[i].priority ?? 0;
                maxPriorIdx = i;
            }
        }
        const nextSymbol = newItems[maxPriorIdx];
        if (nextSymbol.func) {
            newItems = nextSymbol.func(newItems, maxPriorIdx);
            if (newItems.find(el => el.type === 'error')) {
                return createError();
            }
        }
    }
    return newItems[0];
}

/**
 * merges separate numbers into one (ex: 1, 2, ., 3 -> 12.3)
 * @param items unmerged items
 * @returns merged items
 */
export const mergeNumbers = (items: IButton[]) => {
    return items.reduce((acc: IButton[], item: IButton) => {
        if (item.text === ',') { // replace comma with a dot
            acc[acc.length - 1].text += '.';
        } else if (item.type === 'number' && acc[acc.length - 1]?.type === 'number') { // merge numbers together
            acc[acc.length - 1].text += item.text;
        } else {
            acc.push(item);
        }
        return acc;
    }, []);
}
/**
 * slices all the number occurences in separate symbols (ex: 123 -> 1, 2, 3);
 * @param items merged items
 * @returns unmerged items
 */
export const unmergeNumbers = (items: IButton[], buttons?: IButton[]) => {
    if (!buttons) return [];
    return items.reduce((acc: IButton[], item: IButton) => {
        if (item.type === 'number') {
            item.text.split('').forEach(text => {
                if (text === '.') {
                    acc.push(createSymbol(','));
                }
                else {
                    acc.push(createSymbol(text));
                }
            })
        } else {
            acc.push(item);
        }
        return acc;
    }, []);
}

export const calculate = (origItems?: IButton[], buttons?: IButton[]) => {
    if (!origItems) return [];
    let items = origItems.map(item => ({ ...item }));
    if (items.length === 0) return [];

    if (!checkParentheses(items)) {
        return [{
            text: 'Error',
            type: 'error'
        }];
    }
    try {
        items = mergeNumbers(items);
        while (deepestPair(items).length > 0) {
            // find indexes of deepest parenthesis
            const pair = deepestPair(items);
            pair[1]++;

            // remove parenthresis
            const itemsPair = items.slice(pair[0] + 1, pair[1] - 1);
            // find sub-solution
            const solution = solve(itemsPair);
            // insert it
            items.splice(pair[0], pair[1] - pair[0], solution);
        }
        const result = solve(items);
        const unm = unmergeNumbers([result], buttons);
        return unm;
    } catch {
        return origItems;
    }
}

// (
const addParenthesisLeft = (items: IButton[], button: IButton) => {
    if (items.length === 1 && items[items.length - 1].text === '0') {
        return [...items.slice(0, items.length - 1), { ...button }];
    }
    if (items.length === 0 ||
        items[items.length - 1].type === 'parenthesis' ||
        items[items.length - 1].type === 'symbol') {
        return items.concat(button);
    }
    return items;
}

// )
const addParenthesisRight = (items: IButton[], button: IButton) => {
    if (items.length === 0) return items;

    if (items[items.length - 1].type === 'parenthesis' ||
        items[items.length - 1].type === 'number' ||
        items[items.length - 1].type === 'percent') {
        return items.concat(button);
    }
    return items;
}

// 123456789
const addNumber = (items: IButton[], button: IButton) => {
    if (items.length === 1 && items[items.length - 1].text === '0') {
        return [...items.slice(0, items.length - 1), { ...button }];
    }
    if (items.length === 0 ||
        items[items.length - 1].type === 'number' ||
        items[items.length - 1].type === 'parenthesis' ||
        items[items.length - 1].type === 'symbol' ||
        items[items.length - 1].type === 'dot') {
        return items.concat(button);
    }
    return items;
}

// * and /
const addSymbol = (items: IButton[], button: IButton) => {
    if (items.length === 0) return items;

    if (items[items.length - 1].type === 'symbol') {
        return [...items.slice(0, items.length - 1), button];
    } 
    else if (
        items[items.length - 1].type === 'number' ||
        items[items.length - 1].text === ')' ||
        items[items.length - 1].type === 'percent') { return items.concat(button); }
    return items;
}

// + and -
const addPrimitives = (items: IButton[], button: IButton) => {
    if (items.length !== 0 && [',', '.'].includes(items[items.length - 1].text)) return items;

    if (items.length === 0 || ['(', ')'].includes(items[items.length - 1].text) || items[items.length - 1].type === 'number') { 
        return items.concat(button);
    }
    else if (items[items.length - 1].type === 'symbol') {
        return [...items.slice(0, items.length - 1), button];
    } 
    return items;
}

// 0 and 00
const addZero = (items: IButton[], button: IButton) => {
    if (items.length === 0 || (items.length > 0 &&
        (items[items.length - 1].type === 'number' ||
        items[items.length - 1].type === 'dot' ||
        items[items.length - 1].type === 'symbol') &&
        !(items.length === 1 && items[items.length - 1].text === '0'))
    ) {
        return items.concat(button);
    }
    return items;
}

export const calculatorButtons: IButton[] = [
    {
        text: 'C',
        type: 'special',
        func: () => [],
        input: addSymbol
    },
    {
        priority: 100,
        text: '√',
        type: 'symbol',
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];
            const newItem = {
                text: Math.sqrt(Number(items[idx + 1].text)).toString(),
                type: 'number',
                input: addNumber
            }
            if (!isFinite(Number(newItem.text))) {
                newItem.type = 'error';
                newItem.text = 'Error';
            }
            return [
                ...items.slice(0, idx),
                newItem,
                ...items.slice(idx + 2)
            ]
        },
        input: (items: IButton[], btn: IButton) => {
            if (items.length === 0 || items[items.length - 1].type === 'symbol') {
                return items.concat({ ...btn });
            }
            return items;
        }
    },
    {
        priority: 90,
        text: '%',
        type: 'percent',
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];
            const newItem = {
                text: (Number(items[idx - 1].text) * 0.01).toString(),
                type: 'number',
                input: addNumber
            }
            return [
                ...items.slice(0, idx - 1),
                newItem,
                ...items.slice(idx + 1)
            ]
        },
        input: addSymbol
    },
    {
        priority: 90,
        text: '/',
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];
            const newItem = {
                text: (Number(items[idx - 1].text) / Number(items[idx + 1].text)).toString(),
                type: 'number',
                input: addNumber
            }
            if (!isFinite(Number(newItem.text))) {
                newItem.type = 'error';
                newItem.text = 'Infinity';
            }
            return [
                ...items.slice(0, idx - 1),
                newItem,
                ...items.slice(idx + 2)
            ]
        },
        type: 'symbol',
        input: addSymbol
    },
    { text: '7', type: 'number', input: addNumber },
    { text: '8', type: 'number', input: addNumber },
    { text: '9', type: 'number', input: addNumber },
    {
        priority: 90,
        text: '×',
        type: 'symbol',
        input: addSymbol,
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];

            const newItem = {
                text: (Number(items[idx - 1].text) * Number(items[idx + 1].text)).toString(),
                type: 'number',
                input: addNumber
            }
            return [
                ...items.slice(0, idx - 1),
                newItem,
                ...items.slice(idx + 2)
            ]
        }
    },
    { text: '4', type: 'number', input: addNumber },
    { text: '5', type: 'number', input: addNumber },
    { text: '6', type: 'number', input: addNumber },
    {
        priority: 80,
        text: '-',
        type: 'symbol',
        input: addPrimitives,
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];

            // if first -> invert the sign
            if (idx === 0) {
                const newItem = {
                    text: (Number(items[idx + 1].text) * -1).toString(),
                    type: 'number',
                    input: addNumber
                }
                return [newItem, ...items.slice(2)]
            }

            const newItem = {
                text: (Number(items[idx - 1].text) - Number(items[idx + 1].text)).toString(),
                type: 'number',
                input: addNumber
            }
            return [
                ...items.slice(0, idx - 1),
                newItem,
                ...items.slice(idx + 2)
            ]
        }
    },
    { text: '1', type: 'number', input: addNumber },
    { text: '2', type: 'number', input: addNumber },
    { text: '3', type: 'number', input: addNumber },
    {
        priority: 80,
        text: '+',
        type: 'symbol',
        input: addPrimitives,
        func: (items?: IButton[], idx?: number) => {
            if (!items || idx === undefined) return [];

            if (idx === 0) {
                return items.slice(1)
            }

            const newItem = {
                text: (Number(items[idx - 1].text) + Number(items[idx + 1].text)).toString(),
                type: 'number',
                input: addNumber
            }
            return [
                ...items.slice(0, idx - 1),
                newItem,
                ...items.slice(idx + 2)
            ]
        }
    },
    { text: '0', type: 'number', input: addZero },
    {
        text: '00',
        type: 'number',
        input: (items: IButton[], button: IButton) => {
            const oneZero = { ...button, text: '0' };
            return addZero(addZero(items, oneZero), oneZero);
        }
    },
    {
        text: ',',
        type: 'dot',
        input: (btns: IButton[], btn: IButton) => {
            const prev = btns[btns.length - 1];
            if (prev && prev.type === 'number' && prev.text !== ',') {
                return [...btns, btn];
            }
            return btns;
        }
    },
    {
        text: '.',
        type: 'dot',
        ignore: true,
        input: (btns: IButton[], btn: IButton) => {
            const prev = btns[btns.length - 1];
            if (prev && prev.type === 'number' && prev.text !== ',') {
                return [...btns, btn];
            }
            return btns;
        }
    },
    {
        text: '=',
        type: 'special',
        input: (items: IButton[]) => true,
        func: (items?: IButton[], _idx?: number, buttons?: IButton[]) => calculate(items, buttons)
    },
    {
        text: ')',
        input: addParenthesisRight,
        type: 'parenthesis',
        ignore: true,
    },
    {
        text: '(',
        input: addParenthesisLeft,
        type: 'parenthesis',
        ignore: true,
    },
]

export const createSymbol = (str: string | number) => {
    const btn = calculatorButtons.find(el => el.text === str.toString());
    return (btn && { ...btn }) ?? { text: 'Error', type: 'error' };
}

export const createNaN = () => {
    return {
        text: 'NaN',
        type: 'number',
        input: addNumber
    }
}

export const createError = () => {
    return {
        text: 'Error',
        type: 'error'
    }
}

export const createNumber = (nums: number): IButton => {
    return {
        text: nums.toString(),
        type: 'number',
        input: addNumber
    }
}