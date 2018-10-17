## Registering provider

Make sure to register the provider inside `start/app.js` file.

```js
const providers = [
  'adonis-bumblebee/providers/BumblebeeProvider'
]
```

If you want to use the `make:transformer` command, add this as well:

```js
const aceProviders = [
  'adonis-bumblebee/providers/CommandsProvider'
]
```

That's all! Now you can use the request transformer by importing it from the http context

```js
const UserTransformer = use('App/Transformers/UserTransformer')

class UserController {
  async index ({request, params, transform}) {
    let users = User.all()

    return transform.collection(users, UserTransformer)
  }
}
```

## Config

The config file is saved as `config/bumblebee.js`. Make sure to tweak it as per your needs.