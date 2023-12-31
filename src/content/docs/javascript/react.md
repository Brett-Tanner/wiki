---
title: React
description: My notes on React, and useful links
---

## [Context API](https://react.dev/reference/react/useContext)

Provides a way to avoid [prop-drilling](https://kentcdodds.com/blog/prop-drilling), by creating a kind of 'global state'. Its 3 key components are `createContext`, `useContext` and `ContextObject.Provider`.

Drawbacks are that it can cause performance issues by re-rendering every component which consumes it on state changes, even if not necessary.
It also makes your code use less of a 'functional' style and can make it more difficult to track where data is coming from, as well as being kinda like global variables.

Some ways to mitigate those issues are using smaller contexts for groups of related components rather than an app-wide context, using [composition](https://www.robinwieruch.de/react-component-composition/) to split your components into hyper-specialized ones which can be passed props separately or using external state management systems like [Redux](https://redux.js.org/) or [Zustand](https://github.com/pmndrs/zustand)

### `createContext`

Creates the context, takes a value which is used as the default value for that context and returns a context object which can be used to pass data to components.

It's not required to set a default value, but will stop stuff breaking if you try to access context in a component it's not provided to and help with IDE autocomplete.

```js
const ShopContext = createContext({
  products: [],
  cartItems: [],
  addToCart: () => {},
});
```

### `ContextObject.Provider`

`Provider` accepts a `value` prop, which will be made available to any components wrapped by the provider.

```js
return (
  /* We are going to pass the things that we want to inject to these components using the value prop */
  /* This value prop will overwrite the default value */
  <ShopContext.Provider value={{ cartItems, products, addToCart }}>
    <Header />
    <ProductDetail />
  </ShopContext.Provider>
);
```

### `useContext`

Is what you call in the component you want to access the context from. Accepts the context object as an argument and returns the values which can be destructured.

```js
const { cartItems } = useContext(ShopContext); // We must pass the ShopContext object itself as an argument
```

## Fetching Data

When fetching data you'll want to do it in a `useEffect`, and have 3 state variables. The state you want to set with the data, an error state (thrown in the then/after the await where it occurs and caught in your `catch` block) which conditionally displays the error screen and a loading state set to false in your `finally` call. The `promise.then().catch().finally()` syntax actually looks more natural to me for stuff like this, maybe try that next project or at least a mixture.

Probably a good idea to extract the whole data-fetching thing into a custom hook which can be destructured for the 3 states and re-used in other components like:

```js
const useImageURL = () => {
  const [imageURL, setImageURL] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos", { mode: "cors" })
      .then((response) => {
        if (response.status >= 400) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((response) => setImageURL(response[0].url))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);

  return { imageURL, error, loading };
};
```

#### Promise style

```js
useEffect(() => {
  fetch("https://jsonplaceholder.typicode.com/photos", { mode: "cors" })
    .then((response) => {
      if (response.status >= 400) {
        throw new Error("server error");
      }
      return response.json();
    })
    .then((response) => setImageURL(response[0].url))
    .catch((error) => setError(error))
    .finally(() => setLoading(false));
}, []);
```

#### Async/await style

```js

```

### [Chasing Waterfalls](https://www.developerway.com/posts/how-to-fetch-data-in-react)

In React functions inside components aren't called until rendered, including `useEffect`. So the parent has to fetch its data and render first, followed by the children. This creates a waterfall effect when multiple components in the same tree all need to fetch data. One solution is to lift all requests into the parent component and make them concurrently when it renders, then pass the results relevant to the children as props. In the meantime, have the children display a loading state.

#### Multiple Concurrent Requests

When you lift a bunch of `useEffects` into a parent component, you still need a way to make them concurrent as `await`s one after the other will still just be a waterfall. You could put all the requests inside a `Promise.all()`:

`Promise.all()`

```js
const useAllData = () => {
  const [sidebar, setSidebar] = useState();
  const [comments, setComments] = useState();
  const [issue, setIssue] = useState();

  useEffect(() => {
    const dataFetch = async () => {
      // waiting for allthethings in parallel
      const result = (
        await Promise.all([
          fetch(sidebarUrl),
          fetch(issueUrl),
          fetch(commentsUrl),
        ])
      ).map((r) => r.json());

      // and waiting a bit more - fetch API is cumbersome
      const [sidebarResult, issueResult, commentsResult] = await Promise.all(
        result
      );

      // when the data is ready, save it to state
      setSidebar(sidebarResult);
      setIssue(issueResult);
      setComments(commentsResult);
    };

    dataFetch();
  }, []);

  return { sidebar, comments, issue };
};
```

But that still requires waiting for all 3 requests to succeed before rendering. Setting up multiple concurrent promises which set their respective state when resolved allows you to render each component as its data becomes available:

```js
fetch("/get-sidebar")
  .then((data) => data.json())
  .then((data) => setSidebar(data));
fetch("/get-issue")
  .then((data) => data.json())
  .then((data) => setIssue(data));
fetch("/get-comments")
  .then((data) => data.json())
  .then((data) => setComments(data));
```

and to render each component as the relevant data arrives

```js
const App = () => {
  const { sidebar, issue, comments } = useAllData();

  // show loading state while waiting for sidebar
  if (!sidebar) return 'loading';

  // render sidebar as soon as its data is available
  // but show loading state instead of issue and comments while we're waiting for them
  return (
    <>
      <Sidebar data={sidebar} />
      <!-- render local loading state for issue here if its data not available -->
      <!-- inside Issue component we'd have to render 'loading' for empty comments as well -->
      {issue ? <Issue comments={comments} issue={issue} /> : 'loading''}
    </>
  )
}
```

This does have the downside of triggering a re-render of your whole app every time data arrives though, so if rendering all your components takes a while the `Promise.all()` approach may be better to only have to render once.

Yet another approach would be to wrap the app component (in root) with context providers for each piece of data which needs fetching like so:

##### One of these for each fetch request

```js
const Context = React.createContext();

export const CommentsDataProvider = ({ children }) => {
  const [comments, setComments] = useState();

  useEffect(async () => {
    fetch("/get-comments")
      .then((data) => data.json())
      .then((data) => setComments(data));
  }, []);

  return <Context.Provider value={comments}>{children}</Context.Provider>;
};

export const useComments = () => useContext(Context);
```

`App.tsx`

```tsx
const App = () => {
  const sidebar = useSidebar();
  const issue = useIssue();

  // show loading state while waiting for sidebar
  if (!sidebar) return 'loading';

  // no more props drilling for any of those
  return (
    <>
      <Sidebar />
      {issue ? <Issue /> : 'loading''}
    </>
  )
}
```

`main.tsx`

```tsx
export const VeryRootApp = () => {
  return (
    <SidebarDataProvider>
      <IssueDataProvider>
        <CommentsDataProvider>
          <App />
        </CommentsDataProvider>
      </IssueDataProvider>
    </SidebarDataProvider>
  );
};
```

And then just access the context in the components which need it with something like `const comments = useComments();`, no prop-drilling required.

Finally, you could just move the data fetching outside React altogether (outside the Root component) and await the variables in the relevant components. But this makes debugging an absolute mess, and can actually worsen performance by immediately fetching data for a component you may never even display before React itself for example. Only use if pre-fetching critical resources on the router level (maybe the case for my setsumeikai project) or when pre-fetching data inside lazy-loaded components (as by definition they're loaded after all critical data).

### [Suspense](https://blog.logrocket.com/react-suspense-data-fetching/)

It's behind an experimental flag for now, so please don't use it in production future Brett, but it simplifies adding loading states while you wait for fetched data. e.g.

```js
const Issue = () => {
  return (
    <>
      // issue data
      <Suspense fallback="loading">
        <Comments />
      </Suspense>
    </>
  );
};
```

### [useEffect](https://react.dev/learn/synchronizing-with-effects)

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

## [React Router](https://reactrouter.com/en/main)

The standard client-side routing library, allows React to change the URL (using the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API/Working_with_the_History_API)) like a MPA while staying on the same page and just rendering the new page with client-side JS.

Their [tutorial](https://reactrouter.com/en/main/start/tutorial) seems to do a good job covering all the key concepts you'd be likely to need.

Probably best to extract the router to its own component and just import it in `main.tsx` to be rendered as the root.

1. First, create a router with `createBrowserRouter()` and assign it to a variable. It takes an array of objects representing your roots. Objects need at least `path` and `element` keys, which take a string path and component to render at that path respectively.

2. Then, in `main.tsx`, add `<RouterProvider router={router} />` as the param passed to your render call.

3. Rather than using anchor tags for links, you'll need the `Link` component React Router provides or navigation will trigger a full-page refresh. There's also a `NavLink` which will auto-apply an active class (or a custom class applied using its `isActive` or `isPending` states like so: `className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}`)

`useNavigation()` returns the current navigation state (one of "idle", "submitting" and "loading") and can be used to conditionally apply loading styles/transitions.

`useNavigate()` returns a ref to a function which will navigate the user back x times if -x is passed, or forward x times if x is passed.

### Conditional Routes

`App.js`

```js
import routes from "./routes";
import { useRoutes } from "react-router-dom";

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const routing = useRoutes(routes(isLoggedIn));

  return <>{routing}</>;
}
```

`routes.js`

```js
import { Navigate, Outlet } from "react-router-dom";

const routes = (isLoggedIn) => [
  {
    path: "/app",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/account", element: <Account /> },
      { path: "/", element: <Navigate to="/app/dashboard" /> },
      {
        path: "member",
        element: <Outlet />,
        children: [
          { path: "/", element: <MemberGrid /> },
          { path: "/add", element: <AddMember /> },
        ],
      },
    ],
  },
  {
    path: "/",
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: "login", element: <Login /> },
      { path: "/", element: <Navigate to="/login" /> },
    ],
  },
];

export default routes;
```

### Errors

To display errors, add an `errorElement` to the root path. Once the root `errorElement` is added, you can add more specific error pages for any of your other routes/their children. Errors will bubble up and be caught by the nearest available `errorElement`, useful for only taking up part of a page with the error message.

However rather than adding error components to each route individually, it's likely better to have a pathless route as the first in the list of child elements. The pathless route will catch any error emitted by its siblings.

The error is available through `useRouteError()`; has `statusText` and `message` properties.

It's best to throw error responses in the loader so you can provide a useful message rather than an internal JS error when the component fails to render because of an undefined etc. Similar syntax to this:

```js
const contact = await getContact(params.contactId);
if (!contact) {
  throw new Response("", {
    status: 404,
    statusText: "Not Found",
  });
}
return { contact };
```

### Forms

Forms can be submitted on change (to filter as you type for example) by assigning `useSubmit()` a reference and passing that reference to an `onChange` handler, with `event.currentTarget.form` as the param. To avoid creating a history entry for every single character you type, use the `replace` option of `useSubmit()` and set its value to a check for whether it's the first search or not (e.g. checking ig the query string is null).

If you want your mutations with forms to change data without navigating to a new page, make use of the `useFetcher()` hook. Assign it to a variable, then call the `Form` component (both opening and closing tags) on that variable to update data with the form's values but not navigate anywhere. Still updates data and even catches errors as normal though.

`fetcher.state` exists, same as `navigation.state`, but you can also just use `fetcher.formData` to read the submitted value right there in the component and optimistically update it to the submitted value. Once the form has submitted and updated the value, the `formData` will disappear and the authoritative value will be displayed.

#### POST

Rather than being sent to the server as a POST or GET request, form data is captured by React Router and handled by a function passed to the `action` key on the relevant route if a POST request.

Actions are exported from the root component just like loaders. Make sure to use the `<Form />` component rather than a regular form element so React Router can capture the data/request. RR will update all your `useLoaderData()` hooks on form submission.

Params are available from `params` inside the component props, this can be combined with a loader/useLoaderData in the component and its route to get the record matching the param.

Form values are accessible by calling `request.formData()` in the action, and extracted into an object using `Object.fromEntries(formData);` and finally redirected like so:

```jsx
import { Form, useLoaderData, redirect } from "react-router-dom";
import { updateContact } from "../contacts";

export async function action({ request, params }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  await updateContact(params.contactId, updates);
  return redirect(`/contacts/${params.contactId}`);
}
```

#### GET

GET requests from the `Form` component add a query string to the current URL and trigger any loaders (so data can be fetched with the new parameters). It's just a normal page navigation, so you can hit back to return to a previous search/no search state.

By default there are 2 UX problems here:

1. If you click back after a search, the form field still has the value you entered even though the list is no longer filtered.
2. If you refresh the page after searching, the form field no longer has the value in it, even though the list is filtered.

The solutions for both involve retrieving the value of the query in your loader and passing it as one of the return values (say `q`).

Number 1 can be solved by updating the contents of the search bar in a `useEffect` which has `q` as a dependency (or keeping the query in state on the search field's parent, setting it in a `useEffect` and passing it as a prop to the search component).

Number 2 can be solved by simply retrieving `q` with `useLoaderData` and setting it as the `defaultValue` of the search input.

Check if a search is in progress like this `const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q");` (`navigation.location` is only truthy when a page is loading) and use the searching boolean to display a loading spinner.

### loader & useLoaderData

Routes have an optional `loader` key used to store a function for fetching data needed by the route. The function can either be declared in the route it'll be loading for then exported and passed by ref to the `loader` key, or declared inline if it's short enough.

The retrieved data can then be destructured from `useLoaderData` inside the components of that route.

When testing components with loaders, you'll need to create a `MemoryRouter` with the component you want as the sole (root) route and the loader or a mock of it attached, then put it inside a `RouterProvider` like this:

```js
const router = createMemoryRouter([
  {
    path: "/",
    element: <SchoolList />,
    loader: testGetSchools,
  },
]);

function renderSchoolList() {
  render(<RouterProvider router={router} />);
}
```

### Nested Routes

Nested routes can be added by adding a `children` key to the object for the parent route and explicitly passing an array of routes or auto-generating them like `path: "profile/:name"`. They can be rendered inside their parent by adding an `<Outlet />` where you want the child to be rendered when its path is visited.

An index can be set for the nested route, to show in the outlet by default when no specific path is visited, by passing an index element to the `children` array like `{ index: true, element: <DefaultProfile /> },`

Autogenerated routes seem to require you to use a `switch` to choose which component to show???? Must be a better way than that. You can get the URL params by destructuring a `useParams()` call like `const { name } = useParams();`.

To automatically redirect a user to a different URL, use the [`<Navigate />`](https://reactrouter.com/en/main/components/navigate) component. The component takes a `to` key which specifies the path to navigate to, and a bunch of options like `replace` to replace the current entry in the history stack rather than adding a new one, a `state` variable to store in history state and `relative` which determines where the passed path should be resolved relative to.

## [Reducers](https://react.dev/learn/extracting-state-logic-into-a-reducer)

Reducers are pure functions taking a previous state and an 'action' to return a new state. The action is an object with a 'type' property describing what the user did, as well as any other info needed to produce the new state. They're useful when you have a bunch of different functions updating the same state in different ways and want to consolidate the logic in one place. Remember, **they don't update the state themselves, just return a value used to update it.**

Because they're pure functions, **you can actually write unit tests for them!**. Was a major annoyance in the shopping cart project. Also would have been useful in the shopping cart project for incrementing/decrementing the amount in cart, rather than having separate increment/decrement/clear functions like I did.

```js
function reducer(state, action) {
  switch (action.type) {
    case "incremented_count": {
      return { count: state.count + 1 };
    }
    case "decremented_count": {
      return { count: state.count - 1 };
    }
    case "set_count": {
      return { count: action.value };
    }
    default: {
      throw new Error("unknown action: " + action.type);
    }
  }
}
```

### [useReducer](https://react.dev/reference/react/useReducer)

Takes a reducer function and an initial state as arguments, then returns an array with the current state and a `dispatch()` function as values.

`dispatch()` takes an 'action', which is passed to the reducer function used to create it, which in turn returns a value used to update the state.

## Refs & Memoization

### useCallback

While `useMemo()` _can_ be used to memoize functions, `useCallback` is specifically designed for it (and it can only memoize functions, nothing else). Rather than

```js
const handleClick = useMemo(
  () => () => setCount((prevState) => prevState + 1),
  []
);
// or
const memoizedHandleClick = useMemo(() => handleClick, []);
```

you can do

```js
// Inside a component
// Without useCallback
const handleClick = () => setCount((prevState) => prevState + 1);
// With useCallback
const handleClick = useCallback(
  () => setCount((prevState) => prevState + 1),
  []
);
// or
const memoizedHandleClick = useCallback(handleClick, []);
```

Definitely don't just whack everything in a `useCallback`, it has its own performance overhead and should only be used when there's a real performance issue to be solved.

Only use when you need to avoid referential equality (e.g. an object in your dependency array hasn't changed its values, but because it's been recreated in the parent component the child thinks it's changed) or cache computationally expensive calculations. Also remember to actually measure the difference with/without, as sometimes the overhead can actually make it slower.

### useMemo

Provides a way to cache the value of an expensive calculation. Takes the arguments in the same form as `useEffect`; a calculation function and an array of dependencies which will cause the calculation function to run if changed.

Wrapping a component in the [`Profiler` component](https://react.dev/reference/react/Profiler) or inspecting it with the [`Profiler` tab of React Developer Tools](https://react.dev/learn/react-developer-tools) may help you decide if something needs to be memoized.

```js
import { useMemo } from "react";

function Cart({ products }) {
  const totalPrice = useMemo(() => {
    return products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }, [products]);

  return (
    <div>
      {/* Some other content in the cart */}
      {/* Products to display */}
      <p>
        Total Price: <strong>${totalPrice}</strong>
      </p>
      {/* Some button to checkout */}
    </div>
  );
}
```

However if you memo-ize a value in a parent component, state changes to that parent will still cause the child to be re-rendered even if the memoized value didn't change. You can get around this by wrapping the entire child component in `memo()`, which will skip re-rendering a component if its props (and its own state) are unchanged.

### [useRef](https://react.dev/reference/react/useRef)

Lets you manage a (mutable) value that's not needed for rendering, and will not trigger a re-render when changed. Often used when performing imperative actions or accessing elements through the DOM.

```js
import { useRef, useEffect } from "react";

function ButtonComponent() {
  const buttonRef = useRef(null);

  useEffect(() => {
    buttonRef.current.focus();
  }, []);

  return <button ref={buttonRef}>Click Me!</button>;
}
```

You declare the ref with an initial value, and can assign it to an element by passing that value as the `ref` prop of that element. That ref can then be used in something like a `useEffect` to refer to the element.

To manually update the value in a ref, you need to access its `current` property like

```js
function handleStopClick() {
  const intervalId = intervalRef.current;
  clearInterval(intervalId);
}
```

But you shouldn't read or write refs during rendering. They should only be used in event handlers or in `useEffect`.

#### setInterval

Can behave unexpectedly with hooks if you don't use the callback version of `setState`. Here's a [guide to making it work](https://overreacted.io/making-setinterval-declarative-with-react-hooks/).

## Testing

I'll [use Vitest for now](https://www.robinwieruch.de/vitest-react-testing-library/) since it's what Odin uses, but look into Bun/HappyDOM if I work on a big enough project that it might matter.

Key packages are `@testing-library/react` (for React-specific test helpers like `render()`), `@testing-library/jest-dom` (for custom DOM matchers) and `@testing-library/user-event` (a better version of the old `fireEvent` library which more accurately simulates user interaction).

When testing a project with React Router, any component with a `Link` or `NavLink` component child will need to be wrapped in `<MemoryRouter><MemoryRouter />` tags to not throw an error in testing, as those components depend on the React Router context.

### Matchers

[jest-dom](https://github.com/testing-library/jest-dom#custom-matchers)
[Vitest](https://vitest.dev/api/expect.html)

### [Mocking](https://vitest.dev/guide/mocking.html)

Allows you to mimic the functionality or choose the result of a callback or external resource in order to test the effects of that specific functionality/result. Also useful for [mocking child components](https://medium.com/@taylormclean15/jest-testing-mocking-child-components-to-make-your-unit-tests-more-concise-18691ef6a0c2) when testing a parent component.

If your mocks/other setup are complex, prefer extracting them to a `setup()` function which returns a `utilities` object over using a `beforeEach`, since in JS `beforeEach` requires you to declare the variables at the start of the describe block with `let` and assign them in the `beforeEach`. It's more readable to have both creation and assignment in `setup()`.

### [Queries](https://testing-library.com/docs/queries/about/)

- `getBy...` queries return a match if only one is found, and a descriptive error is 0 or more than one are found.
- `queryBy...` queries return a matching node if found, or null if not. Useful for asserting a node doesn't exist.
- `findBy...` queries which resolves when a matching node is found, or rejects after 1000ms. The All version resolves when any matches are found.

They all have `...AllBy` variants which will not error on more than one match, and will retrieve an array of matches instead.

All are generally called on the `screen` object.

Priority in using queries should be as follows to more closely mimic how users interact with your site:

1. `...ByRole`: takes a [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques#roles) and often a name option (the alt/title/desc option, text content if none of those exist)
2. `...ByLabelText`: great for form fields
3. `...ByPlaceholderText`:
4. `...ByText`:
5. `...ByDisplayValue`: the current value of a form field

### Rendering

- `render()`
  - renders the passed component into a container which is then appended to `document.body`
  - can pass a `container` option (if component is a tr or something which can't render in a div) which should be an element appended to the body (won't be appended for you)
  - also `baseElement` which defaults to `document.body` or the passed container
  - returns
    - queries from the DOM testing library bound to the baseElement (accessed by {...queries}) (but better to use queries available on the `screen` object)
    - the container it was appended to `baseElement` in
    - the `baseElement`
    - an `unmount()` function which can be used to test what happens when the component unmounts
  - renders are unmounted after each test, so put them in a `beforeEach` hook if you're testing the same one/set

Use `act()` wrapped around any calls which update state to ensure the test waits for the final, full, render before making any assertions. RTL wraps its helper functions with `act()`, so probably no need for me to do it unless I use something which doesn't.

### [Simulating User Events](https://testing-library.com/docs/user-event/intro)

First setup a user with `const user = userEvent.setup()`, then await actions like `user.click()` as interactions are all async as of the latest version.

`userEvent` is preferred to `fireEvent` as it more closely simulates actual user interactions.

### [Snapshots](https://vitest.dev/guide/snapshot.html)

Used to store the full DOM tree of a rendered test component and compare future test runs to it. Probably handy once finalized for regression testing, but since it's **everything** it's very likely to break at the slightest change and need to be recaptured.

On a related note, snapshots can be updated. They can also be stored inline or in a separate file.

## Useful Links

[Rails 7 w/React](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-v7-project-with-a-react-frontend-on-ubuntu-20-04)
