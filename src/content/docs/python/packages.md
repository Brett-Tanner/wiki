---
title: Packages
---

If a package isn't in path, you can run it with `python3 -m package_name`.

### pip

Python's package manager. `pip install package_name` to install a package, `pip install --upgrade package_name` to upgrade.

## pygame

Lets you build 2D games in the terminal. Create a game with `pygame.init()`, then create a window (the main 'surface') with `pygame.display.set_mode(width, height)`.

### Controlling framerate

Create a clock and ensure it ticks once on each pass through the game loop with `pygame.time.Clock()`. Then set the desired framerate with `clock.tick(rate)` at the end of the game loop. If the loop processes faster than the defined rate pygame will pause to maintain a consistent framerate.

### Drawing game objects

The `blit()` method draws a surface onto another surface.

### Game loop

The game loop is where your game runs. You'll want at least `pygame.event.get()` and `pygame.display.flip()` to get user inputs since the last loop and re-render the whole screen respectively.

### Rectangles

Game objects are treated as rectangles, you can get the location of the rectangle with `.get_rect()`. Seem to be convenience methods like `midbottom()` and `topright()` which you can call on the rectangles, as well as the expected centre/top/x/y etc. The plain x/y attributes of a rect default to the top left corner (including the origin of the screen itself).

### Sprite

Sprites allow you to group related elements and act on them all at once. You do this using `pygame.sprite.Group()`, which is like a list with extra functionality. To get the individual sprites rather than the game objects, call `.sprites()` on the group.

You add to this group with `.add()` and remove from it with `.remove()`, rather than `.append()`. The whole group can be drawn with a single call to `.draw(screen)` on the group. Seems calling methods like `.update()` on the group calls it on each member?

`sprite.groupcollide(group1, group2)` compares the rects of each element in a group with the rects of each element in another group to see if they overlap and returns a dict of elements that collided with each other. The key will be an element from the first group and its value will be the element/s it hit from the second group. Two optional boolean arguments can be appended to decide if the element from each group is deleted in case of a collision.

`sprite.spritecollideany(sprite, group)` returns the first element in the group that collides with the sprite.

### Surfaces

You can fill a surface with color by calling `fill(color)`.

## pytest

Uses the 'assert' style of testing, so basically your expectation is `assert` followed by a conditional.

Prefix test files and functions with test\_. The test function name should be descriptive as it's used in the test report.

### Fixtures

Create by adding the decorator `@pytest.fixture` on the line prior to a function. The fixture should return a value to be used in tests, which must be passed to test functions and can then be referred to by the name of the decorated function.

You'll need to import pytest to use decorators.
