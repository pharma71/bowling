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

    this.zeroKegel=[
      [null,null,null,null],
      [null,null,null],
      [null,null],
      [null]
    ];

    this.result = this.result.bind(this)
    this.wurf = this.wurf.bind(this)
  }

  wurf(){
    // simuliere getroffene pins pro wurf
  
      let{pins,hits,wurf} = this.state;

      if(wurf<3){

        pins.forEach((element,reihe) => {
          element.forEach((elem,pin) => {
            if(!elem){
              let result = Math.random();
              let treffer = result > 0.5 ? true : null;
              if(treffer){
                pins[reihe][pin] = treffer;
                hits ++;
              }
            } 
          })
        });
        
      }

      this.setState({
        pins: pins,
        hits: hits
      },()=>this.result())
 
  }

  result(){
    // ergebnis des wurfes (strike, spare)
    
    let {wurf,result,hits,pins,frames,currentFrame} = this.state;
    
    if(wurf === 2){

      result = (hits === 10) ? 'Spare' : hits
      frames[this.state.currentFrame] = hits;
      hits = 0;
      currentFrame ++;
      wurf = 1;
      result = null;
      pins = this.getZeroPins()
    }else if(wurf === 1){
      
      result = (hits === 10) ? 'Strike' : hits 
      wurf ++;
    }
       

    this.setState({
      pins: pins,
      hits: hits,
      currentFrame: currentFrame,
      result: result,
      wurf: wurf,
      frames: frames
    },()=>{})
   
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
    return [
      [null,null,null,null],
      [null,null,null],
      [null,null],
      [null]
    ]; 
  }

  render(){
    return(
      <div className="App">

      <Frames 
        frame={this.state.currentFrame}
        frames={this.state.frames}
        handleClick={() => this.wurf()}
        handleReset={() => this.reset()}
        wurf={this.state.wurf}
      />
      <Pins pins={this.state.pins}/>
      {this.state.result??this.state.hits}
      </div>
    )
  }
}

function Frames({wurf, frames, frame, handleClick, handleReset}){

  // stelle 10 frames dar bei 2 wurf pro spieler
  let durchgang = wurf < 3 ? 'Wurf: ' + wurf : 'Next Frame';
  let frameCells = [];
  let resultCells = [];
  let total = 0;

  Object.keys(frames).forEach((element,index)=>{
    frameCells.push(<td key={index}>{element}</td>);
    resultCells.push(<td key={index}>{frames[element]}</td>);
    total = total + parseInt(frames[element]);
  })
    frameCells.push(<td key="overview">Total</td>);
    resultCells.push(<td key="total">{total}</td>)

  return(
    <div>
      Current Frame: {frame > 10 ? 'End of Game' : frame}&nbsp;&nbsp;
      <button disabled={frame > 10 ? 'disabled' : ''} onClick={handleClick}>{durchgang}</button>
      <button onClick={handleReset}>Reset</button>
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
