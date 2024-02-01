---
title: Standard Library
---

## json

### dumps()

Turns a python object into a JSON string.

### loads()

Turns a JSON string into a python object.

## pathlib

### Path()

Pass a string to create a Path object. You can use the Path object to check if the file exists, read the contents, etc. Seems to basically operate like a File object in Ruby but called Path for some reason.

### exists()

True if the file exists, False if not.

### read_contents()

Called on a Path object, reads the contents of the file as strings line by line. Returns returns an empty string at the end of the file. You can split out the lines with `splitlines()`.

### write_text(string)

Writes a string to the file. If the file doesn't exist it will be created, if the file does exist its contents will be overwritten. Also handles closing the file once writing is done.

Only takes a single argument, so to write multiple lines you need to build the string beforehand.

## random

### choice(list)

Returns a random element from list.

### randint(start, end)

Generates a random integer between `start` and `end`.
