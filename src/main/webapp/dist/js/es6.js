'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//类的定义

var Animal = function () {
    //ES6中新型构造器

    function Animal(name) {
        _classCallCheck(this, Animal);

        this.name = name;
    }
    //实例方法


    _createClass(Animal, [{
        key: 'sayName',
        value: function sayName() {
            console.log('My name is ' + this.name);
        }
    }]);

    return Animal;
}();
//类的继承


var Programmer = function (_Animal) {
    _inherits(Programmer, _Animal);

    function Programmer(name) {
        _classCallCheck(this, Programmer);

        //直接调用父类构造器进行初始化
        return _possibleConstructorReturn(this, Object.getPrototypeOf(Programmer).call(this, name));
    }

    _createClass(Programmer, [{
        key: 'program',
        value: function program() {
            console.log("I'm coding...");
        }
    }]);

    return Programmer;
}(Animal);
//测试我们的类


var animal = new Animal('dummy'),
    wayou = new Programmer('wayou');
animal.sayName(); //输出 ‘My name is dummy’
wayou.sayName(); //输出 ‘My name is wayou’
wayou.program(); //输出 ‘I'm coding...