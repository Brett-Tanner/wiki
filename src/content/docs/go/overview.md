---
title: Overview
description: Overview of Go
editurl: false
---

Go is a statically typed, compiled programming language designed at Google. It's typically considered quite simple and easy to learn, with only 25 symbols and a great standard library. It has great concurrency support with goroutines.

Code is grouped into packages (which are grouped in folders named after the package in your `$GOPATH/src`), which begin from their `main` function like Rust/C/etc. All `.go` code inside the package (except the command, which has `package main`) must include the same package declaration.

## Syntax

- `_` is the blank identifier, which can be used in place of a variable name. Usually the compiler throws an error on unused variables or imports, but will ignore them if assigned to `_`.
- `func <name>(<args>) <return type> { <body> }` defines a function.
  - By convention public functions start with a capital letter, while private functions start with a lowercase letter.
  - `func <name>(<args> ...)` defines a variadic function, which can take any number of arguments. When passing a slice spread it with `<slice>...`
- `if` doesn't require brackets around the predicate, but does require curly braces around the code to execute
- `range` is a builtin that iterates over a slice or array, returning the index and value for each iteration
- `switch <variable>` uses `case: variable` and `default:` inside curly braces
- `varName := value` declares a variable.
  - `const varName = value` declares a constant.
  - `var varName value` declares a variable with an initial value. Can also be declared without an initial value like `var varName <type>`.
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

You can check your test coverage with `go test -cover`.

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
  - `%q` prints the value in quotes
  - `%v` prints the value as is
    - `%#v` prints
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

### [Interfaces](https://jordanorelli.com/post/32665860244/how-to-use-interfaces-in-go)

An interface is a named collection of methods, declared with `type <name> interface { <methodList> }` where `<methodList>` is a list of methods and their return types.

A struct implements the interface if it has all the methods in the interface, as opposed to the usual behaviour of having to explicitly implement it. You can type a function argument as an interface, which allows you to pass any struct implementing that interface as that argument.

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

Struct fields can be accessed with dot notation, and are initialised to their type's zero value if not explicitly set. It's idiomatic to create new structs in a factory function which returns a pointer to the struct, though if they're as simple as my example above you're probably fine to just use the `Point{5, 10}` or `Point{X: 5, Y: 10}` syntax. `&` as a prefix yields a pointer to the struct.

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
