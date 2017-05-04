import React, {Component} from 'react'
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import InlineEdit from 'react-edit-inline'

class WordTable extends Component {
  changeValue = (id, data) => this.props.updateValue(data.value, id)

  render() {
    if (!this.props.rows.length)
      return <div style={{textAlign: 'center', marginTop: 20}}>No translations with this key</div>
    
    const rowsElem = this.props.rows.map(elem =>
      <TableRow key={elem.id}>
          <TableRowColumn>{elem.language}</TableRowColumn>
          <TableRowColumn>{elem.key}</TableRowColumn>
          <TableRowColumn>
            <InlineEdit text={elem.value} change={this.changeValue.bind(this, elem.id)} paramName="value"/>
          </TableRowColumn>
        </TableRow>
    )

    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Language</TableHeaderColumn>
            <TableHeaderColumn>Key</TableHeaderColumn>
            <TableHeaderColumn>Value</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {rowsElem}
        </TableBody>
      </Table>
    )
  }
}


export default WordTable