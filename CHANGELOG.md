# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

This release adds optional includes that can be requested on a per-transform basis.
It is also possible to request nested includes which are going to be recursively resolved.

### Added
- Added `availableIncludes` to transformers. 
- Added `parseIncludes()` to request includes.


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
