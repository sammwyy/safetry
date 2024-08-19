# 🔒 Safetry

Safe and structured error handling for JavaScript.

## ⚡ Features

- 🔄 Safe error handling for synchronous and asynchronous functions
- 🔍 Supports `try/catch` for both sync and async operations
- 🎯 Clear separation between success and failure using `Result<T, E>`
- 🛠 Compatible with Promises
- 📦 Easy integration with existing codebases
- 💡 Inspired by Rust’s error-handling model

## 📦 Install

```bash
# Using npm
npm install safetry

# Using yarn
yarn add safetry

# Using pnpm
pnpm add safetry

# Using bun
bun add safetry
```

## 📋 Usage

### Basic Example

Wraps synchronous or asynchronous functions with safe error handling.

```ts
import { safeTry } from 'safetry';

const [result, error] = safeTry(() => {
  throw new Error("This is an error");
});
```

### Wrapping a function

Wraps a function to handle errors safely, and can be used with both synchronous and asynchronous functions.

```ts
import { wrapTry } from 'safetry';

// Unsafe synchronous function
function unsafeSyncAction(value: string): string {
  if (value === "") throw new Error("Value is empty");
  return value.trim();
}

const safeAction = wrapTry(unsafeSyncAction);
const [result, error] = safeAction("  Hello World  ");

if (error) {
  console.error(error.message);
} else {
  console.log(result); // "Hello World"
}
```

## 📗 API

### `safeTry(fn: () => T): Result<T, Error>`

- **Description**: Directly executes a function or block of code inside error handling. Ideal for quick, inline code execution.
- **Parameters**:
  - `fn`: A synchronous function to be executed.
- **Returns**: A tuple `[result, error]`.

### `wrapTry<T, E>(fn: (...args: any[]) => T | Promise<T>): (...args: any[]) => Promise<Result<T, E>>`

- **Description**: Wraps a given function (synchronous or asynchronous) in safe error handling. Returns a function that handles errors and returns a Promise.
- **Parameters**:
  - `fn`: A function to be wrapped that returns a value or a Promise.
- **Returns**: A function that returns a Promise containing a tuple `[result, error]`.

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/sammwyy/safetry/issues).

## ❤️ Show your support

Give a ⭐️ if this project helped you! Or buy me a coffeelatte 🙌 on [Ko-fi](https://ko-fi.com/sammwy)

## 📝 License

Copyright © 2024 [Sammwy](https://github.com/sammwyy). This project is [MIT](LICENSE) licensed.
