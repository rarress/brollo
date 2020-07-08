import React, { Component } from 'react'; 

class Home extends Component {
  render() {
    return (
    <div >
      test 123
      <Link to={'./Home.js'}>
        <button variant="raised">
            Go back
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;