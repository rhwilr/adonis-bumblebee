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

      firstname: user.first_name,
      lastname: user.last_name
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