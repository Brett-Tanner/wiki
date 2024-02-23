---
title: Basics
---

## Classes

Differences from Ruby are that your initialize method is `__init__` (2 underscores on either side) and you need to pass self as the first argument to any instance method. Set instance variables (attributes) by prefixing them with `self.` rather than `@`.

You don't need to call new on the class to create an instance, just pass the **init** arguments like `Class(arg1, arg2)`.

Inheritance works by passing the class you want to inherit from like an argument to the class definition. The parent class must be defined earlier in the same file.

You can also call `super().__init__(parent_params)` in `__init__` to call the parent class's init method.

You wanna have your classes in modules, can be grouped if related or separate and imported.

Prefix 'private' (helper) methods with `_`.

## Conditionals

& is `and`, || is `or`. Can use `value in list` like I use `includes?` in Ruby, also has a `not in` variant. Booleans are `True` and `False`.

if statements need a colon after the statement, `else if` is `elif`.

## Dictionaries

The python version of a hash. Use `del` to remove KV pairs just like you would with a list.

Square bracket access raises an error, so if you don't want that use `dict.get()`. You can pass a second optional value to return if the key doesn't exist, if not given it'll return `None` (python's nil/null).

To loop over a dict use `for k, v in dict.items()` to get the pairs. You also have `dict.keys()` and `dict.values()`, wrap `values` with `set(values)` to get a unique set of values. Seems you get a dictview as the return value, not a list. But you can use `sorted(dictview)` or `reversed(dictview)` like you could with a list.

They also have comprehensions like lists, which can be given in the form `{x: x ** 2 for x in range(10)}`.

## Exceptions

Objects ceated whenever an error occurs, can be handled with a try/except block or left unhandled to stop execution and show a traceback.

```python
try:
    answer = 1 / 0
except ZeroDivisionError as e:
    print(e)
else:
    print(answer)
```

The contents of the else block are executed if no exception is raised.

If you want to fail silently, python has a `pass` statement that tells the block to end without doing anything.

## Functions

Can take positional, keyword and an arbitrary number of arguments packed into a tuple with `*args` or a dict with `**kwargs` (keyword args). Keyword args are given in the form `func(a=1, b=2)` when calling the function, and defining it in the same form gives you default arguments.

Unlike Ruby you need to return manually.

Can store functions in modules an import them with `import filename`. Then call them with `filename.function()`. Can import specific functions with `from filename import function`, and can import a list from one module by comma-separating the function names. Then you don't need to call them on the module. Can alias the individually imported functions using `as`; modules can also be aliased. Finally, can import all functions from a module and call them without namespacing with `from filename import *`.

## Lists

Array equivalent. Push with `append`, insert at an index with `insert(index, value)`. Loop over with `for v in values` or a while loop, apparently `for in` can be an issue if mutating the list. Empty lists are falsy.

Stuff like `len()` and `sum()` take the list as an argument, while `reverse` and `sort` are called on the list. Both of the last 2 mutate the list, `sorted()` returns a new list.

Slice is interesting, used like `array[start:end:step]`. Can omit start to begin @ 0, end to end @ -1. Can use negative numbers to count from the end.

You can use something called a 'comprehension' to kinda map over a list into a new one like `[v * 2 for v in values]`.

Since you can't mutate a list while you're iterating over it, you can iterate over a `.copy()` of the list and remove the elements from the original list.

## Numbers

Division returns a float, as does any operation involving a float.

## Sets

An unordered collection of unique values. The literal form is just `{1, 2, 3}`, very similar to a hash but no keys.

## Tuples

An immutable array, defined with `()` rather than `[]`. They need a comma to be a tuple, so if you need one with a single element for some reason remeber to add a comma after that element.
