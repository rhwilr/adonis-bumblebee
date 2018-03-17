# adonis-bumblebee

Api Transformer Provider for the AdonisJs framework.
This library provides a presentation and transformation layer for complex data output.

<br />
<hr />
<br />

[![Greenkeeper][greenkeeper-image]][greenkeeper-url]
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Codecov][codecov-image]][codecov-url]

[greenkeeper-image]: https://badges.greenkeeper.io/rhwilr/adonis-bumblebee.svg
[greenkeeper-url]: https://greenkeeper.io

[npm-image]: https://img.shields.io/npm/v/adonis-bumblebee.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/adonis-bumblebee

[travis-image]: https://img.shields.io/travis/rhwilr/adonis-bumblebee/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/rhwilr/adonis-bumblebee

[codecov-image]: https://img.shields.io/codecov/c/github/rhwilr/adonis-bumblebee.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/rhwilr/adonis-bumblebee

## Goals
 - Create a “barrier” between source data and output, so changes to your models do not effect api response
 - Include relationships for complex data structures
 - Manipulate and typecast data in one place only

## Install

Run this command to install the package and follow the instructions in [instructions.md](instructions.md).

```sh
adonis install adonis-bumblebee
```

## Simple Example

For the sake of simplicity, this example has been put together as one simple route function. In reality you would create dedicated Transformer classes for each model.

```js
Route.get('/', async ({ response, transform }) => {
  const users = await User.all()

  return transform.collection(users, user => ({
    firstname: user.first_name,
    lastname: user.last_name
  }))
})
```

You may notice a few things here: First, we can import `transform` from the context, and then call a method `collection` on it. This method is called a [resources](#resources) and we will cover it in the next section. We pass our data to this method along with a [transformer](#transformers). In return we get the transformed data back which we well return as our response.

## Resources

Resources are objects that represent data, and have knowledge of a “Transformer”.

Two types of resource exist:

- **Item** - A singular resource, probably one entry in a data store
- **Collection** - A collection of resources

The resource accepts an object or an array as the first argument, representing the data that should be transformed.
The second argument is the transformer used for this resource.

## Transformers

In the previous example we saw a callback transformer, but there are only intended to be used in some simple cases. Transformers can do much more.

```js
const users = await User.all()

return transform.collection(users, user => ({
  firstname: user.first_name,
  lastname: user.last_name
}))
```

### Transformer Classes

The recommended way to use transformers is to create a transformer class. This allows the transformer to be easily reused in multiple places.

The class must extend `Adonis/Addons/Bumblebee/TransformerAbstract` and implement at least a `transform` method.

```js
const TransformerAbstract = use('Adonis/Addons/Bumblebee/TransformerAbstract')

class UserTransformer extends TransformerAbstract {
  transform (model) {
    return {
      id: model.id,

      firstname: model.first_name,
      lastname: model.last_name
    }
  }
}

module.exports = UserTransformer
```

Once the Transformer class is defined, it can be passed to the resource as the second argument:

```js
const UserTransformer = use('App/Transformers/UserTransformer')
const users = await User.all()

return transform.collection(users, UserTransformer)
```

Note: You also get the `context` as the second arguement in the `transform` method. Thought this you can access the current request or the authenticated user.

A transformer can also return a primitive type, like a string or a number, instead of an object. But keep in mind that including additional data, as covered in the next section, only work when returning an object.

### Including Data

Most of the time our data does not only consist of simple properties on the model. Our models also have relations to other models. With include functions you can define additional related data that sould be included in the transformed response.

#### Default Include

```js
class BookTransformer extends TransformerAbstract {
  defaultInclude () {
    return [
      'author'
    ]
  }

  transform (book) {
    return {
      id: book.id,
      title: book.title,
      year: book.yr
    }
  }

  includeAuthor (book) {
    return this.item(book.author().fetch(), AuthorTransformer)
  }
}

module.exports = BookTransformer
```

Includes defined in the `defaultInclude` method will always be included in the returned data.

You have to specify the name of the include by returning an array of all includes from the  `defaultInclude` method.
Then you create an additional Method for each include named like in the example: `include{Name}`

The include method returns a new resource, that can either be an `item` or a `collection`.  See [Resources](#resources)


#### Available Include

```js
class BookTransformer extends TransformerAbstract {
  availableInclude () {
    return [
      'author'
    ]
  }

  transform (book) {
    return {
      id: book.id,
      title: book.title,
      year: book.yr
    }
  }

  includeAuthor (book) {
    return this.item(book.author().fetch(), AuthorTransformer)
  }
}

module.exports = BookTransformer
```

An `availableInclude` is almost the same as a `defaultInclude`, except it is not included by default. As the name would suggest.
To include this resource you call the `include()` method before transforming.

```js
return transform.include('author').item(book, BookTransformer)
```

These includes can be nested with dot notation too, to include resources within other resources.

```js
return transform.include('author,publisher.something').item(book, BookTransformer)
```

Note: publishers will also be included with somethingelse nested under it. This is shorthand for publishers,publishers.somethingelse.
This can be done to a limit of 10 levels. But the default nesting limit can be changed in the config file.
 

### Parse available includes automatically

In addition to the previous method, you can also enable `parseRequest` in the config file. Now Bumblebee will automatically parse the `?include=` GET parameter and include the requseted resources.


## Fluent Interface

You may want to use the transformer somewhere other than in a controller. You can import bumblebee directly by the following method:

```js
const Bumblebee = use('Adonis/Addons/Bumblebee')

let transformed = await Bumblebee.create()
    .collection(data)
    .transformWith(BookTransformer)
    .withContext(ctx)
    .toArray()
```

You can use all the same methods as in the controllers. With one difference: If you need the `context` inside the transformer, you have to set it with the `.withContext(ctx)` method since it is not automatically injected.

## Credits

Special thanks to the creator(s) of [Fractal](https://fractal.thephpleague.com/), a php api transformer that was the main inspiration for this package.
Also a huge thanks goes to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such an awesome framework.
