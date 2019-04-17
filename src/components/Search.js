import React from 'react'
import Button from './Button'

export default class Search extends React.Component {
 
  onSubmit = (e) => {
    e.preventDefault()
    const query = e.target.elements.query.value
    this.props.handleAddressResults(query)
  }
 
  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            placeholder="Search"
            name="query"
          />
          <Button text="Search" type="submit" />
        </form>
      </div>
    )
  }
}
