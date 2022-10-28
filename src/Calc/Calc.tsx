import React, { useEffect, useRef, useState } from 'react'
import { calculatorButtons, IButton } from '../utils/Buttons';

import './Calc.scss'

const { renderedButtons: buttons, leftParenthesis, rightParenthesis } = calculatorButtons;

export const Calc = () => {
    const [primer, setPrimer] = useState<IButton[]>([]);
    /**
     * handle button input
     * @param button button entered
     */
    const enter = (button: IButton) => {
        const btnCopy = { ...button };
        if (button.type === 'special' && button.func) {
            setPrimer(button.func());
        }
        setPrimer((items) => {
            let newItems: IButton[];
            if (primer.findIndex(el => el.type === 'error') !== -1) {
                newItems = [];
            } else {
                newItems = items;
            }
            return button.input(newItems, btnCopy)
        });
    }

    /**
     * conditions of pushing a key on a keyboard
     * @param e keyboard event
     */
    const enterFromKeyboard = (e: KeyboardEvent) => {
        (e.target as HTMLButtonElement)?.blur();
        switch (e.key) {
            case '(':
                enter(leftParenthesis);
                break;
            case ')':
                enter(rightParenthesis);
                break;
            case 'Backspace':
                setPrimer(primer => primer.slice(0, primer.length - 1));
                break;
            case '*': {
                const symb: IButton | undefined = buttons.find(el => el.text === '×');
                if (symb) {
                    enter(symb);
                }
                break;
            }
            case '.': {
                const symb = buttons.find(el => el.text === ',');
                if (symb) {
                    enter(symb);
                }
                break;
            }
            case 'Enter':
            case '=': {
                const eq = buttons.find(el => el.text === '=');
                if (eq?.func) {
                    setPrimer(eq.func(primer, -1, buttons));
                }
                break;
            }
            case 'Escape': {
                const symb = buttons.find(el => el.text === 'C');
                if (symb) {
                    enter(symb);
                }
                break;
            }
            case buttons.filter(b => b.type === 'number' || b.type === 'symbol').find(b => b.text === e.key)?.text: {
                const symb = buttons.find(el => el.text === e.key);
                if (symb) {
                    enter(symb);
                }
                break;
            }
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', enterFromKeyboard);
        return () => {
            document.removeEventListener('keydown', enterFromKeyboard);
        }
    });

    const primerRef = useRef<HTMLDivElement>(null);

    /**
     * scroll to the last element every click because could be overflown
     */
    useEffect(() => {
        if (primerRef.current) {
            primerRef.current.scroll({
                left: primerRef.current.scrollWidth
            })
        }
    }, [primer]);

    return (
        <div className="Calc">
            <div className="Calc__Wrapper">
                <div className="Calc__Inner">
                    <div className="Calc__Solved">
                        -
                    </div>
                    <div ref={primerRef} className="Calc__Primer">
                        {primer.length !== 0 ? primer.map(el => el.text) : '0'}
                    </div>
                    <div className="Calc__Divider" />
                    <div className="Calc__Grid">
                        {buttons.filter(btn => !btn.ignore).map((button, idx) => (
                            <button
                                key={idx}
                                onClick={() => enter(button)}
                                className="Calc__Button">
                                {button.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
