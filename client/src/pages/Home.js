import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component {
  render() {
    return (
    <div >
      <h1>Project Home</h1> 
      <Link to={'./test'}>
        <button variant="raised">
            Go to /test
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;