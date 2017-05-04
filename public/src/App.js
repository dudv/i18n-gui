import React, { Component } from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar'
import TextField from 'material-ui/TextField'
import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'

import WordTable from './WordTable'

import { connect } from 'react-redux'
import { selectBundle, getBundleList, getTokenList, addToken, updateToken, setSnackbarState } from './store/actions'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      key: '',
      value: ''
    }
  }

  componentDidMount() {
    this.props.getBundleList()
  }

  handleBundleChange = (event, index, value) => {
    this.props.selectBundle(value)
  }

  requestTableData = (key) => this.props.getTokenList(this.props.bundle, key)

  addKey = () => {
    const newToken = {
      bundle: this.props.bundle,
      key: this.state.key,
      value: this.state.value,
      language: 'DEF'
    }
    this.props.addToken(newToken)
  }

  searchKey = () => {
    this.requestTableData(this.state.key)
  }

  updateKey = (value, id) => {
    this.props.updateToken({id, value, bundle: this.props.bundle, key: this.state.key})
  }

  setKey = (event) => this.setState({key: event.target.value})
  setValue = (event) => this.setState({value: event.target.value})

  render() {
    const bundleItems = this.props.bundles
      .map((item, i) => <MenuItem key={i} value={item} primaryText={item} />)
    const tableRows = this.props.tableRows

    return (
      <MuiThemeProvider>
        <Paper zDepth={1} className="container">
           <Toolbar>
            <ToolbarGroup firstChild={true}>
              <SelectField
                value={this.props.bundle}
                onChange={this.handleBundleChange}
                maxHeight={200}
                autoWidth={true}
                hintText='select bundle'
                style={{maxWidth: 180, marginLeft: 20}}>
                {bundleItems}
              </SelectField>
              <TextField hintText="Key" style={{maxWidth: 200, marginLeft: 20}} onBlur={this.setKey}/>
              <TextField hintText="Value" style={{marginLeft: 20}} onBlur={this.setValue}/>
            </ToolbarGroup>
            <ToolbarGroup>
              <RaisedButton label="Add" primary={true} onClick={this.addKey} disabled={!this.props.bundle || !this.state.key || !this.state.value}/>
              <RaisedButton label="Search" secondary={true} onClick={this.searchKey} disabled={!this.props.bundle || !this.state.key}/>
            </ToolbarGroup>
          </Toolbar>
          <WordTable rows={tableRows} updateValue={this.updateKey}/>
          { this.props.loading ? <CircularProgress /> : null }
          <Snackbar
            open={this.props.snackbar.isVisible}
            message={this.props.snackbar.message}
            autoHideDuration={4000}
            onRequestClose={() => this.props.setSnackbarState(false)}
          />
        </Paper>
      </MuiThemeProvider>
    )
  }
}

function mapStateToProps(state) {
  return {
    bundle: state.bundle || '',
    bundles: state.bundleList,
    tableRows: state.tokenList,
    loading: state.isLoading,
    snackbar: state.snackbar,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectBundle: (bundle) => dispatch(selectBundle(bundle)),
    getBundleList: () => dispatch(getBundleList()),
    getTokenList: (bundle, key) => dispatch(getTokenList(bundle, key)),
    addToken: (token) => dispatch(addToken(token)),
    updateToken: (token) => dispatch(updateToken(token)),
    setSnackbarState: (isVisible, message='') => dispatch(setSnackbarState(isVisible, message))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)