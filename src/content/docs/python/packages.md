---
title: Modules
---

If a package isn't in path, you can run it with `python3 -m package_name`.

### pip

Python's package manager. `pip install package_name` to install a package, `pip install --upgrade package_name` to upgrade.

## pygame

Lets you build 2D games in the terminal. Create a game with `pygame.init()`, then create a window (the main 'surface') with `pygame.display.set_mode(width, height)`.

### Controlling framerate

Create a clock and ensure it ticks once on each pass through the game loop with `pygame.time.Clock()`. Then set the desired framerate with `clock.tick(rate)` at the end of the game loop. If the loop processes faster than the defined rate pygame will pause to maintain a consistent framerate.

### Game loop

The game loop is where your game runs. You'll want at least `pygame.event.get()` and `pygame.display.flip()` to get user inputs since the last loop and re-render the whole screen respectively.

### Surfaces

You can fill a surface with color by calling `fill(color)`.

## pytest

Uses the 'assert' style of testing, so basically your expectation is `assert` followed by a conditional.

Prefix test files and functions with test\_. The test function name should be descriptive as it's used in the test report.

### Fixtures

Create by adding the decorator `@pytest.fixture` on the line prior to a function. The fixture should return a value to be used in tests, which must be passed to test functions and can then be referred to by the name of the decorated function.

You'll need to import pytest to use decorators.
