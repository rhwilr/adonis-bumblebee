# adonis-bumblebee

API Transformer Provider for the AdonisJs framework.
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
 - Create a “barrier” between source data and output, so changes to your models do not affect API response
 - Include relationships for complex data structures
 - Manipulate and typecast data in one place only

## Table of contents

  * [Installation](#installation)
  * [Simple Example](#simple-example)
  * [Resources](#resources)
  * [Transformers](#transformers)
    * [Transformer Classes](#transformer-classes)
    * [Including Data](#including-data)
        * [Default Include](#default-include)
        * [Available Include](#available-include)
        * [Parse available includes automatically](#parse-available-includes-automatically)
  * [EagerLoading](#eagerloading)
  * [Serializers](#serializers)
    * [PlainSerializer](#plainserializer)
    * [DataSerializer](#dataserializer)
  * [Pagination](#pagination)    
  * [Fluent Interface](#fluent-interface)
  * [Credits](#credits)


## Installation

Run this command to install the package and follow the instructions in [instructions.md](instructions.md).

```sh
adonis install adonis-bumblebee
```


## Simple Example

For the sake of simplicity, this example has been put together as one simple route function. In reality, you would create dedicated Transformer classes for each model.

```js
Route.get('/', async ({ response, transform }) => {
  const users = await User.all()

  return transform.collection(users, user => ({
    firstname: user.first_name,
    lastname: user.last_name
  }))
})
```

You may notice a few things here: First, we can import `transform` from the context, and then call a method `collection` on it. 
This method is called a [resources](#resources) and we will cover it in the next section. We pass our data to this method along with a [transformer](#transformers). In return, we get the transformed data back.


## Resources

Resources are objects that represent data and have knowledge of a “Transformer”.

Two types of resource exist:

- **Item** - A singular resource, probably one entry in a data store
- **Collection** - A collection of resources

The resource accepts an object or an array as the first argument, representing the data that should be transformed.
The second argument is the transformer used for this resource.


## Transformers

In the previous example, we saw a callback transformer, but there are only intended to be used in some simple cases. Transformers can do much more.

```js
const users = await User.all()

return transform.collection(users, user => ({
  firstname: user.first_name,
  lastname: user.last_name
}))
```


### Transformer Classes

The recommended way to use transformers is to create a transformer class. This allows the transformer to be easily reused in multiple places.

You can let bumblebee generate the transformer for you by running:
```sh
adonis make:transformer User
```

The class must extend `BaseTransformer` and implement at least a `transform` method.

```js
const BaseTransformer = use('BaseTransformer')

class UserTransformer extends BaseTransformer {
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

*Note:* You also get the `context` as the second argument in the `transform` method. Through this, you can access the current request or the authenticated user.

*Note:* A transformer can also return a primitive type, like a string or a number, instead of an object. But keep in mind that including additional data, as covered in the next section, only work when returning an object.

Once the Transformer class is defined, it can be passed to the resource as the second argument:

```js
const UserTransformer = use('App/Transformers/UserTransformer')
const users = await User.all()

return transform.collection(users, UserTransformer)
```

*Note:* You can also directly use the namespace of the transformer. `transform.collection(users, 'App/Transformers/UserTransformer')`

*Note:* Passing the Transformer as the second argument will terminate the fluent interface. If you want to chain more methods after the call to `collection` or `item` you should only pass the first argument and then use the `transformWith` method to define the transformer. See [Fluent Interface](#fluent-interface)


### Including Data

Most of the time our data does not only consist of simple properties on the model. Our models also have relations to other models. With include methods, you can define additional related data that should be included in the transformed response.


#### Default Include

```js
class BookTransformer extends TransformerAbstract {
  static get defaultInclude () {
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
    return this.item(book.getRelated('author'), AuthorTransformer)
  }
}

module.exports = BookTransformer
```

Includes defined in the `defaultInclude` getter will always be included in the returned data.

You have to specify the name of the include by returning an array of all includes from the  `defaultInclude` getter.
Then you create an additional Method for each include named like in the example: `include{Name}`

The include method returns a new resource, that can either be an `item` or a `collection`.  See [Resources](#resources)

*Note:* As with the transform method you get access to the `context` through the second argument.

*Note:* If you have hyphen or underscore separated properties, you would name the include function in camelCase. The conversion is done automatically.


#### Available Include

```js
class BookTransformer extends TransformerAbstract {
  static get availableInclude () {
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
    return this.item(book.getRelated('author'), AuthorTransformer)
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

Note: publishers will also be included with something else nested under it. This is shorthand for publishers, publishers.somethingelse.
This can be done to a limit of 10 levels. But the default nesting limit can be changed in the config file.


### Parse available includes automatically

In addition to the previous method, you can also enable `parseRequest` in the config file. Now bumblebee will automatically parse the `?include=` GET parameter and include the requested resources.


## EagerLoading

When you include additional models in your transformer be sure to eager load these relations as this can quickly turn into n+1 database queries. If you have defaultIncludes you should load them with your initial query.
In addition, bumblebee will try to load related data if the include method is named the same as the relation.

To ensure the eager-loaded data is used, you should always use the `.getRelated()` method on the model.


## Serializers

After your data passed through the transformer, it has to pass through one more layer. The `Serializer` will form your data into its final structure.
The default serializer is the `PlainSerializer` but you can change this in the settings. For smaller APIs, the PlainSerializer works fine, but for larger projects, you should consider using the `DataSerializer` since the other one has some limitations.


### PlainSerializer

This is the simplest serializer since it does not add any namespaces to the data. It is also compatible with the default structure that you get when you return a lucid model from a route.

```js
// Item
{
  foo: 'bar'
}

// Collection
[
  {
    foo: bar
  },
  {...}
]
```

There is one major drawback to this serializer. It does not play nicely with metadata:

```js
// Item with meta
{
  foo: 'bar',
  meta: {
    ...
  }
}

// Collection
{
  data: [
    {...}
  ],
  meta: {
    ...
  }
}
```
Since you cannot mix an Array and Objects in JSON, the serializer has to add a `data` property if you use metadata on a collection. The same is true if you use pagination.
This is why we do not recommend using the `PlainSerializer` when using these features. But other than that, this serializer works great for small and simple APIs.


### DataSerializer

This serializer adds the `data` namespace to all of our items. Some do not like this since it can make it a bit awkward when retrieving the data since you always have to call `.data` on every item to get the data.


```js
// Item
{
  data: {
    foo: 'bar'
  }
}

// Collection
{
  data: [
    {
      foo: bar
    },
    {...}
  ]
}
```

But the advantage over the `PlainSerializer` is that it does not conflict with meta and pagination:

```js
// Item with meta
{
  data: {
    foo: 'bar'
  },
  meta: {
    ...
  }
}

// Collection
{
  data: [
    {...}
  ],
  meta: {...},
  pagination: {...}
}
```

## Metadata

Sometimes you need to add just a little bit of extra information about your model or response. For these situations, we have the `meta` method. 

```js
const User = use('App/Models/User')

const users = await User.all()

return transform
  .meta({ 
    access: 'limited'
  })
  .collection(users, UserTransformer)
```


## Pagination

When dealing with large amounts of data, it can be useful to paginate your API responses to keep them lean.
Adonis provides the `paginate` method on the query builder to do this on the database level.
You can then pass the paginated models to the `paginate` method of bumblebee and your response will be transformed accordingly.
The pagination information will be included under the `pagination` namespace.

```js
const User = use('App/Models/User')
const page = 1

const users = await User.query().paginate(page)

return transform.paginate(users, UserTransformer)
```


## Fluent Interface

Bumblebee has a fluent interface for all the setter methods. This means you can chain method calls which makes the API more readable.
The following methods are available on the `transform` object in the context and from `Bumblebee.create()` (see below).

**Chainable methods:**
- `collection(data)`
- `item(data)`
- `null(data)`
- `paginate(data)`
- `meta(metadata)`
- `transformWith(transformer)`
- `withContext(ctx)`
- `include(include)`
- `setSerializer(include)`
- `serializeWith(serializer)` (alias for `setSerializer`)

**Terminating methods:**
- `collection(data, transformer)`
- `item(data, transformer)`
- `paginate(data, transformer)`
- `toJSON()`


You may want to use the transformer somewhere other than in a controller. You can import bumblebee directly by the following method:

```js
const Bumblebee = use('Adonis/Addons/Bumblebee')

let transformed = await Bumblebee.create()
    .collection(data)
    .transformWith(BookTransformer)
    .withContext(ctx)
    .toJSON()
```

You can use all the same methods as in the controllers. With one difference: If you need the `context` inside the transformer, you have to set it with the `.withContext(ctx)` method since it is not automatically injected.


## Credits

Special thanks to the creator(s) of [Fractal](https://fractal.thephpleague.com/), a PHP API transformer that was the main inspiration for this package.
Also, a huge thank goes to the creator(s) of [AdonisJS](http://adonisjs.com/) for creating such an awesome framework.
