# TypeScript coding practices

Standard guidelines and conventions to be followed by developers throughout the software development lifecycle

This document outlines the standard guidelines and conventions to be followed by developers throughout the software development lifecycle. 

These practices aim to ensure code quality, readability, maintainability, and consistency across projects within the organization.

These recommandations are based on TypeScript documentation, articles, and professional experience.

## Table of contents

1. [Invoking component functions directly](#invoking-component-functions-directly)
2. [Nesting component definitions](#nesting-component-definitions)
3. [Use template literals to combine strings](#use-template-literals-to-combine-strings)
4. [Use === instead of ==](#use--instead-of-)
5. [Use meaningful variable names](#use-meaningful-variable-names)
6. [Use the same vocabulary for the same type of variable](#use-the-same-vocabulary-for-the-same-type-of-variable)
7. [Use default arguments instead of conditionals](#use-default-arguments-instead-of-conditionals)
8. [Function arguments and Type Aliases](#function-arguments-and-type-aliases)
9. [Functions should do one thing](#functions-should-do-one-thing)
10. [Favor functional programming over imperative programming](#favor-functional-programming-over-imperative-programming)
11. [Encapsulate conditionals](#encapsulate-conditionals)
12. [Avoid negative conditionals](#avoid-negative-conditionals)
13. [Avoid type checking](#avoid-type-checking)
14. [Remove dead code](#remove-dead-code)
15. [Don't leave commented out code in your codebase](#dont-leave-commented-out-code-in-your-codebase)
16. [TODO comments](#todo-comments)
17. [Imports - TypeScript aliases](#imports---typescript-aliases)


## Invoking component functions directly


❌ Avoid


```typescript
export const EmailField = () => {
  const [email, setEmail] = useState("");

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}


function App() {
  return (
    <div>{EmailField()}</div>
  )
}
```


✅ Prefer


```typescript
export const EmailField = () => {
  const [email, setEmail] = useState("");

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}

function App() {
  return (
    <div>
      <EmailField />
    </div>
  )
}
```


#### 🤔 ℹ️ Explanation 


We have turned our component into a custom hook.
We lose the encapsulation of rerender.
The whole App component will rerender when the EmailField changes instead of only the single component.
Additionally, if we conditionally render the custom hook, we will face a runtime error saying that we rendered more hooks than the previous render.


#### 📚 References


- [3 React Mistakes, 1 App Killer](https://www.youtube.com/watch?v=QuLfCUh-iwI)


## Nesting component definitions


❌ Avoid


```typescript
function App() {
  const EmailField = () => {
    const [email, setEmail] = useState("");

    return (
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    );
  }

  return (
    <div>
      {EmailField()}
    </div>
  )
}
```


✅ Prefer


```typescript
export const EmailField = () => {
  const [email, setEmail] = useState("");

  return (
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}

function App() {
  return (
    <div>
      <EmailField />
    </div>
  )
}
```


#### 🤔 ℹ️ Explanation 


Component code gets easily bloated.
Impossible to unit test EmailField in isolation.
Possible performance problems.
Closure state leakage problem.


#### 📚 References


- [3 React Mistakes, 1 App Killer](https://www.youtube.com/watch?v=QuLfCUh-iwI)

## Use template literals to combine strings


❌ Avoid


```typescript
const world = 'world';

const myString = 'hello' + world;
```


✅ Prefer


```typescript
const world = 'world';

const myString = `hello ${world}`;
```


#### 🤔 ℹ️ Explanation 


Enhances code readability and maintainability by avoiding long string concatenation. 


#### 📚 References


- [15 Javascript Tips: best practices to simplify your code](https://www.educative.io/blog/javascript-tips-simplify-code)


## Use === instead of ==


❌ Avoid


```typescript
const num1 = 10;
const num2 = '10';

console.log(num1 == num2) // evaluates to true
```


✅ Prefer


```typescript
const num1 = 10;
const num2 = '10';

console.log(num1 === num2) // evaluates to false
```


#### 🤔 ℹ️ Explanation 


=== performs a strict equality check, which not only compares the values of two operands but also their types.

== performs type coercion, which can lead to unexpected behaviours.


#### 📚 References


- [45 Useful JavaScript tips, tricks and best practices](https://modernweb.com/45-javascript-tips-tricks-practices/)


## Use meaningful variable names


❌ Avoid


```typescript
function between<T>(a1: T, a2: T, a3: T): boolean {
  return a2 <= a1 && a1 <= a3;
}
```


✅ Prefer


```typescript
function between<T>(value: T, left: T, right: T): boolean {
  return left <= value && value <= right;
}
```


#### 🤔 ℹ️ Explanation 


Distinguish names in such a way that the reader knows what the differences offer.
This helps for code readability and maintainability.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
## Use the same vocabulary for the same type of variable


❌ Avoid


```typescript
function getUserInfo(): User;
function getUserDetails(): User;
function getUserData(): User;
```


✅ Prefer


```typescript
function getUser(): User;
```


#### 🤔 ℹ️ Explanation 


Enhances code readability and maintainability by removing ambiguity and adding clarity.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Use default arguments instead of conditionals


❌ Avoid


```typescript
function loadPages(count?: number) {
  const loadCount = count !== undefined ? count : 10;
  // ...
}
```


✅ Prefer


```typescript
function loadPages(count: number = 10) {
  // ...
}
```


#### 🤔 ℹ️ Explanation 


More expressive and self-documenting function declaration.
Helps code readability by eliminating the analysis of conditional logic.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Function arguments and Type Aliases


❌ Avoid


```typescript
function createMenu(title: string, body: string, buttonText: string, cancellable: boolean) {
  // ...
}
 
createMenu('Foo', 'Bar', 'Baz', true);
```


✅ Prefer


```typescript
type MenuOptions = {
  title: string,
  body: string,
  buttonText: string,
  cancellable: boolean
};
 
function createMenu(options: MenuOptions) {
  // ...
}
 
createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true
});
```


#### 🤔 ℹ️ Explanation 


Type Aliases
Immediately clear what properties can/should be used by the function.
Reduces cognitive load when reading the function definition.
TypeScript warns you about unused properties.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
## Functions should do one thing


❌ Avoid


```typescript
function emailActiveClients(clients: Client[]) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```


✅ Prefer


```typescript
function emailActiveClients(clients: Client[]) {
  clients.filter(isActiveClient).forEach(email);
}
 
function isActiveClient(client: Client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```


#### 🤔 ℹ️ Explanation 


If not done properly, functions are harder to compose, test and read.
Improves maintainability since the functions are easier to refactor.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Favor functional programming over imperative programming


❌ Avoid


```typescript
const contributions = [
  {
    name: 'Uncle Bobby',
    linesOfCode: 500
  }, {
    name: 'Suzie Q',
    linesOfCode: 1500
  }
];
 
let totalOutput = 0;
 
for (let i = 0; i < contributions.length; i++) {
  totalOutput += contributions[i].linesOfCode;
}
```


✅ Prefer


```typescript
const contributions = [
  {
    name: 'Uncle Bobby',
    linesOfCode: 500
  }, {
    name: 'Suzie Q',
    linesOfCode: 1500
  }
];
 
const totalOutput = contributions
  .reduce((totalLines, output) => totalLines + output.linesOfCode, 0);
```


#### 🤔 ℹ️ Explanation 


JavaScript already has optimized array methods, make use of them! (no need to reinvent the wheel 🛞)


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Encapsulate conditionals


❌ Avoid


```typescript
if (subscription.isTrial || account.balance > 0) {
  // ...
}
```


✅ Prefer


```typescript
function canActivateService(subscription: Subscription, account: Account) {
  return subscription.isTrial || account.balance > 0;
}
 
if (canActivateService(subscription, account)) {
  // ...
}
```


#### 🤔 ℹ️ Explanation 


Helps for code readability and maintainability.
If the conditions for the Boolean change in the future, we only need to refactor the function that handles this piece of logic.
If the function can be exported as a pure JavaScript, even better.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Avoid negative conditionals


❌ Avoid


```typescript
function isEmailNotUsed(email: string): boolean {
  // ...
}
 
if (isEmailNotUsed(email)) {
  // ...
}
```


✅ Prefer


```typescript
function isEmailUsed(email: string): boolean {
  // ...
}
 
if (!isEmailUsed(email)) {
  // ...
}
```


#### 🤔 ℹ️ Explanation 


Code is less prone to errors.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
## Avoid type checking


❌ Avoid


```typescript
function travelToTexas(vehicle: Bicycle | Car) {
  if (vehicle instanceof Bicycle) {
    vehicle.pedal(currentLocation, new Location('texas'));
  } else if (vehicle instanceof Car) {
    vehicle.drive(currentLocation, new Location('texas'));
  }
}
```


✅ Prefer


```typescript
type Vehicle = Bicycle | Car;
 
function travelToTexas(vehicle: Vehicle) {
  vehicle.move(currentLocation, new Location('texas'));
}
```


#### 🤔 ℹ️ Explanation 


TypeScript is a strict syntactical superset of JavaScript and adds optional static type checking to the language.
Always prefer to specify types of variables, parameters and return values to leverage the full power of TypeScript features.

It makes refactoring easier.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Remove dead code


❌ Avoid


```typescript
function oldRequestModule(url: string) {
  // ...
}
 
function requestModule(url: string) {
  // ...
}
 
const req = requestModule;
inventoryTracker('apples', req, 'www.inventory-awesome.io');
```


✅ Prefer


```typescript
function requestModule(url: string) {
  // ...
}
 
const req = requestModule;
inventoryTracker('apples', req, 'www.inventory-awesome.io');
```


#### 🤔 ℹ️ Explanation 


Dead code is just as bad as duplicate code. There's no reason to keep it in your codebase.
If it's not being called, get rid of it! It will still be saved in your version history if you still need it.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## Don't leave commented out code in your codebase


❌ Avoid


```typescript
type User = {
  name: string;
  email: string;
  // age: number;
  // jobPosition: string;
}
```


✅ Prefer


```typescript
type User = {
  name: string;
  email: string;
}
```


#### 🤔 ℹ️ Explanation 


Version control exists for a reason.
Leave old code in your history.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)


## TODO comments


❌ Avoid


```typescript
function getActiveSubscriptions(): Promise<Subscription[]> {
  // ensure `dueDate` is indexed.
  return db.subscriptions.find({ dueDate: { $lte: new Date() } });
}
```


✅ Prefer


```typescript
function getActiveSubscriptions(): Promise<Subscription[]> {
  // TODO: ensure `dueDate` is indexed.
  return db.subscriptions.find({ dueDate: { $lte: new Date() } });
}
```


#### 🤔 ℹ️ Explanation 


Most IDE have special support for those kinds of comments so that you can quickly go over the entire list of todos.

🚨 TODO comments are not an excuse for bad code 🚨


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)

## Imports - TypeScript aliases


❌ Avoid


```typescript
import { UserService } from '../../../services/UserService';
```


✅ Prefer


```typescript
import { UserService } from '@services/UserService';

// tsconfig.json
...
"compilerOptions": {
  ...
  "baseUrl": "src",
  "paths": {
    "@services": ["services/*"]
  }
  ...
}
...
```


#### 🤔 ℹ️ Explanation 


This will avoid long relative paths when doing imports.


#### 📚 References


- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
