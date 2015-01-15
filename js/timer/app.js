window.App = {};

//Model
App.Project = Backbone.Model.extend({
  initialize: function(){
  },
  defaults: {
    title: 'some texts',
    date: '0000/00/00',
    time: '0:00'
  }
});

//Collection
App.Projects = Backbone.Collection.extend({
  initialize: function(){
  },
  model: App.Project
});

//view - Model
App.ProjectView = Backbone.View.extend({
  initialize: function(){
    this.model.on('destroy', this.remove, this);
    this.model.on('chenge', this.render, this);
  },
  tagName: 'tr',
  className: 'Project',
  events: {
    'click .delet': 'destroy',
    'click .check': 'check'
  },
  destroy: function(e){
    e.preventDefault();
    this.model.destroy();
  },
  remove: function(){
    this.$el.remove();
  },
  render: function(){
    var template = _.template($('#Project-template').html());
    var html = template(this.model.toJSON());
    this.$el.html(html);
    return this;
  }
});

//view - Collection
App.ProjectsView = Backbone.View.extend({
  initialize: function(){
    this.collection.on('add', this.add, this);
  },
  tagName: 'tbody',
  add: function(project){
    var projectView = new App.ProjectView({
      model: project
    });
    this.$el.append(projectView.render().el);
  },
  render: function(){
    this.collection.each(function(project){
      var projectView = new App.ProjectView({
        model: project
      });
      this.$el.append(projectView.render().el);
    }, this);
    return this;
  }
});


//view - Collection
App.AddProjectView = Backbone.View.extend({
  el: '#add-project',
  flag: false,
  date: null,
  timer: null,
  time: 0,
  events: {
    'click .btn-start': 'toggle',
    'submit': 'toggle'
  },
  toggle: function(e){
    e.preventDefault();
    if(!$('#title').val()){
      $('#title').val('').focus();
      return;
    }
    // click start btn
    if(!this.flag){
      this.start();
    }

    // click stop btn
    if(this.flag){
      this.stop();
    }

    this.flag = !this.flag;
  },
  start: function(){
    this.time = 1;
    $('.btn-start').html('Stop')
    .removeClass('btn-success')
    .addClass('btn-danger');
    this.date = this.getDate();
    $('#title').blur().attr('disabled', 'disabled');
    $('#add-project').focus();
    this.timer = setInterval((function(){
      $('#time').html(this.chengeTime(this.time));
      this.time += 1;
    }).bind(this), 1000);
  },
  stop: function(){
    clearInterval(this.timer);
    var project = new App.Project();
    project.set({
      title: $('#title').val(),
      date: this.date,
      time: this.chengeTime(this.time),
      completed: false
    });
    this.collection.add(project);

    $('#time').html('00:00:00');
    $('.btn-start').html('Start')
    .removeClass('btn-danger')
    .addClass('btn-success');

    $('#title').removeAttr('disabled').val('').focus();
  },
  getDate: function(){
    var date = new Date();
    return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
  },
  chengeTime: function(time){
    var hour = Math.floor(time / 3600);
    var minuit = Math.floor(time / 60) - (hour * 60);
    var second = time % 60;

    var adjustTime = function (t){
      if(t < 10){
        return '0' + t;
      }
      return t;
    };

    return adjustTime(hour) + ':' + adjustTime(minuit) + ':' + adjustTime(second);
  }
});

$(function(){
  var projects = new App.Projects();

  var projectsView = new App.ProjectsView({
    collection: projects
  });

  var addProjectView = new App.AddProjectView({
    collection: projects
  });

  $('#projects-list').append(projectsView.render().el);
});