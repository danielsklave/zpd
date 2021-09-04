class ActivationFunction {
  constructor(func, dfunc) {
    this.func = func;
    this.dfunc = dfunc;
  }
}

let sigmoid = new ActivationFunction(
  x => 1 / (1 + Math.exp(-x)),
  y => y * (1 - y)
);



class NeuralNetwork {
  // TODO: document what a, b, c are
  constructor(a, c) {
    if (a instanceof NeuralNetwork) {
      this.input_nodes = a.input_nodes;
      this.output_nodes = a.output_nodes;

      this.weights_io = a.weights_io.copy();
      this.bias_o = a.bias_o.copy();
    } else {
      this.input_nodes = a;
      this.output_nodes = c;

      this.weights_io = new Matrix(this.output_nodes, this.input_nodes);
      this.weights_io.randomize();
      this.bias_o = new Matrix(this.output_nodes, 1);
      this.bias_o.randomize();
    }

    // TODO: copy these as well
    this.setActivationFunction();


  }

  predict(input_array) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);

    // Generating the output's output!
    let output = Matrix.multiply(this.weights_io, inputs);
    output.add(this.bias_o);
    output.map(this.activation_function.func);

    // Sending back to the caller!
    return output.toArray();
  }

  setActivationFunction(func = sigmoid) {
    this.activation_function = func;
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(data) {
    if (typeof data == 'string') {
      data = JSON.parse(data);
    }
    let nn = new NeuralNetwork(data.input_nodes, data.output_nodes);
    nn.weights_io = Matrix.deserialize(data.weights_io);
    nn.bias_o = Matrix.deserialize(data.bias_o);
    return nn;
  }


  // Adding function for neuro-evolution
  copy() {
    return new NeuralNetwork(this);
  }

  mutate(rate) {
    function mutate(val) {
      if (Math.random() < rate) {
        //return Math.random() * 1000 - 1;
        //console.log("mutate");
        return val + randomGaussian(0,0.1);
      } else {
        return val;
      }
    }
    this.weights_io.map(mutate);
    this.bias_o.map(mutate);
  }



}
