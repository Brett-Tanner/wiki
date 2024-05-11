---
title: Overview
description: Overview of Go
editurl: false
---

Go is a statically typed, compiled programming language designed at Google. It's typically considered quite simple and easy to learn, with only 25 symbols and a great standard library. It has great concurrency support with goroutines.

Code is grouped into packages (which are grouped in folders named after the package in your `$GOPATH/src`), which begin from their `main` function like Rust/C/etc. All `.go` code inside the package (except the command, which has `package main`) must include the same package declaration.

## Syntax

- `_` is the blank identifier, which can be used in place of a variable name. Usually the compiler throws an error on unused variables or imports, but will ignore them if assigned to `_`.
- `&` is the address-of operator, which returns the address of a variable.
- `*` denotes a pointer, which is automatically dereferenced to its value.
- `func <name>(<args>) <return type> { <body> }` defines a function.
  - function args (including the receiver) are copied by default, so if you need to mutate them pass a pointer
  - By convention public functions start with a capital letter, while private functions start with a lowercase letter.
  - `func <name>(<args> ...)` defines a variadic function, which can take any number of arguments. When passing a slice spread it with `<slice>...`
  - you can `defer` functions so they're executed at the end of the containing function
- `if` doesn't require brackets around the predicate, but does require curly braces around the code to execute
- `range` is a builtin that iterates over a slice or array, returning the index and value for each iteration
- `switch <variable>` uses `case: variable` and `default:` inside curly braces
- `varName := value` declares a variable.
  - `const varName = value` declares a constant.
  - `var varName value` declares a variable with an initial value. Can also be declared without an initial value like `var varName <type>`.
    - the variable will be globally available within its package
  - you can declare multiple variables at once with const by wrapping them in brackets and separating them with newlines

### Loops

Go has no `while`, `do` or `until` loops, so you only have access to `for`.

```go
// single condition, defined separately
i := 1
for i <= 3 {
    fmt.Println(i)
        i = i + 1
}

// classic for loop
for j := 0; j < 3; j++ {
    fmt.Println(j)
}

// loop over a range
for i := range 3 {
    fmt.Println("range", i)
}

// loop infintely until break
// or return from enclosing func
for {
    fmt.Println("loop")
        break
}

// continue to the next iteration
for n := range 6 {
    if n%2 == 0 {
        continue
    }
    fmt.Println(n)
}
```

## Modules

Create with `go mod init <project-name>`, they manage your Go version, dependencies and the module path for where it can be downloaded by Go tools if published.

Best practice to edit it with Go commands like `go mod edit`, `go mod tidy` and `go get` rather than directly to ensure it remains valid.

## Standard Library

### [Strings](https://pkg.go.dev/strings)

- `strings.ContainsFunc(s, func(rune) bool) bool` returns true if the string contains any character that satisfies the function
- `strings.Map(func(rune) rune, s string) string` applies a function to every character in a string, drops char with no replacement if negative value returned

## Testing

You need to create a module with `go mod init <project-name>` before you can use `go test`.

Tests must:

- Be in a file named `*_test.go`
- Be named `Test*`
- Only take one argument, t, with type \*testing.T
- Import `testing`

You can check your test coverage with `go test -cover`, while `go test -race` will check for race conditions and give more detailed info if they're found.

### `t` methods

`t` can have a bunch of different types, like:

- `*testing.B` which contains an interface for benchmarking
- `*testing.F` which contains an interface for fuzzing
- `*testing.T` which contains an interface for testing and formatting test results
- `*testing.TB` which contains an interface satisfying testing, benchmarking and fuzzing

- `t.Errorf()` prints a formatted message and fails the test.
  - `%d` prints the value as an integer
  - `%f` prints the value as a float, add `.n` to specify the number of decimal places
  - `%g` prints teh value as a float to the last significant digit
  - `%s` prints the value as uninterpreted bytes of the string or slice
  - `%q` prints the value in quotes
  - `%v` prints the value as is
    - `%#v` prints
- `t.Fatal()` is equivalent to `t.Errorf()` and also fails the test.
- `t.Helper()` marks the current function as a test helper. This ensures failures will print the line number in the actual test that failed, rather than in the helper.
- `t.Run(<description>, func(t *testing.T))` defines a sub-test.

### Benchmarking

Written in the test file & similar to tests in that it takes one argument, a testing interface. In this case it's `(b *testing.B)`.

This interface gives you access to `b.N` which is the number of times to run the test, which you can use in a loop like so:

```go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 2)
    }
}
```

If you run benchmarks with `go test -bench=.`, Go will choose an appropriate number of iterations.

### Custom Assertions

Can be defined within a test like so:

```go
assertCustomAssertion := func(t testing.TB, got, want, string) {
    t.Helper()

    if got != want {
        t.Errorf("got %q, want %q", got, want)
    }
}
```

Note the `testing.TB` type is not passed as a pointer, unlike the interfaces for actual tests.

### Examples

