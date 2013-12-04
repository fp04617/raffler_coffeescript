window.Raffler = 
  Models: {}
  Collections: {}
  Views: {}
  Routers:{}    
  init: ->
    this    
  initialize: ->
    console.log "init"
    this.router = new Raffler.Routers.Entries()
    this.appView =  this.router.appView
    Backbone.history.start()
    

class Raffler.Models.Entry extends Backbone.Model
  defaults: 
    name:''
    winner: false
    
class Raffler.Collections.Entries extends Backbone.Collection
  model: Raffler.Models.Entry
  localStorage: new Store("backbone-coffee-raffle-jasmine")
  
class Raffler.Views.EntriesIndex extends Backbone.View
  template:  _.template($('#item-template').html())  
 
  initialize: ->
    console.log 'entries view init' 
  render: ->
    $(@el).html(@template(entries: @collection.toJSON()))
    @
  events: ->
    'click li': 'deleteEntry'
  deleteEntry: (ev) ->
    console.log "delete"
    item=@collection.find (model) ->
      model.get("id") is $(ev.target).attr('id')
    item.destroy()
    $('#winners').append(@render().el)   
   
    
class Raffler.Views.AppView extends Backbone.View
  el: '#raffler'
  events:
    'click #newvalue': 'createEntry'
    'click #resetWinner': 'clearEntries'
    'click #choosewinner': 'chooseWinner'
  initialize: ->
    console.log 'app view init'     
    @view = new Raffler.Views.EntriesIndex(collection: @collection)    
    $('#winners').html(@view.render().el)
  createEntry:  ->
    #console.log @collection
    @addPerson($('#new_entry').val())   
    $('#new_entry').val('')    
   
  addPerson: (personName) ->
    personAdded = @collection.create name: personName
    $('#winners').append(@view.render().el)  
    personAdded
  clearEntries: ->
    console.log @collection
    for i in [@collection.length-1..0] by -1
      console.log @collection.at(i)
      @collection.at(i).destroy()    
    $('#winners').append(@view.render().el)   
  clearWinners: ->
    for element, index in @collection
      @collection.at(index).set(winner:false)
      @collection.at(index).save()
    $('#winners').append(@view.render().el) 
  chooseWinner: -> 
    for element, index in @collection
      @collection.at(index).set(winner:false)
      @collection.at(index).save()
    winner = @collection.shuffle()[0]
    if winner
      winner.set(winner: true)
      winner.save()    
    $('#winners').append(@view.render().el)     
  getWinner: ->
    winner = null
    winner= @collection.where(winner: true)
    winner

    
class Raffler.Routers.Entries extends Backbone.Router
  appView = null
  routes:
    '': 'index'
    'entries/:id': 'show'
  initialize: ->
    console.log "initialize router"
    @collection = new Raffler.Collections.Entries()
    @collection.fetch()    
    this.appView = new Raffler.Views.AppView(collection: @collection)     
    @    
  
    
    
   