# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.4.0] - 2018-08-30

This maintenance release brings no new functionality, but fixes a few minor issues, updates dependencies and improves documentation and tests.

### Fixed
 - Relations that were loaded but returned null will no longer be loaded twice, [#16](https://github.com/rhwilr/adonis-bumblebee/issues/16)

### Removed
 - Methods that were marked as deprecated have been removed in this release.


## [1.3.1] - 2018-05-01

Apart from deprecating a few methods that were only intended for internal use, this release also adds lots of code documentation.

### Deprecated
- These methods were only intended for internal use and the alias will be removed in a future release: `processIncludedResources`, `callIncludeFunction`, `figureOutWhichIncludes`, `createChildScopeFor`, `eagerloadIncludedResource`


## [1.3.0] - 2018-04-30

### Added
- Includes can now be requested with underscores and hyphens as the separator and will be converted to camelCase, [#15](https://github.com/rhwilr/adonis-bumblebee/pull/15) (by [@spamoom](https://github.com/spamoom))

### Fixed
- Ensure that pagination data is always an integer by explicitly casting `.pages` to Numbers, [#17](https://github.com/rhwilr/adonis-bumblebee/pull/17) (by [@spamoom](https://github.com/spamoom))


## [1.2.3] - 2018-04-25

### Fixed
- Model methods were not available in when using pagination because the model was passed through `toJSON`, [#14](https://github.com/rhwilr/adonis-bumblebee/pull/14) (by [@spamoom](https://github.com/spamoom))
- Fixed pagination data not getting reset when setting new data without pagination.


## [1.2.2] - 2018-03-26

### Fixed
- Lucid collection serialization still did not work as expected.


## [1.2.1] - 2018-03-26

### Fixed
- Lucid models did not get correctly serialized and null was returned.


## [1.2.0] - 2018-03-24

This update adds three new major features that did not quite make it into the initial release. Metadata and pagination are especially useful if you're building larger APIs.

### Added
- [Serializers](https://github.com/rhwilr/adonis-bumblebee#serializers) allow you to format the data after the transformation to a standard format. 
- [Metadata](https://github.com/rhwilr/adonis-bumblebee#metadata) are used to add extra data to the response.
- [Pagination](https://github.com/rhwilr/adonis-bumblebee#pagination) to split large datasets into multiple parts.

### Changed
- Renamed method `data` on the transform interface to `_setData` to mark it as private. 
- Improved error handling. Exceptions now have a descriptive message that describes the problem.


## [1.1.1] - 2018-03-18

### Fixed
- Prevent an exception that occurred when an already loaded relation was eager-loaded again. 


## [1.1.0] - 2018-03-18

This release adds a few new features. Nothing too exciting but they will help you write simpler and better performing APIs.

### Added
- Relations are now automatically eager-loaded if they are a lucid model and the include method is named like the relation, [#8](https://github.com/rhwilr/adonis-bumblebee/issues/8)
- The `transform` method can now return a primitive type, [#9](https://github.com/rhwilr/adonis-bumblebee/issues/9)
- You can now access the `context` from within an include function through the second parameter, [#10](https://github.com/rhwilr/adonis-bumblebee/issues/10)


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

This release is a complete rewrite.
The new architecture allows for a much more robust structure and makes it easier to add more features down the line.

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
