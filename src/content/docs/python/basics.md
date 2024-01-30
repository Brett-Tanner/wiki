---
title: Basics
---

## Conditionals

& is `and`, || is `or`. Can use `value in list` like I use `includes?` in Ruby, also has a `not in` variant. Booleans are `True` and `False`.

if statements need a colon after the statement, `else if` is `elif`.

## Lists

Array equivalent. Push with `append`, insert at an index with `insert(index, value)`. Loop over with `for v in values`. Empty lists are falsy.

Stuff like `len()` and `sum()` take the list as an argument, while `reverse` and `sort` are called on the list. Both of the last 2 mutate the list, `sorted()` returns a new list.

Slice is interesting, used like `array[start:end:step]`. Can omit start to begin @ 0, end to end @ -1. Can use negative numbers to count from the end.

You can use something called a 'comprehension' to kinda map over a list into a new one like `[v * 2 for v in values]`.

## Numbers

Division returns a float, as does any operation involving a float.

## Tuples

An immutable array, defined with `()` rather than `[]`. They need a comma to be a tuple, so if you need one with a single element for some reason remeber to add a comma after that element.
