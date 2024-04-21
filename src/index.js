import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {useState} from 'react';
import {useEffect} from 'react';

var direction = "Down";
var highscore = 0, score=0, boardx=15, boardy=17;
function SnakeGame() {

  var [snake, setSnake] = useState([[7, 8]]);
  var [food, setFood] = useState([7, 8]);

  function moveSnake() {
    var newSnake = [];
    if (direction === "Up") {
      newSnake.push([snake[0][0]-1, snake[0][1]]);
    }
    else if (direction === "Right") {
      newSnake.push([snake[0][0], snake[0][1]+1]);
    }
    else if (direction === "Left") {
      newSnake.push([snake[0][0], snake[0][1]-1]);
    }
    else {
      newSnake.push([snake[0][0]+1, snake[0][1]]);
    }
    
    for (var i = 0; i < snake.length-1; i ++) {
      newSnake.push(snake[i]);
    }
    // eat food
    if (snake[0][0] === food[0] && snake[0][1] === food[1]) {
      newSnake.push(snake[snake.length-1]);
      score += 1;
      if (score > highscore) {
        highscore = score;
      }
      
      var foodInSnake = true, a, b;
      while (foodInSnake === true) {
        a = Math.floor(Math.random() * boardx);
        b = Math.floor(Math.random() * boardy);
        foodInSnake = false;
        for (var i = 0; i < snake.length; i ++) {
          if (a === snake[i][0] && b === snake[i][1]) {
            foodInSnake = true;
          }
        }
      }
      setFood([a, b]);
    }
    setSnake(newSnake);
    
    // hit bound or self
    if (snake[0][0] < 0 || snake[0][0] >= boardx || snake[0][1] < 0 || snake[0][1] >= boardy) {
      restart()
    }
    for (var i = 1; i < snake.length; i ++) {
      if (snake[0][0] === snake[i][0] && snake[0][1] === snake[i][1]) {
        restart();
      }
    }

    return;
  }

  function keyPress(e) {
    var key = e.code;
    if (key === "ArrowUp" && direction !== "Down" && direction !== "Up") {
      direction = "Up";
      moveSnake();
    }
    else if (key === "ArrowRight" && direction !== "Left" && direction !== "Right") {
      direction = "Right";
      moveSnake();
    }
    else if (key === "ArrowLeft" && direction !== "Right" && direction !== "Left") {
      direction = "Left";
      moveSnake();
    }
    else if (key === "ArrowDown" && direction !== "Up" && direction !== "Down") {
      direction = "Down";
      moveSnake();
    }
  }

  function restart() {
    setSnake([[7, 8]]);
    direction = "Down";
    setFood([7, 8]);
    score = 0;
  }

  function renderGrid() {
    let ret = [];

    for (var i = 0; i < boardx; i ++) {
      for (var j = 0; j < boardy; j ++) {
        var classes = "Empty Even";
        if ((i+j) % 2 !== 0) {
          classes = "Empty Odd";
        }
        if (i === food[0] && j === food[1]) {
          classes = "Empty Food";
        }
        for (var k = 0; k < snake.length; k ++) {
          if (snake[k][0] === i && snake[k][1] === j) {
            classes = "Empty Snake";
            if (k === 0) {
              classes = "Empty " +direction;
            }
          }
        }
        var unit = <div className={classes}></div>;
        ret.push(unit);
      }
    }

    return ret;
  }

  useEffect(() => { 
    var x = setInterval(moveSnake, 150);
    return () => clearInterval(x);
  });

  useEffect(() => { 
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  });

  return (
  <>
    <div className="Heading">
      <p className="Title">Snake Game!!</p>
      <span className="Scores">Score: {score} </span>
      <span className="Scores">Highscore: {highscore}</span>
    </div>
    <div className="Grid">{renderGrid()}</div>
  </>);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SnakeGame />
  </React.StrictMode>
);
