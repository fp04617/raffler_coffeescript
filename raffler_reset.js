// Generated by CoffeeScript 1.6.3
(function() {
  var _ref, _ref1, _ref2, _ref3, _ref4,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.Raffler = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function() {
      return this;
    },
    initialize: function() {
      console.log("init");
      this.router = new Raffler.Routers.Entries();
      this.appView = this.router.appView;
      return Backbone.history.start();
    }
  };

  Raffler.Models.Entry = (function(_super) {
    __extends(Entry, _super);

    function Entry() {
      _ref = Entry.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Entry.prototype.defaults = {
      name: '',
      winner: false
    };

    return Entry;

  })(Backbone.Model);

  Raffler.Collections.Entries = (function(_super) {
    __extends(Entries, _super);

    function Entries() {
      _ref1 = Entries.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    Entries.prototype.model = Raffler.Models.Entry;

    Entries.prototype.localStorage = new Store("backbone-coffee-raffle-jasmine");

    return Entries;

  })(Backbone.Collection);

  Raffler.Views.EntriesIndex = (function(_super) {
    __extends(EntriesIndex, _super);

    function EntriesIndex() {
      _ref2 = EntriesIndex.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    EntriesIndex.prototype.template = _.template($('#item-template').html());

    EntriesIndex.prototype.initialize = function() {
      return console.log('entries view init');
    };

    EntriesIndex.prototype.render = function() {
      $(this.el).html(this.template({
        entries: this.collection.toJSON()
      }));
      return this;
    };

    EntriesIndex.prototype.events = function() {
      return {
        'click li': 'deleteEntry'
      };
    };

    EntriesIndex.prototype.deleteEntry = function(ev) {
      var item;
      console.log("delete");
      item = this.collection.find(function(model) {
        return model.get("id") === $(ev.target).attr('id');
      });
      item.destroy();
      return $('#winners').append(this.render().el);
    };

    return EntriesIndex;

  })(Backbone.View);

  Raffler.Views.AppView = (function(_super) {
    __extends(AppView, _super);

    function AppView() {
      _ref3 = AppView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    AppView.prototype.el = '#raffler';

    AppView.prototype.events = {
      'click #newvalue': 'createEntry',
      'click #resetWinner': 'clearEntries',
      'click #choosewinner': 'chooseWinner'
    };

    AppView.prototype.initialize = function() {
      console.log('app view init');
      this.view = new Raffler.Views.EntriesIndex({
        collection: this.collection
      });
      return $('#winners').html(this.view.render().el);
    };

    AppView.prototype.createEntry = function() {
      this.addPerson($('#new_entry').val());
      return $('#new_entry').val('');
    };

    AppView.prototype.addPerson = function(personName) {
      var personAdded;
      personAdded = this.collection.create({
        name: personName
      });
      $('#winners').append(this.view.render().el);
      return personAdded;
    };

    AppView.prototype.clearEntries = function() {
      var i, _i, _ref4;
      console.log(this.collection);
      for (i = _i = _ref4 = this.collection.length - 1; _i >= 0; i = _i += -1) {
        console.log(this.collection.at(i));
        this.collection.at(i).destroy();
      }
      return $('#winners').append(this.view.render().el);
    };

    AppView.prototype.clearWinners = function() {
      var element, index, _i, _len, _ref4;
      _ref4 = this.collection;
      for (index = _i = 0, _len = _ref4.length; _i < _len; index = ++_i) {
        element = _ref4[index];
        this.collection.at(index).set({
          winner: false
        });
        this.collection.at(index).save();
      }
      return $('#winners').append(this.view.render().el);
    };

    AppView.prototype.chooseWinner = function() {
      var element, index, winner, _i, _len, _ref4;
      _ref4 = this.collection;
      for (index = _i = 0, _len = _ref4.length; _i < _len; index = ++_i) {
        element = _ref4[index];
        this.collection.at(index).set({
          winner: false
        });
        this.collection.at(index).save();
      }
      winner = this.collection.shuffle()[0];
      if (winner) {
        winner.set({
          winner: true
        });
        winner.save();
      }
      return $('#winners').append(this.view.render().el);
    };

    AppView.prototype.getWinner = function() {
      var winner;
      winner = null;
      winner = this.collection.where({
        winner: true
      });
      return winner;
    };

    return AppView;

  })(Backbone.View);

  Raffler.Routers.Entries = (function(_super) {
    var appView;

    __extends(Entries, _super);

    function Entries() {
      _ref4 = Entries.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    appView = null;

    Entries.prototype.routes = {
      '': 'index',
      'entries/:id': 'show'
    };

    Entries.prototype.initialize = function() {
      console.log("initialize router");
      this.collection = new Raffler.Collections.Entries();
      this.collection.fetch();
      this.appView = new Raffler.Views.AppView({
        collection: this.collection
      });
      return this;
    };

    return Entries;

  })(Backbone.Router);

}).call(this);
