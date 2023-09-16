---
title: Tags
description: List of handy HTML tags and their uses
---

<dl>
  <dt><code>&lt;article&gt;</code></dt>
  <dd>
    Represents a self-contained composition in a page, which could be viewed
    on its own. In other words, an article
  </dd>

  <dt><code>&lt;aside&gt;</code></dt>
  <dd>
    should be used for things like callout boxes containing interesting
    facts not part of the main content
  </dd>

  <dt><code>&lt;button&gt;</code></dt>
  <dd>
    for anything users are meant to click without triggering navigation, even if it doesn't necessarily
    look like a button
  </dd>

  <dt><code>datalist</code></dt>
  <dd>
    An element wrapping a set of options, can be attached to an input to
    specify the allowable options for that input/provide suggestions.
  </dd>

  <dt><code>details</code></dt>
  <dd>
    A dropdown which wraps a summary element (displayed when the dropdown is
    closed) and its content.
  </dd>

  <dt><code>dialog</code></dt>
  <dd>Kinda like a modal, should be used as the base for custom modals.</dd>

  <dt><code>&lt;dl&gt;</code></dt>
  <dd>
    should be used for lists of terms and their definitions. It contains
    <code>&lt;dt&gt;</code> <code>&lt;dd&gt;</code> pairs for the terms and
    descriptions respectively
  </dd>

  <dt><code>&lt;figure&gt;</code> & <code>&lt;figcaption&gt;</code></dt>
  <dd>Represents self-contained content like an image and its optional caption with <code>&lt;figcaption&gt;</code> </dd>

  <dt><code>&lt;footer&gt;</code></dt>
  <dd>Used to represent a footer for the nearest sectioning context</dd>

  <dt><code>&lt;header&gt;</code></dt>
  <dd>Represents introductory content for the page or a section context</dd>

  <dt><code>&lt;input&gt;</code> and <code>&lt;label&gt;</code></dt>
  <dd>should always be associated with each other</dd>

  <ul>
    <li>
      Either set the <code>for=""</code> attribute of the label to the id of
      the input, or
    </li>
    <li>nest the input inside the label</li>
    <li>
      Also make sure you set the correct <code>type=""</code> attribute on
      inputs
    </li>
  </ul>

  <dt><code>&lt;main&gt;</code></dt>
  <dd>The dominant content of the body element</dd>

  <dt><code>&lt;math&gt;</code></dt>
  <dd>Lets you use <a href="https://developer.mozilla.org/en-US/docs/Web/MathML">MathML</a> to faithfully recreate mathematical formulae</dd>

  <dt><code>mark</code></dt>
  <dd>
    Like a <code>span</code> which highlights text, some browsers haev
    default styles.
  </dd>

  <dt><code>meter</code></dt>
  <dd>
    Provides a little bar thingy with attributes determining how much of it
    is filled/what color the fill should be.
  </dd>

  <dt><code>&lt;nav&gt;</code></dt>
  <dd>Provides links, either within the page or to other pages</dd>

  <dt><code>&lt;optgroup&gt;</code></dt>
  <dd>Groups the options provided to a select input, takes a label attribute to title the group.</dd>

  <dt><code>progress</code></dt>
  <dd>
    A progress bar! Value element can be set to control how much is filled
    or left indeterminate. Color will follow the system's accent color by
    default, or can be set with <code>accent-color</code> css property.
  </dd>

  <dt><code>&lt;sub&gt;</code></dt>
  <dd>
    Used inline to wrap subscript like x<sub>2</sub>.
  </dd>

  <dt><code>&lt;sup&gt;</code></dt>
  <dd>
    Used inline to wrap superscript like x<sup>2</sup>.
  </dd>

  <dt><code>&lt;table&gt;</code></dt>
  <dd>
    for anything that would be presented in a table, no stacking divs like I
    did on the old event sheet
  </dd>

  <dt><code>&lt;ul&gt;</code> and <code>&lt;ol&gt;</code></dt>
  <dd>should be used for their respective list types</dd>

  <dt><code>&lt;section&gt;</code></dt>
  <dd>
    Represents a generic section that doesn't have a more specific semantic
    element to represent it. Should always have a heading.
  </dd>

</dl>
