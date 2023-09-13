---
title: React
description: My notes on React, and useful links
---

React is the most widely used frontend JS library, with a huge ecosystem and lots of documentation/Stack Overflow answers.

## [Testing](https://www.robinwieruch.de/vitest-react-testing-library/)

I'll use Vitest for now since it's what Odin uses, but look into Bun/HappyDOM if I work on a big enough project that it might matter.

Key packages are `@testing-library/react` (for React-specific test helpers like `render()`), `@testing-library/jest-dom` (for custom DOM matchers) and `@testing-library/user-event` (a better version of the old `fireEvent` library which more accurately simulates user interaction).

- `render()`
  - renders the passed component into a container which is then appended to `document.body`
  - can pass a `container` option (if component is a tr or smth which can't render in a div) which should be an element appended to the body (won't be appended for you)
  - also `baseElement` which defaults to `document.body` or the passed container
  - returns
    - queries from the DOM testing library bound to the baseElement (accessed by {...queries}) (but better to use queries available on the `screen` object)
    - the container it was appended to `baseElement` in
    - the `baseElement`
    - an `unmount()` function which can be used to test what happens when the component unmounts
  - renders are unmounted after each test, so put them in a `beforeEach` hook if you're testing the same one/set

### [Queries](https://testing-library.com/docs/queries/about/)

- `getBy...` queries return a match if only one is found, and a descriptive error is 0 or more than one are found.
- `queryBy...` queries return a matching node if found, or null if not. Useful for asserting a node doesn't exist.
- `findBy...` queries which resolves when a matching node is found, or rejects after 1000ms. The All version resolves when any matches are found.

They all have `...AllBy` variants which will not error on more than one match, and will retrieve an array of matches instead.

Priority in using queries should be as follows to more closely mimic how users interact with your site:

1. `...ByRole`: takes a [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles) and often a name option (the alt/title/desc option, text content if none of those exist)
2. `...ByLabelText`: great for form fields
3. `...ByPlaceholderText`:
4. `...ByText`:
5. `...ByDisplayValue`: the current value of a form field

### [Simulating User Events](https://testing-library.com/docs/user-event/intro)

First setup a user with `const user = userEvent.setup()`, then await actions like `user.click()` as interactions are all async as of the latest version.

### [Snapshots](https://vitest.dev/guide/snapshot.html)

Used to store the full DOM tree of a rendered test component and compare future test runs to it. Probably handy once finalized for regression testing, but since it's _everything_ it's very likely to break at the slightest change and need to be recaptured.

On a related note, snapshots can be updated. They can also be stored inline or in a separate file.

## [useEffect](https://react.dev/learn/synchronizing-with-effects)

useEffect() hook manages side-effects like fetch requests, manipulating the DOM directly, and starting/ending timers.

It takes 3 arguments, a callback describing how to start synchronizing, a callback describing how to stop synchronizing and an array of dependencies. When the component is first rendered the setup callback will run, and when a dependency changes the stop callback will run, then the synchronize callback will run again with the changed dependency taken into account.

```js
const serverUrl = "https://localhost:1234";

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Any reactive variable (one which might change during render) should be included in the dependency array. The linter will yell at you if you don't, so should be hard to mess up. Any variable in the function body will be reactive as it's redefined every render, so if you want a real static variable declare it outside the component or inside useEffect.

If an empty dependency array is passed the setup callback will only run once when the component mounts, and the stop callback will only run when it dismounts.
