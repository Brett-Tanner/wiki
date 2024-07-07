---
title: HTML Templating
description: Overview HTML templating package and related tools
editurl: false
---

HTML templating can be done with the core `html/template` package, or with something like [templ](https://github.com/a-h/templ) if you want a more JSX style syntax.

## html/template

The package lets you parse and execute HTML templates, from strings or external template files.

You can interpolate values by passing them as the second argument to `Execute(io.Writer, any)` and accessing the values struct with `.`.

It's also possible to range over values with `{{range.value}}stuff to do{{end}}`.

Functions can be passed to the template by adding `.Funcs()` before parsing the template and passing a `template.FuncMap` of string function names keying function values.

If you don't want HTML/CSS/JS escaped, wrap it in `template.HTML/CSS/JS`. Won't need to do this for manually constructed stuff but some other packages escape by default.

- `Parse(string) (*Template, error)`: Parse the template from a string.
- `ParseFS(fs.FS, ...string) (*Template, error)`: Parse the template from a filesystem, using the provided list of glob paths which can contain `*` wildcards.
- `Execute(io.Writer, any) error`: Execute the template and write it to `w`.
- `ExecuteTemplate(name string, w io.Writer, data any) error`: Execute the template named `name` and write it to `w`.

## templ
