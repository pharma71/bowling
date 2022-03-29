import './App.css';
import React from 'react';


class App extends React.Component {

  constructor(props){

    super(props)

    this.state = {
      pins: [
        [null,null,null,null],
        [null,null,null],
        [null,null],
        [null]
      ],
      zeroKegel: [
        [null,null,null,null],
        [null,null,null],
        [null,null],
        [null]
      ],
      frames: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
      },
      currentFrame: 1,
      wurf: 1,
      result: null,
      hits: 0
    }
  }

  wurf(){
    // simuliere getroffene pins pro wurf
    return new Promise((resolve) => {

      
      let pins = [...this.state.pins];
      let hits = this.state.hits;
      console.log('werfe',pins)
      pins.forEach((element,reihe) => {
        element.forEach((elem,pin) => {
          if(!elem){
            let result = Math.random();
            let treffer = result > 0.5 ? true : null;
            if(treffer){
              pins[reihe][pin] = treffer;
              hits = hits +1;
            }
          } 
        })
      });
      console.log('speichere pins',pins)
      this.setState({
        pins: pins,
        hits: hits
      },resolve(hits))
    }); 
  }

  result(){
    // ergebnis des wurfes (strike, spare)
    
    let {wurf,hits,result} = this.state;

    if(wurf<3){
      this.wurf()
      .then((treffer)=>{
        console.log('neuer wurf',this.state.zeroKegel,this.state.pins);
        hits = treffer;
        if(wurf === 1 && hits === 10){
          result = 'Strike'
        }
        else if(wurf === 2 && hits === 10){
          result = 'Spare'
        }
        else{
          result = hits;
        }
        wurf = wurf +1;
        this.setState({
          wurf: wurf,
          result: result
        })
      })
    }else{

      let  frames = this.state.frames;
      frames[this.state.currentFrame] = this.state.hits;
      const pins = [...this.getZeroPins()];
      let currentFrame= this.state.currentFrame;
      currentFrame = currentFrame +1;

      this.setState({
        pins: [
          [null,null,null,null],
          [null,null,null],
          [null,null],
          [null]
        ],
        hits: 0,
        currentFrame: currentFrame,
        result: null,
        wurf: 1,
        frames: frames
      },()=>console.log('neuer Frame',this.state.zeroKegel,this.state.pins))
    }
  }

  reset(){
    this.setState({
      pins: [
        [null,null,null,null],
        [null,null,null],
        [null,null],
        [null]
      ],
      frames: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
      },
      currentFrame: 1,
      wurf: 1,
      result: null,
      hits: 0
    });
  }

  getZeroPins(){
    return this.state.zeroKegel;
  }

  render(){
    return(
      <div className="App">

      <Frames 
        frame={this.state.currentFrame}
        frames={this.state.frames}
        handleClick={() => this.result()}
        handleReset={() => this.reset()}
        wurf={this.state.wurf}
      />
      <Pins pins={this.state.pins}/>
      {this.state.result??this.state.hits}
      </div>
    )
  }
}

function Frames(props){
  // stelle 10 frames dar bei 2 wurf pro spieler
  let durchgang = props.wurf;
  durchgang = durchgang < 3 ? 'Wurf: ' + durchgang : 'Next Frame';
  const frames = props.frames;
  let frameCells = [];
  let resultCells = [];
  let total = 0;
  Object.keys(frames).forEach((element,index)=>{
    frameCells.push(<td>{element}</td>);
    resultCells.push(<td>{frames[element]}</td>);
    total = total + parseInt(frames[element]);
  })
    frameCells.push(<td>Total</td>);
    resultCells.push(<td>{total}</td>)

  return(
    <div>
      Current Frame: {props.frame}&nbsp;&nbsp;
      <button onClick={props.handleClick}>{durchgang}</button>
      <button onClick={props.handleReset}>Reset</button>
      <div>
        <table style={{border: '1px solid red', marginLeft: 'auto', marginRight: 'auto'}}>
          <thead></thead>
          <tbody>
          <tr>{frameCells}</tr>
          <tr>{resultCells}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pins(props) {
  
  const {pins} = props;
  let buttons = [
    [],[],[],[]
  ]
  pins.forEach((element,reihe) => {
    element.forEach((element,index) => {
      const value = pins[reihe][index] ? 'x': 'o'
      const mybutton = <button>{value}</button>
      buttons[reihe].push(mybutton)
    });
    buttons[reihe].push(<br />)
  })
  return (
      buttons 
  );
}

export default App;
