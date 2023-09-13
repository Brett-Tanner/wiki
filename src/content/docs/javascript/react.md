---
title: React
description: My notes on React, and useful links
---

React is the most widely used frontend JS library, with a huge ecosystem and lots of documentation/Stack Overflow answers.

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
