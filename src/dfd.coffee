'use strict'


###
  Dfd class
###
class Dfd

  ###
    constructor
  ###
  constructor: (@scope = {})->

    @__queuesStack = [] # queue stack
    @__always = null    # 
    @__fail = null      # 
    @__done = null      # 


  ###
    execute next function
    @method __next
    @private
  ###
  __next: ->
    queues = @__queuesStack.shift()
    
    unless queues
      @__always.apply(@scope) if @__always
      @__done.apply(@scope) if @__done
      return
    
    i = 0
    remain = queues.length
    
    hasError = false
    done = (err)=>
      @process = null
      return if hasError
      if err
        @__always.apply(@scope) if @__always
        @__fail.apply(@scope, [err]) if @__fail
        hasError = true
        return

      if --remain <= 0
        @__next()
      return
    
    @processes = []
    while i < queues.length
      queue = queues[i++]
      try
        @processes.push queue.apply(@scope, [done])
      catch err
        @__always.apply(@scope) if @__always
        @__fail.apply(@scope, [err]) if @__fail
        return
    return


  ###
    register always function
    @method always
    @param {Function} func
  ###
  always: (func) ->
    @__always = func
    return @


  ###
    register error function
    @method fail
    @param {Function} func
  ###
  fail: (func) ->
    @__fail = func
    return @


  ###
    register final function
    @method done
    @param {Function} func
  ###
  done: (func) ->
    @__done = func
    return @


  ###
    register next function
    @method then
    @param {Function} func
  ###
  then: ->
    if typeof arguments[0] == 'function'
      @__queuesStack.push(Array::slice.apply(arguments))
    else
      @__queuesStack.push(arguments[0])
    return @


  ###
    wait
    @method wait
    @param {Number} milliseconds
  ###
  wait: (milliseconds) ->
    @then (done) ->
      setTimeout ->
        done()
      , milliseconds
    return @


  ###
    処理を開始する
    @method resolve
  ###
  resolve: ->
    @__next()
    return @


  ###
    処理を中止する
    @method interrupt
  ###
  interrupt: ->
    # console.log '[Dfd] interrupt'

    if @processes
      for process in @processes
        process.abort() if typeof(process.abort) is 'function'
        process.interrupt() if typeof(process.interrupt) is 'function'
      @processes = null

    @__queuesStack = []
    @__always.apply(@scope) if @__always
    @__done.apply(@scope) if @__done
    @__always = null
    @__done = null
    return @


###
  exports
###
if module?.exports
  module.exports = (scope)-> new Dfd scope
else if exports?
  exports = (scope)-> new Dfd scope
else if window?
  window.dfd = (scope)-> new Dfd scope
