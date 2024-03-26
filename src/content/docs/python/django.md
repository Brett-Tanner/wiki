---
title: Django
---

A MVT framework for Python. Models manage data & business logic, Views describe which data is sent to Templates but not the presentation and Templates present the data. Some people also add a 'U' for URLs that link to a single view.

So basically models are Rails models, views are Rails controllers, templates are Rails views and URLs are Rails routes.

These MVTUs are split into 'apps', units of distinct functionality within the site. For example you might have an authentication app, checkout app and line item app in an online store. Apps map roughly to the Rails concept of resources, though they're self-contained in their own folders within the project root rather than split into folders based on where they fall in MVT.

## Installation

It's recommended to create a virtual environment with `python -m venv .venv` and then activate it with `source .venv/bin/activate` before installing Django. This will keep your installed packages separate from the rest of the system, where the versions might otherwise conflict. You can deactivate the virtual environment with `deactivate`.

Virtual environments are not Docker containers, they only isolate Python packages and still rely on the system's installed version of Python.

You can install Django with `pip install django`, then start a new project with `django-admin startproject mysite`. Remember to append a dot if you don't want to create a new directory. You'll also need `python manage.py migrate` to run the initial migrations which come with the framework, then you can use `python manage.py runserver` to start the dev server.

You can generate 'requirements.txt' to track your dependencies with `pip freeze > requirements.txt`.

### Dockerization

I'm gonna use the Alpine images because I hate myself.

#### Environment Variables

`PIP_DISABLE_PIP_VERSION_CHECK=1` - Prevents `pip` from checking for updates.
`PYTHONDONTWRITEBYTECODE=1` - Prevents Python from writing .pyc files to disk.
`PYTHONUNBUFFERED=1` - Prevents Python from buffering stdout and stderr.

## Commands

### `manage.py`

`createsuperuser` - Creates a superuser, will prompt for username, email and password.
`makemigrations <app_name>` - Creates a migration, optionally scoped to an app.
`migrate` - Runs the migrations.
`runserver` - Starts the development server.
`shell` - Starts the shell.
`startapp <app_name>` - Creates a new app; analgous to a resource in Rails.
`test` - Runs the test suite.

## File Structure

`manage.py` - contains various utility commands like running the dev server or creating apps.

### '/project_name'

- `__init__.py` - Indicates the contents of the folder are part of a Python package, allowing imports from the folder to other directories.
- `asgi.py` - Allows an optional Asynchronous Server Gateway Interface to be run
- `manage.py` - The Django management command
- `settings.py` - project settings
- `urls.py` - routing, maps urls to views
- `wsgi.py` - Stands for Web Server Gateway Interface, the web server

### '/app_name'

- `__init__.py` - Indicates the contents of the folder are part of a Python package, allowing imports from the folder to other directories.
- `admin.py` - config for the built-in Django Admin app
- `apps.py` - config for the app itself
- `migrations/` - tracks changes to `models.py` so it statys in sync with the DB. Seems to imply you don't generally write migrations yourself?
- `models.py` - defines the models which Django automatically translates to DB tables
- `views.py` - handles request/response logic
- `templates/` - not automatically created, contains the presentation logic for pages
- `tests.py` - app-specific tests

## Apps

Apps are similar to the concept of a resource in Rails, they're a folder with their own urls, models, views, etc. Must be manually added to INSTALLED_APPS in settings.py like `pages.apps.AppNameConfig`. (This naming convention might not be quite complete, revisit when you've read a bit more).

Start a new app with `python manage.py startapp myapp` then add it to `INSTALLED APPS` in `settings.py`. Apps are loaded from this list top to bottom, so make sure to put the app below any it depends on.

You'll also need to create a route for it in `urls.py`, and add it to `admin.py` for it to show up in your dashboard.

## Models

Created in the models.py file of an app folder. They import `models` from `django.db`, which you then call various functions named after field types on to define the fields.

