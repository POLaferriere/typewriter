import React from 'react';
import $ from 'jquery';
import dynamics from 'dynamics.js'

var App = React.createClass({
  getInitialState() {
    return {
      value: '',
      letters: [],
      index: 0,
    }
  },

  componentDidMount() {
    $('.input').focus();
  },

  focusInput() {
    $('.input').focus();  
  },

  handleKey(e) {
    let containerSelector = '.' + 'container'+ this.state.index;
    let selector = "." + 'letter' + this.state.index;
    let rotationSelector = '.' + 'rotation' + this.state.index;
    let colorSelector = '.' + 'color'  + this.state.index; 
    
    this.state.letters.push(e.target.value);
    this.setState({
      letters: this.state.letters
    })

    setTimeout(() => {
      dynamics.animate(document.querySelector(rotationSelector), {
        translateY: Math.floor(Math.random()*-300-100),
      }, {
        type: dynamics.forceWithGravity,
        duration: 2000,
        bounciness: 800,
        elasticity: 300,
        initalForce: true,
      })

      dynamics.animate(document.querySelector(containerSelector), {
        translateX: Math.floor(Math.random()*600) * (Math.floor(Math.random()*2) == 1 ? 1 : -1),
      }, {
        type: dynamics.easeOut,
        duration: 2000,
        complete: () => {
          dynamics.animate(document.querySelector(containerSelector), {
            opacity: 0,
          }, {
            type: dynamics.easeIn,
          })
        }
      })

      function rotate() {
        let rotationTime = Math.floor(Math.random()*2000);
        let rotationDir = (Math.floor(Math.random()*2) == 1 ? 1 : -1)
        dynamics.animate(document.querySelector(selector), {
          rotateZ: 180 * rotationDir
        }, {
          duration: rotationTime,
          type: dynamics.linear,
          complete: () => {
            dynamics.setTimeout(() => {
              dynamics.stop(document.querySelector(selector))
            }, 2000-Math.abs(rotationTime));
            dynamics.animate(document.querySelector(selector), {
              rotateZ: 360 * rotationDir,
            }, {
              duration: rotationTime,
              type: dynamics.linear,
              complete: () => {rotate()}
            })
          },
        })
      }

      rotate();
    }, 0)

    this.state.index++;
  },
  render() {
    let style = {color: function randomizeColor() {
      var color = []
      var i = 0;
      while (i < 6 ) {
        color.push(Math.round(Math.random()*16).toString(16));
        i++;
      }
      return '#' + color.join('');
    }}

    return (
      <div className='app' onClick={this.focusInput}>
        <div className="letters">
          {this.state.letters.map((letter, ind) => {
            return (
              <div key={ind} className={"container" + ind + " letter-container"}>
                <div className={'rotation' + ind}>
                  <div className={'color' + ind}>
                    <p className={"letter letter" + ind}>{letter}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <hr/>
        <input className='input'type="text" onChange={this.handleKey} value={this.state.value}/>
        <h1 className="title">Type Anything</h1>
      </div>
    );
  }

});

export default App;
