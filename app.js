(function () {
'use strict';

var app=angular.module('ToDoApp', [])
.controller('ToDoListController', ToDoListController)
.controller('AlreadyDoneController', AlreadyDoneController)
.provider('ToDoListService', ToDoServiceProvider)


app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

//todo list
ToDoListController.$inject = ['ToDoListService'];
function ToDoListController(ToDoListService) {
  var todo = this;

  //get the todolist
  todo.list = ToDoListService.getToDo();

  //initialize the thing
  todo.thing = "";

  todo.addthing = function () {
    try{
    ToDoListService.addthing(todo.thing);
    }
    catch(error) {
        document.getElementById('errmessage').innerHTML=error.message;
    }
  }

  todo.removething = function (itemIndex) {
    ToDoListService.removething(itemIndex);
  };

  todo.ToDoDone = function (itemIndex) {
            ToDoListService.ToDoDone(itemIndex);
            todo.message="Completed:";
        };

}

//already completed
AlreadyDoneController.$inject = ['ToDoListService'];
    function AlreadyDoneController (ToDoListService) {
        var alreadyDone = this;

        alreadyDone.list = ToDoListService.getthingDone();

    };



// If not specified, maxItems assumed unlimited
function ToDoListService(maxItems) {
  var service = this;

  // List of shopping list
  var list = [];
  var donelist=[];

  service.addthing = function (thing) {
    if((maxItems === undefined) ||
        (maxItems !== undefined) && (list.length < maxItems)) {
      var item = {
        name: thing,
      };
      list.push(item);
    }
    else {
        throw new Error("Okay! Do these "+ list.length +" things first.");
    }
  
  };

  service.removething = function (itemIndex) {
    list.splice(itemIndex, 1);
    document.getElementById('errmessage').innerHTML="Removed";
    if(list.length==1) {
      document.getElementById('errmessage').innerHTML="Okay! Maybe add things now?";
    }
  };

  service.getToDo = function () {
    return list;
  };

  service.getthingDone = function () {
            return donelist;
        };

service.ToDoDone = function (itemIndex) {
    var removedItems = list.splice(itemIndex,1);
    var namess=donelist.push(removedItems[0]);
    document.getElementById('errmessage').innerHTML=""+namess+" thing(s) done ";
    if(list.length==0)
        {
          document.getElementById('errmessage').innerHTML="Okay. Now add again.";
        }
 };
}


function ToDoServiceProvider() {
  var provider = this;

  provider.defaults = {
    maxItems: 10
  };

  provider.$get = function () {
    var ToDoList = new ToDoListService(provider.defaults.maxItems);

    return ToDoList;
  };
}



})();