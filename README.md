# A calculator made with TS/React

![image](https://user-images.githubusercontent.com/26363834/198832750-5d52cecb-0dae-443b-a68c-f6e183c30f1c.png)

This is a test project to byndysoft

## Start project
1. Clone repository
2. `npm i && npm run dev`

## Linters
The project uses ESLint, the settings are in .eslintrc.json

## Testing
The project tested with **vitest**, which is really similar to **Jest**
To run:
1. npm run test

## Stack
React
SCSS
Typescript
vite
vitest

## Architecture
The 'buttons' in the calculator are primitive objects with several props:
```
interface IButton {
    text: string
    type: string 
    func?: (items?: IButton[], idx?: number, buttons?: IButton[]) => IButton[]
    input: (items: IButton[], button: IButton) => IButton[]
    priority?: number
    ignore?: boolean
}
```

1. text: string

text value of button (1, 2, *, +)

2. type: string

type (number, symbol, parenthesis)

3. func?: (items?: IButton[], idx?: number, buttons?: IButton[]) => IButton[]

changes the input array of symbols and returns the new one

4. input: (items: IButton[], button: IButton) => IButton[]

defines whether is it allowed to add a symbol

5. priority?: number

the priority of symbols (ex: priority of multiplication is 100, addition has 80)

6. ignore?: boolean

whether to show button in the calculator or not

### Add new symbol
1. add the new item to `calculatorsButton` array and define all the required fileds
2. modify the existent symbols if their behavior needed to change (ex: allow to add numbers after your new symbol)


