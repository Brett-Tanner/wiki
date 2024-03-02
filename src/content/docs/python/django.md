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

- `CharField()`
- `ForeignKey()`
- `TextField()`

The following options are available on all fields:

- `blank` allows the form value to be blank, related to validations rather than `null`'s strict application to the DB
- `choices` is an enum, can be provided in a few formats including a function. Changing the order requires a new migration.
- `null` allows the field to be null in the database, generally avoided for stringy fields as an empty string is preferred. The exception is when `unique` and `blank` are both also applied.
- `on_delete` must be specified for `ForeignKey` fields; can be `CASCADE`,

After defining the model you'll need to generate its migrations, run them and finally add it to `admin.py` to display it in the admin panel.

### Standard Methods

- `__str__` appears to display whatever the return value is as the title of the model in the admin panel.
- `get_absolute_url` tells Django how to calculate the canonical URL for an instance of the model.

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

- `GenericView` is just a regular page
- `ListView` gives you access to a context variable `modelName_list` which can be looped over

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

### Templates

By default the path looks something like `/app/templates/app/template.html` for god knows what reason. You can also create a top level 'templates' directory and add it to `TEMPLATES` within settings.py.

#### Template tags

You can execute python using 'template tags' in templates using `{% template tag %}`. For example `{% url 'home' %}` would produce a link to the route named `home` in your urls.py.

- `{% url 'app_name:route_name' %}`: produces a link to the named route within app_name
- `{% block name %}{% endblock name %}`: allows the block to be overwritten in child templates
- `{% extends 'base.html' %}`: add the the top of a child template to extend the named parent template

## [Deployment](https://docs.djangoproject.com/en/5.0/howto/deployment/)

You'll need to install gunicorn or another production web server as the included one is not production ready.

Add your domain to ALLOWED HOSTS in settings.py if you have one, otherwise just use a wildcard (`["*"]`) for the moment.

`python manage.py check --deploy` will check some basic settings for you. You'll want to run it on your production settings file though, not the dev one.