Go examples are executed as part of the test file, so you can be sure they're always correct and up to date. They'll be provided as part of the documentation for your package, and will prevent your package compiling if they fail. Note that the comment at the end is necessary, otherwise the example will be compiled but not executed.

```go
func ExampleAdd() {
  sum := Add(2, 2)
  fmt.Println(sum)
  // Output: 4
}
```

### Mocks

You just need to create a struct fulfilling the interface you require for the mocked argument.

A 'spy' variant would be a struct with an internal counter incremented (or taking some other action) when the method is called.

#### HTTP Mocks

The `net/http/httptest` package lets you easily create a mock HTTP server for testing, and allows you to create test servers like so whose URLs can then have test requests made to them which will return the test response.

```go
slowServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    time.Sleep(20 * time.Millisecond)
    w.WriteHeader(http.StatusOK)
}))

fastServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
}))

slowURL := slowServer.URL
fastURL := fastServer.URL
```

`httptest.NewServer` returns a struct with the server's URL and a `Close` method which can be called to stop the server. It takes an `http.HandlerFunc` which will be called when the server receives a request. The `http.HandlerFunc` itself takes an anonymous function with a response writer and a http request as parameters. Remember to close the servers when you're done with `server.Close()`.

`time.After()` returns a channel that will receive a value after the specified duration. Useful for preventing your test blocking forever or simulating slow servers.

Incidentally, this is exactly how you'd write a real http server in Go, but it automatically finds an open port to listen on and lets you close it when you're done with it.

### Table-driven Tests

Good for reducing code duplication when you want to run the same test for a bunch of different implementations of the same interface.

```go
func TestArea(t *testing.T) {
	areaTests := []struct {
		name    string
		shape   Shape
		hasArea float64
	}{
		{
			name:    "Rectangle",
			shape:   Rectangle{Width: 10.0, Height: 10.0},
			hasArea: 100.0,
		},
		{
			name:    "Circle",
			shape:   Circle{Radius: 10.0},
			hasArea: 314.1592653589793,
		},
		{
			name:    "Triangle",
			shape:   Triangle{Base: 12.0, Height: 6.0},
			hasArea: 36.0,
		},
	}

	for _, args := range areaTests {
		t.Run(args.name, func(t *testing.T) {
			got := args.shape.Area()
			if got != args.hasArea {
				t.Errorf("%#v got %g want %g", args.shape, got, args.hasArea)
			}
		})
	}
}

```

1. Declare an anonymous struct containing the arguments to be passed to your test
   1.1 The struct should always have a name field to enable 3
2. Create a slice filled with instances of the anonymous struct for each test you want to run
3. Iterate over the slice using range, passing the struct to your test
   3.1 Run each test with `t.Run` for better error tracing
   3.2 Also allows individual sub-tests to be called with `go test -run TestName/sub-test`

## Types

Usually declared separated by a space from the variable. If you have multiple args of the same type, it's possible to declare them with a single type after all the args like `func Add(x, y int)`.

Function return types are added after the argument list, and can be named (in brackets with the return type) to create a variable with that name in the function body initialized to the 'zero value' of the type.

You can create your own types from existing ones like `type <newName> <existingType>`. For example, `type Bitcoin int` can then be used to create Bitcoin with the syntaxt `Bitcoin(n)`.

### Arrays/Slices

Initialized with a fixed capacity, and default initial values set to the zero value for the provided type. Their size is actually part of their type, so trying to pass a `[4]int` to a function that expects a `[5]int` will fail.

`len(<array>) int` returns the number of elements in the array or slice.

Since fixed-size arrays are annoying, you'll use slices (an abstraction over the array type) much more often. They're represented as a pointer to the start of an array segment, the length of the segment and its capacity, therefore modifying elements of a slice modifies the corresponding element of the underlying array. Slices are declared very similarly to arrays, but without a size as they're dynamically sized.

```go
// array without values
a := [3]int{}

// array with values
a := [3]int{1, 2, 3}

// slice without values
s := []int{}

// slice with values
s := []int{1, 2, 3}
```

Slices can't be compared with equality operators, so unless you want to manually iterate over all the values use `reflect.DeepEqual` to compare them. Side note, `reflect.DeepEqual` accepts any type, not just slices. It uses a different comparison algorithm for each type, and will always return false when comparing distinct types. For slices it returns true if they're both nil, point to the same initial entry of the same underlying array or their corresponding elements are deeply equal.

`make([]<type>, <size>)` creates a slice with the given type and capacity (inferred from size by default, or can be passed as an additional arg).

Attempting to access an index outside the slice's capacity will cause a runtime error, so if you want to add elements outside the capacity you need to use `append(<slice>, <toAppend> ...) <appendedSlice>)`. It's possible to append a second slice by spreading it with `...`. You can also `copy(<destination> <source>) int` an original slice into a larger target.

You can slice a slice (or an array) with `slice[<start>:<end>]`. Omitting the end slices everything from the start, while omitting the start slices everything until the end. Remember that slices of an array will keep that array around in memory until they disappear, so if you want the array to be garbage collected make a copy of the slice and use that.

