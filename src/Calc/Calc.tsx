import React, { useEffect, useRef, useState } from 'react'
import { calculatorButtons, createSymbol, IButton } from '../utils/Buttons';

import './Calc.scss'

export const Calc = () => {
    const [primer, setPrimer] = useState<IButton[]>([]);
    /**
     * handle button input
     * @param button button entered
     */
    const enter = (button: IButton) => {
        if (button.type === 'special' && button.func) {
            return setPrimer((primer) => {
                return button.func ? button.func(primer, -1, calculatorButtons) : [];
            });
            
        }
        setPrimer((items) => {
            let newItems: IButton[];
            if (primer.findIndex(el => el.type === 'error') !== -1) {
                newItems = [];
            } else {
                newItems = items;
            }
            return button.input(newItems, button)
        });
    }

    /**
     * conditions of pushing a key on a keyboard
     * @param e keyboard event
     */
    const enterFromKeyboard = (e: KeyboardEvent) => {
        (e.target as HTMLButtonElement)?.blur();
        switch (e.key) {
            case 'Backspace':
                setPrimer(primer => primer.slice(0, primer.length - 1));
                break;
            case '*': {
                enter(createSymbol('×'));
                break;
            }
            case '.': {
                enter(createSymbol(','));
                break;
            }
            case 'Enter': {
                enter(createSymbol('='));
                break;
            }
            case 'Escape': {
                enter(createSymbol('C'));
                break;
            }
        }

        if (calculatorButtons.find(el => el.text === e.key)) {
            enter(createSymbol(e.key));
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
                        {calculatorButtons.filter(btn => !btn.ignore).map((button, idx) => (
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
