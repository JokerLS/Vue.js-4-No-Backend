import Vue from 'vue';
import AV from 'leancloud-storage'

var APP_ID = 'xMJJe8irRiigEbt62QJPSrh4-gzGzoHsz';
var APP_KEY = 'I5FS8LcLdhYJ4SCgTE8FM4Ob';
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//     woeds: 'Hello World!'
// }).then(function(object) {
//     alert('LeanCloud Rocks!')
// })

var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        newTodo: '',
        todoList: [],
        currentUser: null,
    },
    created: function() {
        window.onbeforeunload = ()=> {
            let dataString = JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos', dataString)
        }

        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []

        this.currentUser = this.getCurrentUser();
    },
    methods: {
        addTodo: function() {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false
            })
            this.newTodo = ''
        },
        removeTodo: function(todo) {
            let index = this.todoList.indexOf(todo)
            this.todoList.splice(index, 1)
        },
        signUp: function() {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function(error) {
                alert('注册失败')
            });
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function(error) {
                alert('登录失败')
            });
        },
        getCurrentUser: function() {
            let {id, createdAt, attributes: {username}} = AV.User.current()
            return {id, username, createdAt}

            let current = AV.User.current()
            if(current) {
                let {id, createdAt, attributes: {username}} = current
                return {id, username, createdAt}
            } else {
                return null
            }
        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }
    }
  })