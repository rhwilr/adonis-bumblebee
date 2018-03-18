# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]


## [1.1.0] - 2018-03-18

This release adds a few new features. Nothing too exciting but they will help you write simpler and better performing apis.

### Added
- Relations are now automatically eagerloaded if they are a lucid model and the include method is named like the relation, [#8](https://github.com/rhwilr/adonis-bumblebee/issues/8)
- The `transform` method can now return a primitive type, [#9](https://github.com/rhwilr/adonis-bumblebee/issues/9)
- You can now access the `context` from within an include function throught the second parameter, [#10](https://github.com/rhwilr/adonis-bumblebee/issues/10)


## [1.0.2] - 2018-03-16

### Fixed
- Parsing includes from the request did not work as intended. Now the query parameters are parsed correctly, [#7](https://github.com/rhwilr/adonis-bumblebee/issues/7)


## [1.0.1] - 2018-03-10

### Fixed
- If null or undefined was passed to the `item` or `collection` method, an exception was thrown. Now null is returned.


## [1.0.0] - 2018-02-15

This is the first official release of adonis-bumblebee.

### Added
- The Bumblebee Fluent Interface is now available as `Adonis/Addons/Bumblebee`
- Lots of documentation


## [0.0.7] - 2018-02-10

### Fixed
- If an include function does not return an instance of `ResourceAbstrace`, the returned value is used without transformation.


## [0.0.6] - 2018-02-10

This release adds optional includes that can be requested on a per-transform basis.
It is also possible to request nested includes which are going to be recursively resolved.

### Added
- Added `availableIncludes` to transformers. 
- Added `parseIncludes()` to request includes.
- Added config values for recursion limit.
- Includes can be automatically parsed from the request parameters


## [0.0.5] - 2018-02-08

### Fixed
- Use the current request context instead of creating a new one.


## [0.0.4] - 2018-02-08

### Fixed
- Allow the transform function to be a promise


## [0.0.3] - 2018-02-08

This release is a complete rewrite. :fire:
The new architecture allows for a much more rubust structure and makes it easier to add more features down the line.

### Changed
- Complete rewrite
- Import the transformer through the http context in the controller.
- Allow transformers to define `defaultIncludes` that will be appended to the result.
- 100% test coverage! :star:



## [0.0.2] - 2018-02-07

No new features. Only improvements for project management and a future release.

### Added
- Added first basic tests
- Added travis-ci integration
- Added configuration for coveralls



## [0.0.1] - 2018-01-31

Initial release to npm.
