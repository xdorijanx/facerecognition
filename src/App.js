import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";

const app = new Clarifai.App({
  apiKey: "18ea513bd90044788f3b3a22fdcda90c"
});

const particlesOptions = {
  particles: {
    number: {
      value: 300,
      density: {
        enable: true
      }
    }
  }
};
class App extends Component {
  state = {
    input: "",
    imageUrl: '',
    box: {

    }
  };
  calculateFaceLocation = (data) => {
     const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width)
     const height = Number(image.height)
     return {
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
     }
  } 

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({box: box})
  }
  onInputChange = e => {
    console.log(e.target.value);
    this.setState({input: e.target.value})
  };

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    console.log("click");
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      )
      .then(res => {
        this.displayFaceBox(this.calculateFaceLocation(res))
      })
      .catch(err => console.log('[ERROR]:', err))
  };
  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
    );
  }
}

export default App;
