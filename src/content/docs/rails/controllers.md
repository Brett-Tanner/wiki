---
title: Controllers
description: Notes on what I've learnt about Rails Controllers
---

## APIs

You can use `respond_to` to tell your controller how to respond in different formats (html, json, xml). It passes the block a `format` object which you can call the different formats on along with a block containing a `render` call to specify how the controller responds to that format.

```ruby
class UsersController < ApplicationController
    def index
        @users = User.all

        respond_to do |format|
        format.html # index.html.erb
        format.xml  { render :xml => @users }
        format.json { render :json => @users }
        end
    end
end
```

Passing `:json` as a key to render means Rails will call `to_json` on the data you pass.

### Attributes to return

You can specify which attributes to include in your response by overriding the `as_json` method of the model you're returning data from. Don't override `to_json` as that does other stuff, `as_json` only handles selecting the attributes so is safer to override.

You can choose to completely override `as_json`, or work with it using `super`

```ruby
class User < ActiveRecord::Base
    # Option 1: Purely overriding the #as_json method
    def as_json(_options={})
        { :name => self.name }  # NOT including the email field
    end

    # Option 2: Working with the default #as_json method
    def as_json(options={})
        super({ only: [:name] }.merge(options))
    end
end
```

The [documentation](https://api.rubyonrails.org/classes/ActiveModel/Serializers/JSON.html#method-i-as_json) for `as_json` will help you do more detailed stuff like including associations (use `include: :association`).

### Useful Links

[Building awesome Rails APIs](https://collectiveidea.com/blog/archives/2013/06/13/building-awesome-rails-apis-part-1)

[CSRF](https://stackoverflow.com/questions/7203304/warning-cant-verify-csrf-token-authenticity-rails) [Tokens](https://stackoverflow.com/questions/8503447/rails-how-to-add-csrf-protection-to-forms-created-in-javascript)

[Errors](https://guides.rubyonrails.org/layouts_and_rendering.html#using-head-to-build-header-only-responses)
