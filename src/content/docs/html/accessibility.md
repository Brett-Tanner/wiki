---
title: Accessibility
description: Notes on writing accessible HTML
---

## ARIA

Fills in the accessibility gaps in native HTML by modifying the semantics
or context of elements.

### 5 Rules of Aria

1. Always use native HTML elements/attributes over ARIA where possible
2. Never change native semantics unless you have no other choice
3. All interactive ARIA controls must be usable with a keyboard
4. Never use `role="presentation"` or `aria-hidden="true"` on focusable elements
5. All interactive elements must have an accessible name

### The Accessibility Tree

Based on the DOM, but contains only the information used by assistive
technologies. ARIA works by modifying the properties of the elements
making up this tree. Includes various attributes such as:

<dl>
  <dt>Name</dt>
  <dd>
    What assistive technologies announce to the user and use to
    differentiate between elements of the same type. Can be set natively in
    HTML, for example by the text contents of an element, its alt text or
    its label
  </dd>
  <dt>Description</dt>
  <dd>What the element is/does, announced along with the name</dd>
</dl>

### ARIA Labels

It's possible to label an element which can't usually be labelled using
ARIA, by passing the id of the element to `aria-labelled-by` or
`aria-described-by` for example.

<dl>
  <dt><code>aria-described-by</code></dt>
  <dd>
    <ul>
      <li>
        Overrides any native label and replaces the
        <code>name</code> attribute in the accessibility tree.
      </li>
      <li>
        You pass a string as the value, which becomes the element's
        accessible name.
      </li>
      <li>
        Cannot be used on <code>div</code> or <code>span</code> elements.
      </li>
    </ul>
    <small
      >Do not use it to change the phonetic pronunciation of words, can mess
      with stuff like a braille reader.</small
    >
  </dd>
  <dt><code>aria-labelled-by</code></dt>
  <dd>
    <ul>
      <li>
        Overrides both native labels and the
        <code>aria-label</code> attribute.
      </li>
      <li>
        Sets the label to a concatenated string of the text contents or alt
        attributes of the elements whose ids you pass
      </li>
      <li>
        Any number of elements can be passed, including the element itself
      </li>
      <li>
        Will still be labelled even if the element giving the label is
        hidden, useful for when you don't want sighted users to see the
        label
      </li>
      <li>
        Unlike a native <code>label</code> element, does not auto-focus the
        thing it labels when the 'label' is clicked
      </li>
    </ul>
  </dd>
  <dt><code>aria-describedby</code></dt>
  <dd>
    Similar to <code>aria-labelled-by</code>, but for the ARIA description
    attribute
  </dd>
  <dt><code>aria-hidden</code></dt>
  <dd>
    Hides elements from the accessibility tree. However be careful as hiding
    an element also hides all its children, which can't be overridden bt
    setting <code>aria-hidden=false</code> on the child elements. Also don't
    apply it to focusable elements, nothing will be announced when they gain
    focus.
  </dd>
</dl>

## Useful Links

[Axe DevTools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US)

Chrome extension for accessibility testing.

[Firefox Accessibility Inspector](https://firefox-source-docs.mozilla.org/devtools-user/accessibility_inspector/)

Can scan a page for accessibility issues, and shows the accessibility tree like the DOM.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)

General performance testing, which also covers accessibility.

[Screen Reader Outputs](https://github.com/thatblindgeye/screenreader-outputs)

A collection of screen reader outputs so you know what you're making stuff accessible for.