### Errors

It's idiomatic to return errors to be handled by the receiver. You'll need to add `error` as the return type, and create a customised error to return with `errors.New(<string>)`.

You can access the error message with `err.Error()`.

### [Interfaces](https://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go)

An interface is a named collection of methods, declared with `type <name> interface { <methodList> }` where `<methodList>` is a list of methods and their return types.

A struct or type implements the interface if it has all the methods in the interface, as opposed to the usual behaviour of having to explicitly implement it. You can type a function argument as an interface, which allows you to pass any struct implementing that interface as that argument.

### Maps

Key/value pairs, like a hash in Ruby. Instantiated with `map[<keyType>]<valueType>{<key>: <value>, ...}`. Keys can only be valid comparable types.

You look up values like in any other language, but there are two values which can be returned from a key lookup, the value and a boolean indicating the success or failure of the lookup.

Maps can be modified without passing an address to them, but are not reference types. A map value is a pointer to a `runtime.hmap` structure. So when you pass a map to a function/method you copy it, but only the pointer part.

`nil` maps exist and behave like an empty map when reading, but cause a runtime panic when writing. Therefore never initialize an empty map variable, always at least assign it an empty map.

When writing to an existing key, by the current value will be overwritten by the newly provided one.

### Structs

Structs are mutable data structures similar to a hash, declared like:

```go
type Point struct {
    X, Y int
    // or
    X int
    Y int
}
```

Public struct fields start with a capital and can be accessed with dot notation, while private fields are lowercase and cannot be accessed outside the package they're defined in. All fields are initialised to their type's zero value if not explicitly set. It's idiomatic to create new structs in a factory function which returns a pointer to the struct, though if they're as simple as my example above you're probably fine to just use the `Point{5, 10}` or `Point{X: 5, Y: 10}` syntax. `&` as a prefix yields a pointer to the struct.

Structs can have methods, which are functions with a receiver of the struct type. They're declared in a very similar way to functions, but with an added receiver type:

```go
type Rectangle struct {
    Width  float64
    Height float64
}

// the reveiver type is added before the args
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}
```

Unlike in other languages, the receiver is not available as `this` or `self` but as the name provided in the receiver type, by default the first letter of the type.

Methods can be called with dot notation. Remember public methods start with a capital, and unlike Ruby you always need the trailing brackets when calling a method, even if it has no args.

## Concurrency

Handled by 'goroutines', which are lightweight threads that run concurrently with the main thread. They're created with `go <function>()` and are automatically garbage collected when they're done.

If the code you're running in a goroutine isn't a function you generally use it in an anonymous function like:

```go
go func() {
    fmt.Println("Hello, world")
}()
```

Anonymous functions have access to all variables in the scope they're declarde in, and the brackets at the end mean it's executed at the same time it's declared, just like in JS.

### Channels

Using goroutines opens you up to race conditions like concurrent map writes, which will cause a runtime panic. These can be detected in tests by running them with the race flag like `go test -race`.

You can avoid race conditions with channels, a data structure (declared with `chan <type>`) which can both send and receive values to act as a buffer for the results.

Send a value to the channel with `channel <- value` (`<-` is the send operator), and receive with `value := <-channel`.

You should always `make` channels otherwise it'll be initialised with the zero value for channels (`nil`) and block forever because you can't sent to `nil` channels.

### Select

`select` is like `Promise.race` in JS, the first channel to send a value 'wins' and the code underneath that `case` is executed.

Can use closing an empty `chan struct{}` (this type is chosen since it's the smallest possible memory allocation) to indicate that a goroutine is done.

```go
func Racer(a, b string) string {
	select {
	case <-ping(a):
		return a
	case <-ping(b):
		return b
	}
}

func ping(url string) chan struct{} {
	ch := make(chan struct{})
	go func() {
		http.Get(url)
		close(ch)
	}()
	return ch
}
```

## [Reflection](https://go.dev/blog/laws-of-reflection)

Reflection is the ability of a its own structure at runtime, particularly through types.

Can be useful when you don't know a given type at compile time; passing `interface{}` as a type is the equivalent of `any` in TS (in fact `any` in Go is an alias for `interface{}`). However this is not something you want to overuse because you lose type safety and have to use reflection to figure out which type was passed, which can cause performance issues.

### General Methods

- `Elem()` returns the value the interface receiver contains or that the pointer receiver points to.
- `Interface()` returns the current value of a variable as an `interface{}`.
- `Kind()` returns the kind of a variable, which is a `reflect.Kind` enum representing the variable's type.
- `TypeOf()` returns a `reflect.Type` of a given variable.
- `ValueOf()` returns a `reflect.Value` of a given variable.

### Value Methods

- `val.Field(i)` returns the `i`th field of a struct. Panics if val is not a struct.
- `val.NumField()` returns the number of fields in a struct. Panics if val is not a struct.
- `val.Recv()` receives and returns a value from a channel, as well as a boolean which is false if the channel is closed
- `val.Call(*args)` calls a function with the given arguments
