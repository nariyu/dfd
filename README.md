# Dfd

[![npm](https://nodei.co/npm/dfd.png?downloads=true)](https://nodei.co/npm/dfd/)

a minimal deferred-like library.

[![Build Status](https://travis-ci.org/nariyu/dfd.svg?branch=master)](https://travis-ci.org/nariyu/dfd)

## Install

### Install by Bower

```
$ bower install dfd -S
```

### Install by npm

```
$ npm install dfd --save
```

## USAGE

### Basic

HTML:

```
<script src="bower_components/dfd/dist/dfd.min.js"></script>
```

JavaScript:

```
// dfd
dfd()

// error function
.fail(function(err) {
  console.error(err);
  $('.error').show();

  setTimeout(function() { location.reload(); }, 500);
})

// next function
.then(function(cb) {
  setTimeout(function() {
    $('#func1').show();
    cb();
  }, Math.random() * 500);
})

// 1/2 error
.then(function(cb) {
  setTimeout(function() {
    if (Math.random() < .5) {
      cb();
    } else {
      cb(new Error('exec error'));
    }
  }, Math.random() * 500);
})

// next function
.then(function(cb) {
  setTimeout(function() {
    $('#func2').show();
    cb();
  }, Math.random() * 500);
})

// parallel
.then(
  function(cb) {
    setTimeout(function() {
      $('#func3').show();
      cb();
    }, Math.random() * 1000);
  },
  function(cb) {
    setTimeout(function() {
      $('#func4').show();
      cb();
    }, Math.random() * 1000);
  }
)

// next function
.then(function(cb) {
  setTimeout(function() {
    $('#func1').show();
    cb();
  }, Math.random() * 500);
})

// wait
.wait(500)

// next function
.then(function(cb) {
  $('#end').show();

  setTimeout(function() { location.reload(); }, 500);
})

// dfd start
.resolve();
```

### For Node.js or Browserify

JavaScript:

```
var dfd = require("dfd");

dfd()

.then(function(cb) {
  // CODE HERE
  cb();
})

.resolve();
```

## License
Copyright (c) 2014 Yusuke Narita
Licensed under the MIT license.
