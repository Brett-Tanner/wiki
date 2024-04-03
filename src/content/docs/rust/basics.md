---
title: Basics
description: Learn the basics of Rust
editurl: false
---

## Compilation

`rustc` is the compiler, call it like `rustc main.rs` to produce an executable for the OS you're working on.

## Macros

Macros are code that writes other code at compile time. Some are built in, like `println!` and `panic!`. You can also create your own.

Generally speaking it seems you should avoid writing macros unless you have to because metaprogramming is more complex and difficult to understand than regular Rust.

However they may be necessary as there are some things they can do which functions can't. For example:

- Functions must declare the number and type of their parameters, while macros can take any number of parameters.

## Types

- `unit`/`()` is returned when there is no meaningful value that could be returned. Not quite like a null pointer or undefined as Rust generally doesn't allow those.
