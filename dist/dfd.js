(function() {
  'use strict';

  /*
    Dfd class
   */
  var Dfd, exports;

  Dfd = (function() {

    /*
      constructor
     */
    function Dfd(scope1) {
      this.scope = scope1 != null ? scope1 : {};
      this.__queuesStack = [];
      this.__always = null;
      this.__fail = null;
      this.__done = null;
    }


    /*
      execute next function
      @method __next
      @private
     */

    Dfd.prototype.__next = function() {
      var done, err, hasError, i, queue, queues, remain;
      queues = this.__queuesStack.shift();
      if (!queues) {
        if (this.__always) {
          this.__always.apply(this.scope);
        }
        if (this.__done) {
          this.__done.apply(this.scope);
        }
        return;
      }
      i = 0;
      remain = queues.length;
      hasError = false;
      done = (function(_this) {
        return function(err) {
          _this.process = null;
          if (hasError) {
            return;
          }
          if (err) {
            if (_this.__always) {
              _this.__always.apply(_this.scope);
            }
            if (_this.__fail) {
              _this.__fail.apply(_this.scope, [err]);
            }
            hasError = true;
            return;
          }
          if (--remain <= 0) {
            _this.__next();
          }
        };
      })(this);
      this.processes = [];
      while (i < queues.length) {
        queue = queues[i++];
        try {
          this.processes.push(queue.apply(this.scope, [done]));
        } catch (error) {
          err = error;
          if (this.__always) {
            this.__always.apply(this.scope);
          }
          if (this.__fail) {
            this.__fail.apply(this.scope, [err]);
          }
          return;
        }
      }
    };


    /*
      register always function
      @method always
      @param {Function} func
     */

    Dfd.prototype.always = function(func) {
      this.__always = func;
      return this;
    };


    /*
      register error function
      @method fail
      @param {Function} func
     */

    Dfd.prototype.fail = function(func) {
      this.__fail = func;
      return this;
    };


    /*
      register final function
      @method done
      @param {Function} func
     */

    Dfd.prototype.done = function(func) {
      this.__done = func;
      return this;
    };


    /*
      register next function
      @method then
      @param {Function} func
     */

    Dfd.prototype.then = function() {
      if (typeof arguments[0] === 'function') {
        this.__queuesStack.push(Array.prototype.slice.apply(arguments));
      } else {
        this.__queuesStack.push(arguments[0]);
      }
      return this;
    };


    /*
      wait
      @method wait
      @param {Number} milliseconds
     */

    Dfd.prototype.wait = function(milliseconds) {
      this.then(function(done) {
        return setTimeout(function() {
          return done();
        }, milliseconds);
      });
      return this;
    };


    /*
      処理を開始する
      @method resolve
     */

    Dfd.prototype.resolve = function() {
      this.__next();
      return this;
    };


    /*
      処理を中止する
      @method interrupt
     */

    Dfd.prototype.interrupt = function() {
      var j, len, process, ref;
      if (this.processes) {
        ref = this.processes;
        for (j = 0, len = ref.length; j < len; j++) {
          process = ref[j];
          if (typeof process.abort === 'function') {
            process.abort();
          }
          if (typeof process.interrupt === 'function') {
            process.interrupt();
          }
        }
        this.processes = null;
      }
      this.__queuesStack = [];
      if (this.__always) {
        this.__always.apply(this.scope);
      }
      if (this.__done) {
        this.__done.apply(this.scope);
      }
      this.__always = null;
      this.__done = null;
      return this;
    };

    return Dfd;

  })();


  /*
    exports
   */

  if (typeof module !== "undefined" && module !== null ? module.exports : void 0) {
    module.exports = function(scope) {
      return new Dfd(scope);
    };
  } else if (typeof exports !== "undefined" && exports !== null) {
    exports = function(scope) {
      return new Dfd(scope);
    };
  } else if (typeof window !== "undefined" && window !== null) {
    window.dfd = function(scope) {
      return new Dfd(scope);
    };
  }

}).call(this);