Fields are required by default.

- `AutoField`/`BigAutoField` auto-incrementing PK, added automatically
- `BinaryField` allows binary data to be stored as bytes/bytearray/memoryview. Editable is set to false by default
- `BooleanField`
- `CharField` for small to large sized strings. Has a `max_length` attribute
- `DateField`/`DateTimeField`/`TimeFiedld` have an `auto_now` option
- `DecimalField` has `max_digits` and `decimal_places` attributes
- `DurationField`
- `EmailField`
- `FileField` has `storage` and `upload_to` attributes, gives you convenience methods on `FieldFile` if it already exists
- `FilePathField` a char field with choices limited to filenames in a certain directory on the filesystem
- `FloatField`
- `ForeignKey` requires the parent class and the `on_delete` option. Also has a `limit_choices_to` option.
- `GeneratedField` always generated by other fields in the model
- `ImageField` is `FileField` but it validates that the uploaded object is a valid image
- `IntegerField`/`BigIntegerField`
- `JSONField`
- `ManyToManyField` creates a join table using the name of the field and the name of the table containing it. Join table name can be specified with `db_table`
- `OneToOneField`
- `TextField` generates a textarea by default
- `URLField`

The following options are available on all fields:

- `blank` allows the form value to be blank, related to validations rather than `null`'s strict application to the DB
  - generally used together with `null`
- `choices` is an enum, can be provided in a few formats including a function. Changing the order requires a new migration.
- `db_default`/`default` take a wild guess
- `db_index` creates an index on the column
- `editable` decides if the field will be displayed in admin or any other ModelForm. Also skips field validations if false.
- `error_messages` lets you override default error error messages
- `help_text` displays unescaped help text for the field on auto-generated forms
- `null` allows the field to be null in the database
  - generally avoided for stringy fields as an empty string is preferred., otherwise there would be 2 possible values for 'no data'
  - The exception is when `unique` and `blank` are both also applied.
- `on_delete` must be specified for `ForeignKey` fields; can be `CASCADE`, `PROTECT`, `RESTRICT`, `SET_NULL`, `SET_DEFAULT`, `SET()`, `DO_NOTHING`
- `unique` enforced both at DB level and with validations
- `unique_for_date`/`_month`/`_year` prevents this field being duplicated on the same date
- `verbose_name` allows setting the human-readable name of the field

After defining the model you'll need to generate its migrations, run them and finally add it to `admin.py` to display it in the admin panel.

### Standard Methods

- `__str__` appears to display whatever the return value is as the title of the model in the admin panel.
- `get_absolute_url` tells Django how to calculate the canonical URL for an instance of the model.

### Associations

'has_many' are available on `model.<name>_set.all`.

### User Model

Django comes with a default user model, as well as an admin dashboard with permissions/groups etc. Very handy. However, since you're most likely going to want to make some changes to this model and it's apparently a pain to change once you run the initial migrations, you'll want to create a custom user model.

This can be done by extending either `AbstractUser` or `AbstractBaseUser` and adding the fields you want. `AbstractUser` is easier, but `AbstractBaseUser` is a bit more flexible. Seems it's fine to start with the easier one and switch later as it's not a big hassle to do so.

There are 4 main steps to adding a custom user model:

1. Create the CustomUser model

- Generate the app with a name like 'accounts'
- Define a CustomUser model in the app's `models.py`
- Generate a migration to create the table for your model

2. Add it to `AUTH_USER_MODEL` in `settings.py`

- Add `accounts.apps.AccountsConfig` to `INSTALLED_APPS`
- Append `AUTH_USER_MODEL = 'accounts.CustomUser'` to `settings.py`

3. Customise `UserCreationForm` and `UserChangeForm`

- Create 'accounts/forms.py' and import `get_user_model` plus the two forms to be modified
- Extend the forms as needed, remembering to set the model with `model = get_user_model()` and that password fields are included implicitly

4. Add the custom user model to `admin.py`

