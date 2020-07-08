import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
    <div >
      test 123
      <Link to={'./'}>
        <button variant="raised">
            Go back
        </button>
      </Link>
    </div>
    );
  }
}
export default Home;