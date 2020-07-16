import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class SearchBar extends Component {
  // allows submission by pressing enter
  handleKeyPress(target) {
    if (target.charCode === 13) {
      window.$('#searchBtn').click();
    }
  }
  render() {
    return (
      <div>
        <div style={testStyle}>
          <Form.Control
            placeholder='Search for users...'
            name='pattern'
            type='text'
            onChange={() => this.props.handleChange()}
            onKeyPress={this.handleKeyPress}
          />
          <Button id='searchBtn' variant='dark' onClick={() => this.props.handleSearch()}>
            <i className='fa fa-search'></i>
          </Button>
        </div>
      </div>
    );
  }
}

const testStyle = {
  display: 'flex',
  flexDirection: 'row',
  padding: '50px 200px',
};

export default SearchBar;
