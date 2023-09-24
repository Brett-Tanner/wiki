---
title: Animation
description: Notes on CSS animations
---

## [Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

Used when you need something more complicated than a transition can
provide

- they're designed to loop; transitions can but not designed for it
- transitions need a trigger like a pseudoclass or class being added/removed via JS, animations can run immediately if they're told to
- animation timing are more flexible than `transition-timing-function` allows

You define animation properties on the element to be animated, then the keyframes in an @keyframes rule with the name given in `animation-name`

### Animation Properties

Can also just use the `animation` property to set all at once.
However, using the individual properties lets you
[set a bunch of animations on the same element](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations#setting_multiple_animation_property_values) using comma-separated lists of values

<dl>
  <dt><code>animation-name</code></dt>
  <dd>sets the name connecting this animation to its keyframes</dd>

  <dt><code>animation-delay</code></dt>
  <dd>
      specifies delay between element loading and animation starting and/or whether the animation should start at the beginning/part way through
  </dd>

  <dt><code>animation-duration</code></dt>
  <dd>the time taken to complete a full cycle</dd>

  <dt><code>animation-fill-mode</code></dt>
  <dd>
      specifies how styles apply to the element after/before the animation. e.g. will it retain the styles after the animation completes? Start with the styles applied?
  </dd>

  <dt><code>animation-iteration-count</code></dt>
  <dd>
    how many times the animation will loop. <code>infinite</code> is an accepted value
  </dd>

  <dt><code>animation-direction</code></dt>
  <dd>
    decides if the animation will loop or jump back to the starting position at the end of a cycle
  </dd>

  <dt><code>animation-play-state</code></dt>
  <dd>can pause or start the animation</dd>

  <dt><code>animation-timing-function</code></dt>
  <dd>
    same as for transitions, sets how the animation progresses through each cycle
  </dd>
</dl>

### Keyframes

```css
@keyframes animation-name {
  from {
    background-color: red;
  }
  to {
    background-color: green;
  }
}
```

- can also use percentages to set keyframes at specific points other than the `from` and `to` keywords
- both `from` and `to` are optional, if you leave one out the start/end state will be inferred from current styles

## [Transforms](https://developer.mozilla.org/en-US/docs/Web/CSS/transform)

- Take one or more CSS transform functions as values, with those functions taking their own param, usually an angle or number
- Can be applied to almost all elements, exceptions being col, colgroup and inline elements that aren't replaced (like `<span>`, not like `<a>`; or `<img>`)
- Cheaper compared to other animations as it occurs during [composition](https://web.dev/rendering-performance/#the_pixel_pipeline) and can be [gpu-accelerated]("https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/").

### 2D Transforms

- Rotate
  - Rotates the element by a provided number of degrees, radians or
    fractions of a turn
- Scale
  - Takes two fractions, x first then y, and increases the element's size by that much
  - Also has `scaleX()` and `scaleY()` variants which take only one fraction argument
- Skew
  - Takes two arguments, degrees or radians to skew in x then y-axis
  - Also has `skewX()` and `skewY()` variants which take only one argument
  - The base function can also accept only one argument, in which case it'll behave like `skewX()`
- Translate
  - Changes the elements position by an amount in the x then y-axis
  - Also has `translateX()` and `translateY()` variants which take only one argument

All of these can be chained by simply adding them to the transform property one after the other, with spaces between.
[Some debate](https://codepen.io/bali_balo/post/chaining-transforms) on whether chained transforms should be read L > R or R > L but L > R makes sense to me.

### 3D Transforms

Kinda the same as 2D transforms, but with the addition of perspective (and another dimension of course).

- [Perspective](https://css-tricks.com/how-css-perspective-works/)

  - Set on an element's parent container. If you want a 3d shape, you'll need to set the `transform-style: preserve-3d` property to transform all the child elements together, preserving their relative positions
  - `transform-style` also might fix some weird `z-index` issues I've had before, it guarantees child elements will appear in the order they are in 3D space, not the order they are in the DOM
  - Sets the distance from the user to the z=0 plane, which allows
    transformations on the z-axis to actually make a visible difference.
    Bigger values are further.
  - For translate, allows the element to get bigger as it moves closer
    and smaller as it moves further
  - For rotate, the element looks like it's actually rotating rather
    than just shrinking and growing. Also briefly disappears at
    multiples of 90 if element has no depth.
  - Must be declared first in the transform property, unlike other
    transform functions which can be in any order
  - `perspective-origin` determines the angle you're looking
    at the element from
    - Default is centered, so if you move the element you'll see it moving relative to you
    - But you can also move the perspective origin, allowing you to look around the element

- Rotate
  - Adds `rotateX()`, `rotateY()`, `rotateZ()` and `rotate3D()` functions.
- Scale
  - Adds `scaleZ()` and `scale3D()` which scale the element in the z-axis and all 3 at once respectively
- Translate
  - Adds `translateZ()` and `translate3D()` which move the element on the z-axis and all 3.
  - `translateZ()` will not do anything without perspective.
- Matrix
  - Also exists as a way to combine really complex transforms together
  - But generally avoided due to poor readability, don't use it unless you need it

### [Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions)

Let you animate the transition between states of an element rather than
instantly changing.

`transition` is shorthand for:

<dl>
    <dt><code>transition-property</code></dt>
    <dd>Determines the CSS property to be transitioned (e.g. background-color)</dd>
    <dt><code>transition-duration</code></dt>
    <dd>Determines how long the transition takes from start to finish</dd>
    <dt><code>transition-timing-function</code></dt>
    <dd>Determines the rate at which the transition progresses, has keywords like ease-out/ease-in but can also be defined manually</dd>
    <dt><code>transition-delay</code></dt>
    <dd>Determines the delay before starting the transition after it's triggered</dd>
</dl>

Multiple properties can be animated in a single line by separating them
with commas.

Creates a new [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context). Performance is best when transitioning opacity or transform properties.

Try to avoid transitioning to or from an 'auto' value as it can cause unexpected behavior.

## Web Animation API

I just came across this briefly and made some quick notes, there's a lot more you can do here like pause or speed up animations

### Element Methods

`animate()`

Takes two arguments, a keyframes object and an options object. Starts an animation based on the keyframes, and returns that animation. You can attach event listeners to the animation, listening for its events like `finish` when it ends or remove when it's automatically `removed`.

`getAnimations()`

Retrieves all current and future animations on an element

### [Keyframes](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats)

Keyframes can be passed to <code>animate()</code> in two ways; as an array of keyframe objects or as a keyframe object whose keys are arrays of values to iterate over.

#### Keyframe object

```js
element.animate(
  {
    opacity: [0, 1], // [ from, to ]
    color: ["#fff", "#000"], // [ from, to ]
  },
  2000
);
```

#### Array of Keyframe Objects

```js
element.animate(
  [
    {
      // from
      opacity: 0,
      color: "#fff",
    },
    {
      // to
      opacity: 1,
      color: "#000",
    },
  ],
  2000
);
```

## Useful Links

[Animation optimisation](https://web.dev/animations-guide)

Provides hints on how to keep animations performant and ways of troubleshooting them.

[Animation Troubleshooting](https://dzhavat.github.io/2021/02/18/debugging-layout-repaint-issues-triggered-by-css-transition.html)

Steps someone took to track down the cause of an animation stuttering.

[CSS Triggers](https://csstriggers.com/)

List of which CSS properties cause repainting or layout shifts when animated. Gives you a rough idea of the performance cost to animating a property.

[anime.js](https://animejs.com/)

A very cool looking JS animation library.

[CSS Triggers Overview](https://huijing.github.io/slides/03-css-triggers/#/)

Slides giving a rundown of CSS Triggers and why they're relevant.
