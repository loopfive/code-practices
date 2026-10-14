# TypeScript coding practices

Standard guidelines and conventions to be followed by developers throughout the software development lifecycle

This document outlines the standard guidelines and conventions to be followed by developers throughout the software development lifecycle. 

These practices aim to ensure code quality, readability, maintainability, and consistency across projects within the organization.

These recommandations are based on TypeScript documentation, articles, and professional experience.

## Table of contents

1. [Invoking component functions directly](#invoking-component-functions-directly)
2. [Nesting component definitions](#nesting-component-definitions)
3. [When to use useMemo and useCallback](#when-to-use-usememo-and-usecallback)
4. [Use template literals to combine strings](#use-template-literals-to-combine-strings)
5. [Use === instead of ==](#use--instead-of-)
6. [Use meaningful variable names](#use-meaningful-variable-names)
7. [Use the same vocabulary for the same type of variable](#use-the-same-vocabulary-for-the-same-type-of-variable)
8. [Use default arguments instead of conditionals](#use-default-arguments-instead-of-conditionals)
9. [Function arguments and Type Aliases](#function-arguments-and-type-aliases)
10. [Functions should do one thing](#functions-should-do-one-thing)
11. [Favor functional programming over imperative programming](#favor-functional-programming-over-imperative-programming)
12. [Encapsulate conditionals](#encapsulate-conditionals)
13. [Avoid negative conditionals](#avoid-negative-conditionals)
14. [Avoid type checking](#avoid-type-checking)
15. [Remove dead code](#remove-dead-code)
16. [Don't leave commented out code in your codebase](#dont-leave-commented-out-code-in-your-codebase)
17. [TODO comments](#todo-comments)
18. [Imports - TypeScript aliases](#imports---typescript-aliases)
19. [Always use curly braces for conditional statements](#always-use-curly-braces-for-conditional-statements)
20. [Extract inline type definitions into proper type declarations](#extract-inline-type-definitions-into-proper-type-declarations)
21. [Limit to one ternary operator per function](#limit-to-one-ternary-operator-per-function)
22. [Constants and functions must be declared before return statements](#constants-and-functions-must-be-declared-before-return-statements)
23. [Object destructuring for function parameters](#object-destructuring-for-function-parameters)
24. [Never use the `any` type](#never-use-the-any-type)
25. [Extract Magic Numbers and Non-Self-Explanatory Values into Constants](#extract-magic-numbers-and-non-self-explanatory-values-into-constants)
26. [Avoid magic strings](#avoid-magic-strings)
27. [Comment only what the code can't say](#comment-only-what-the-code-cant-say)

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

## When to use useMemo and useCallback


❌ Avoid


```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  // Unnecessary memoization - no expensive computation
  const displayName = useMemo(() => {
    return user ? `${user.firstName} ${user.lastName}` : 'Guest';
  }, [user]);

  // Unnecessary callback - not passed to a memoized child
  const handleClick = useCallback(() => {
    console.log('Profile clicked');
  }, []);

  return (
    <div onClick={handleClick}>
      <h1>{displayName}</h1>
    </div>
  );
}
```


✅ Prefer


```typescript
function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);

  // Simple string concatenation - no memoization needed
  const displayName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

  // Simple function - no memoization needed
  const handleClick = () => {
    console.log('Profile clicked');
  };

  return (
    <div onClick={handleClick}>
      <h1>{displayName}</h1>
    </div>
  );
}
```


✅ When to actually use them


```typescript
function ProductList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('');

  // useMemo: expensive filtering operation on a potentially large list
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(filter.toLowerCase())
    ).sort((a, b) => a.price - b.price);
  }, [products, filter]);

  // useCallback: function passed to memoized child component
  const handleProductClick = useCallback((productId: string) => {
    console.log('Product clicked:', productId);
  }, []);

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      {filteredProducts.map(product => (
        <MemoizedProductItem
          key={product.id}
          product={product}
          onClick={handleProductClick}
        />
      ))}
    </div>
  );
}

const MemoizedProductItem = React.memo(ProductItem);
```


#### 🤔 ℹ️ Explanation


`useMemo` and `useCallback` are optimization tools that come with their own overhead. Only use them when:

**For useMemo:**
- You're performing expensive calculations or transformations
- You're working with large lists or arrays that need filtering, sorting, or mapping
- The computation is noticeably impacting performance

**For useCallback:**
- You're passing the function as a prop to a memoized child component (using `React.memo`)
- The function is used as a dependency in other hooks like `useEffect` or `useMemo`

**Don't use them when:**
- Performing simple operations like string concatenation or basic arithmetic
- The component rarely re-renders
- The overhead of memoization exceeds the performance benefit
- You're just creating event handlers for DOM elements (not passing to memoized children)

Remember: Premature optimization is the root of all evil. Only optimize when you have measured performance issues.


#### 📚 References


- [React Documentation - useMemo](https://react.dev/reference/react/useMemo)
- [React Documentation - useCallback](https://react.dev/reference/react/useCallback)
- [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)

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

## Always use curly braces for conditional statements

❌ Avoid

```typescript
if (true) doSomething();

if (user.isActive)
  processUser(user);

if (isValid)
  return result;
else
  return null;
```

✅ Prefer

```typescript
if (true) {
  doSomething();
}

if (user.isActive) {
  processUser(user);
}

if (isValid) {
  return result;
} else {
  return null;
}
```

#### 🤔 ℹ️ Explanation 

Using curly braces for all conditional statements, even single-line ones, improves code readability and prevents errors when adding additional statements later.
It maintains consistency across the codebase and reduces the risk of introducing bugs during refactoring.
This practice helps avoid issues with automatic semicolon insertion and makes the code structure more explicit.

#### 📚 References

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript#blocks--braces)
- [ESLint curly rule](https://eslint.org/docs/rules/curly)

## Extract inline type definitions into proper type declarations

❌ Avoid

```typescript
function createUser({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
}) {
  // ...
}

function updateProduct({
  id,
  title,
  price,
  isAvailable,
}: {
  id: number;
  title: string;
  price: number;
  isAvailable: boolean;
}) {
  // ...
}
```

✅ Prefer

```typescript
type CreateUserParams = {
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
};

function createUser({
  name,
  email,
  role,
}: CreateUserParams) {
  // ...
}

type UpdateProductParams = {
  id: number;
  title: string;
  price: number;
  isAvailable: boolean;
};

function updateProduct({
  id,
  title,
  price,
  isAvailable,
}: UpdateProductParams) {
  // ...
}
```

#### 🤔 ℹ️ Explanation 

Extracting inline type definitions into proper type declarations improves code readability and reusability.
It makes the function signature cleaner and easier to understand at a glance.
Named types can be reused across multiple functions and exported for use in other modules.
This practice also makes it easier to extend or modify the type definition in the future.

#### 📚 References

- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [TypeScript Handbook - Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

## Limit to one ternary operator per function

❌ Avoid

```typescript
function getUserStatus(user: User, isLoading: boolean, hasError: boolean) {
  return user && user.isActive && !isLoading ? (
    'Active User'
  ) : isLoading ? (
    'Loading...'
  ) : hasError ? (
    'Error occurred'
  ) : (
    'Inactive User'
  );
}

function calculateDiscount(price: number, isMember: boolean, isPremium: boolean) {
  return isMember ? (
    isPremium ? price * 0.8 : price * 0.9
  ) : price;
}
```

✅ Prefer

```typescript
function getUserStatus(user: User, isLoading: boolean, hasError: boolean) {
  if (isLoading) {
    return 'Loading...';
  }
  
  if (hasError) {
    return 'Error occurred';
  }
  
  if (user && user.isActive) {
    return 'Active User';
  }
  
  return 'Inactive User';
}

function calculateDiscount(price: number, isMember: boolean, isPremium: boolean) {
  if (!isMember) {
    return price;
  }
  
  const discountRate = isPremium ? 0.8 : 0.9;
  return price * discountRate;
}
```

#### 🤔 ℹ️ Explanation 

Multiple or nested ternary operators significantly reduce code readability and make logic harder to follow.
Using if-else statements or early returns makes the code more explicit and easier to understand.
This practice improves debugging experience since each condition can be easily identified and tested.
Complex ternary chains are prone to errors and make code maintenance more difficult.

#### 📚 References

- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [ESLint no-nested-ternary rule](https://eslint.org/docs/rules/no-nested-ternary)

## Constants and functions must be declared before return statements

❌ Avoid

```typescript
function processOrder(order: Order) {
  if (!order.isValid) {
    const errorMessage = 'Invalid order';
    return { success: false, message: errorMessage };
  }
  
  const calculateTax = (amount: number) => amount * 0.1;
  const total = order.amount + calculateTax(order.amount);
  
  if (total > 1000) {
    const discountRate = 0.05;
    return { 
      success: true, 
      total: total - (total * discountRate),
      discount: true 
    };
  }
  
  const shippingCost = 15;
  return { 
    success: true, 
    total: total + shippingCost,
    discount: false 
  };
}
```

✅ Prefer

```typescript
function processOrder(order: Order) {
  const errorMessage = 'Invalid order';
  const discountRate = 0.05;
  const shippingCost = 15;
  
  const calculateTax = (amount: number) => amount * 0.1;
  
  if (!order.isValid) {
    return { success: false, message: errorMessage };
  }
  
  const total = order.amount + calculateTax(order.amount);
  
  if (total > 1000) {
    return { 
      success: true, 
      total: total - (total * discountRate),
      discount: true 
    };
  }
  
  return { 
    success: true, 
    total: total + shippingCost,
    discount: false 
  };
}
```

#### 🤔 ℹ️ Explanation 

Declaring constants and helper functions at the top of the function improves code readability and organization.
It makes all dependencies and configuration values immediately visible when reading the function.
This practice reduces cognitive load by separating data definitions from business logic.
It also prevents scattered declarations throughout the function which can make the code harder to follow and maintain.

#### 📚 References

- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [JavaScript best practices - Variable declarations](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#declarations)

## Object destructuring for function parameters

❌ Avoid
```typescript
function distributeIntoRows(duplicatedItems, rowCount, fillEmpty, sortBySize) {
  // Implementation
}

// Usage - unclear what each parameter represents
const rows = distributeIntoRows(items, 3, true, false);
```

✅ Prefer
```typescript
interface DistributeOptions {
  duplicatedItems: any[];
  rowCount: number;
  fillEmpty?: boolean;
  sortBySize?: boolean;
}

function distributeIntoRows({duplicatedItems, rowCount, fillEmpty = false, sortBySize = true}: DistributeOptions) {
  // Implementation
}

// Usage - self-documenting and order-independent
const rows = distributeIntoRows({
  duplicatedItems: items,
  rowCount: 3,
  fillEmpty: true,
  sortBySize: false
});
```

#### 🤔 ℹ️ Explanation 
Parameter order matters with positional arguments - easy to make mistakes.
Adding optional parameters becomes messy and breaks existing calls.
Function calls are self-documenting when using object destructuring.
Refactoring is safer since parameter order doesn't matter.

#### 📚 References
- [Clean Code: Function Arguments](https://github.com/ryanmcdermott/clean-code-javascript#function-arguments-2-or-fewer-ideally)
- [JavaScript Clean Coding Best Practices](https://blog.risingstack.com/javascript-clean-coding-best-practices-node-js-at-scale/)

## Never use the `any` type

❌ Avoid

```typescript
let value: any = "hello";
function process(input: any) {
  // ...
}
```

✅ Prefer

```typescript
let value: string = "hello";
function process(input: string) {
  // ...
}
```

#### 🤔 ℹ️ Explanation

Using `any` defeats the purpose of TypeScript's static type checking and removes all type safety. Always specify a more precise type. If you are unsure, use `unknown` or a union of possible types, but never use `any`.

#### 📚 References

- [TypeScript Handbook: any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

## Extract Magic Numbers and Non-Self-Explanatory Values into Constants

❌ Avoid

```typescript
tabIndex={disabled ? -1 : 0}

const maxRetries = 999;

const padding = '16px';
const borderRadius = '8px';
```

✅ Prefer

```typescript
const TAB_INDEX = {
    DISABLED: -1,
    ENABLED: 0,
} as const;

tabIndex={disabled ? TAB_INDEX.DISABLED : TAB_INDEX.ENABLED}

const RETRY_CONFIG = {
    MAX_ATTEMPTS: 3,
    TIMEOUT_MS: 5000,
} as const;

const SPACING = {
    SMALL: '8px',
    MEDIUM: '16px',
    LARGE: '24px',
} as const;

const BORDER_RADIUS = {
    SMALL: '4px',
    MEDIUM: '8px',
    LARGE: '16px',
} as const;
```

#### 🤔 ℹ️ Explanation

Magic numbers and unexplained values are hard to understand and maintain. Named constants make the semantic meaning explicit and make code self-documenting. Use descriptive constant names that express intent, not just the value.

#### 📚 References

- [Code Readability Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [Clea Code: Magic Numbers](https://en.wikipedia.org/wiki/Magic_number_(programming))

## Avoid magic strings

❌ Avoid

```typescript
function getStatusLabel(isActive: boolean): string {
  return isActive ? 'active' : 'inactive';
}

function handleResponse(status: string) {
  if (status === 'success') {
    showNotification('Operation completed successfully');
  } else if (status === 'error') {
    showNotification('Something went wrong');
  }
}
```

✅ Prefer

```typescript
enum StatusLabel {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

function getStatusLabel(isActive: boolean): string {
  return isActive ? StatusLabel.ACTIVE : StatusLabel.INACTIVE;
}

enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

function handleResponse(status: ResponseStatus) {
  if (status === ResponseStatus.SUCCESS) {
    showNotification('Operation completed successfully');
  } else if (status === ResponseStatus.ERROR) {
    showNotification('Something went wrong');
  }
}
```

#### 🤔 ℹ️ Explanation

Magic strings are raw string literals used directly in code without being assigned to a named constant or enum.
They make code fragile because a typo in a string won't be caught by the compiler, whereas a misspelled enum member will.
Using enums or constants provides a single source of truth, enables autocompletion, and makes refactoring safe since renaming a value only requires changing it in one place.

#### 📚 References

- [Clean code TypeScript](https://github.com/labs42io/clean-code-typescript)
- [TypeScript Handbook - Enums](https://www.typescriptlang.org/docs/handbook/enums.html)

## Comment only what the code can't say

❌ Avoid

```typescript
/** The props of the materials table. */
type MaterialRowProps = {
  /** The material to show. */
  material: ProjectMaterial;
};

/** Removes a material from the project. */
const removeMaterial = async (material: ProjectMaterial) => {
  // Set the loading state.
  setRemovingId(material.id);

  try {
    // Call the API.
    await deleteMaterial({ projectId, id: material.id });
  } finally {
    setRemovingId(null);
  }
};
```

✅ Prefer

```typescript
type MaterialRowProps = {
  material: ProjectMaterial;
};

const removeMaterial = async (material: ProjectMaterial) => {
  // TanStack reports `isPending` a tick late: a double click would remove it twice.
  if (removing.current) {
    return;
  }

  removing.current = true;

  try {
    await deleteMaterial({ projectId, id: material.id });
  } finally {
    removing.current = false;
  }
};
```

#### 🤔 ℹ️ Explanation

A comment earns its place only when it tells the reader something the code can't: why a non-obvious choice was made, a constraint from outside the code (a library quirk, a business rule, a bug it works around), or a trap the next person would fall into.

- No comment that repeats the name or the next line ("Removes a material", "Call the API").
- No JSDoc by default on functions, types, props, constants or hooks. A good name and a typed signature are the documentation. Add JSDoc only to explain behaviour a caller can't guess from the signature.
- No narrative comments describing the steps of a function, and no comments addressed to a reviewer ("fixed", "now also handles…").
- Default to no comment. When in doubt, rename or extract instead.
- This holds even when the surrounding code is heavily commented: don't match its density, match this rule.

Comments go stale silently: the code changes, the comment doesn't, and it starts lying. Every comment is a line to maintain, so keep only the ones that would cost the reader real time to rediscover.

#### 📚 References

- [Clean code TypeScript: Comments](https://github.com/labs42io/clean-code-typescript#comments)