- Update `admin.py` with imports for `get_user_model` as well as `UserAdmin` and the new custom forms you just customized
  - Add them to `list_display` to show them in the admin panel
  - Add them to `fieldsets` and `add_fieldsets` to show them in edit and create forms respectively
- Create a `CustomUserAdmin` class that extends `UserAdmin` and register it with `admin.site.register(CustomUser, CustomUserAdmin)`

### Migrations

After making changes to a model file you'll need to generate migrations to match the DB to your changes, which can be done with `python manage.py makemigrations`. Then apply them with `migrate`.

`makemigrations` can be scoped to an app by appending the app name.

## Testing

Uses `unittest` from Python stdlib by default, test files are autogenerated with apps. Run with `python manage.py test`.

### unittest

Methods to be run as tests must be prefixed with `test_`, and should have a descriptive name.

### Utility Functions

[Full list](https://docs.djangoproject.com/en/5.0/topics/testing/tools/#assertions) available in pytest-django under `from pytest_django.utils import <assertion>`.

- `client.get(url)`: Takes a URL and returns a response object
- `reverse()`: Takes a route name or view to be rendered and returns the URL for it in the form of a string.

### pytest

You'll wanna use `pytest-django` for handy extra features, which will also install the latest pytest as a dependency. You can then run tests with just `pytest`.

Doesn't have the fancy asserts like `assertEqual` and `assertIn` that `unittest` has, but apparently the output on errors is more detailed and it's more widely used in the general python community.

#### marks

Marks are decorators that change the behavior of a test or group of tests. They are prefixed with `@pytest.mark.<mark>`, and require pytest to be imported. To apply them to a whole class of test, add the mark right before the class is defined.

If your test needs the database, you can mark it with `@pytest.mark.django_db`.

## Views

Separated into function and class-based. Started with only function-based, but added CBVs since they help with DRY and can use mixins. Also includes some GCBVs (generic class-based views) for stuff like forms, pagination etc.

Generic views can be imported to your views.py and then extended by your own views.

- `CreateView` gives you access to a context variable `form`, which you can call `.as_p` on to generate a form from your `fields` array in the view.
  - `__all__` as the fields variable adds all attributes from the model to the form
  - `form_class` lets you use built-in forms like `UserCreationForm`
- `DeleteView` is an actual view rather than a controller action like it is in Rails. Submitting the form triggers a delete.
  - `success_url` in the view is the URL to redirect to after a successful delete
  - use `reverse_lazy` rather than `reverse` to get the URL since it ensures the delete will happen prior to redirection
- `DetailView` gives you access to a context variable `modelName` or `object`
  - You can override `get_context_data` to make local variables available in the template
- `GenericView` is just a regular page
- `ListView` gives you access to a context variable `modelName_list` which can be looped over
- `LoginView` also gives you the form variable
- `UpdateView` is the same as `CreateView` so far

### Automatically setting values in View

To automatically set attributes on a model instance in the default class-based `CreateView`, simply add the following:

```python
def form_valid(self, form):
    form.instance.user = self.request.user
    # or
    form.instance.attribute = predefined_value
    return super().form_valid(form)
```

A useful resource for stuff like this related to class-based views is [Classy class-based views](https://ccbv.co.uk/).

### URLs

Can go in App folders as `urls.py`, you need to import `path` from `django.urls`. You'll also need to add them to the `urls.py` of your project folder like `path('myapp/', include('myapp.urls'))`.

```python
from django.urls import path
from .views import view

urlpatterns = [
    path(regex/string, view, name='optional named URL pattern'),
]
```

When giving the view for a class-based view, be sure to call `.as_view()` on it.

For dynamic segments the syntax is like `post/<int:id>/`.

### Templates

By default the path looks something like `/app/templates/app/template.html` for god knows what reason. You can also create a top level 'templates' directory and add it to `TEMPLATES` within settings.py.

#### Template tags

You can execute python using 'template tags' in templates using `{% template tag %}`. For example `{% url 'home' %}` would produce a link to the route named `home` in your urls.py.

You need to explicitly wrap child templates in `{% block content%}{% endblock content %}` for them to be included in the template they inherit from.

- `{% url 'app_name:route_name' %}`: produces a link to the named route within app_name
- `{% block name %}{% endblock name %}`: allows the block to be overwritten in child templates
- `{% extends 'base.html' %}`: add the the top of a child template to extend the named parent template

## Static files

By default are looked for in `/static` within each app, but can be configured ith `STATIC_URL` and `STATICFILES_DIRS` in settings.py.

To use them, add `{% load static %}` to your base template then import the assets using `{% static 'path/within/static' %}`.

### Pages App

Convention is to use a `pages` app to handle the files and URLs for static pages like auth/about/contact etc.

### For production

You'll need this in your settings.py:

```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise or django.contrib.staticfiles.storage.StaticFilesStorage'
```

Then run `python manage.py collectstatic`. Seems whitenoise is most commonly used as the STATICFILES_STORAGE.

### Installing whitenoise

`pip install whitenoise`
Add it to your INSTALLED_APPS in settings.py as `whitenoise.runserver_nostatic`.
Add it to your MIDDLEWARE in settings.py as `whitenoise.middleware.WhiteNoiseMiddleware`.
Change the STATICFILES_STORAGE in settings.py to `whitenoise.storage.CompressedManifestStaticFilesStorage`.

### Tailwind

You can just install and initialize tailwind like usual, make sure the input and output css files are both in the directory your static files are generated from. You'll also need to remember to `{% load static %}` at the top of your base template in addition to linking the output stylesheet, otherwise you won't be able to use the compiled output.

## [Deployment](https://docs.djangoproject.com/en/5.0/howto/deployment/)

You'll need to install gunicorn or another production web server as the included one is not production ready.

Add your domain to ALLOWED HOSTS in settings.py if you have one, otherwise just use a wildcard (`["*"]`) for the moment.

`python manage.py check --deploy` will check some basic settings for you. You'll want to run it on your production settings file though, not the dev one.

## Authentication

New Django projects install the `auth` app by default, and a default User object which I made notes about extending earlier.

The urls are found under `django.contrib.auth.urls`, and you'll need to add `LOGIN_REDIRECT_URL` in settings.py.

Call `is_authenticated` on the user object to see if the user is authenticated.

Set the logout redirect path with `LOGOUT_REDIRECT_URL` in settings.py. Logging out with a link is no longer supported as of Django 5.0, so you need a form like so:

```html
<form action="{% url 'logout' %}" method="post">
  {% csrf_token %}
  <input type="submit" value="Logout" />
</form>
```

The signup view/url is not created by default, so you'll need to make it yourself. `UserCreationForm` and `UserChangeForm` are found in `django.contrib.auth.forms`. By default they give you a `username`, `password1` and `password2` field.

### Authorisation

To require login for access to a given view `from django.contrib.auth.mixins import LoginRequiredMixin`, then add it as the first argument to the view, before any default views are inherited from.

Or, if you require for auth for all the real content of your site and don't feel like endless copy/pasting, add a custom middleware like this:

```python
from django.shortcuts import redirect
from django.conf import settings


class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.login_url = settings.LOGIN_URL
        self.open_urls = [self.login_url] + getattr(settings, "OPEN_URLS", [])

    def __call__(self, request):
        print(request.user.is_authenticated)
        if (
            not request.user.is_authenticated
            and not request.path_info in self.open_urls
        ):
            return redirect(self.login_url)

        return self.get_response(request)
```

in `/middleware` and activate it in settings.py MIDDLEWARE like this:

```python
MIDDLEWARE = [
    "django.contrib.sessions.middleware.SessionMiddleware",
    ...
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "middleware.authorization.LoginRequiredMiddleware",
    ...
]
```
