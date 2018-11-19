import React, { Component, Fragment } from 'react'
import * as R from 'ramda'
import { PropTypes as T } from 'prop-types'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import SettingsIcon from '@material-ui/icons/Settings'
import withMobileDialog from '@material-ui/core/withMobileDialog'
import Checkbox from './Checkbox'
import mocksConfig from 'mocks/config'

const styles = () => ({
  button: {
    borderRadius: 0,
    position: 'fixed',
    left: 0,
    top: '50%'
  }
})

class SandboxConfigEditor extends Component {
  state = {
    mocksConfig: mocksConfig.get(),
    modalOpen: false
  }

  handleClickOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleChangeConfig = (name) => (value) => {
    mocksConfig.set(name)(value)
    this.setState((prevState) => ({
      config: {
        ...prevState,
        [name]: value
      }
    }))
  }

  render () {
    const {
      modalOpen,
      mocksConfig
    } = this.state
    const {
      classes,
      fullScreen
    } = this.props
    return (
      <Fragment>
        <Button
          className={classes.button}
          color="secondary"
          data-qa-id="open-sandbox-config-button"
          key="open-sandbox-config"
          onClick={this.handleClickOpen}
          variant="extendedFab"
        >
          <SettingsIcon />
        </Button>
        <Dialog
          aria-labelledby="form-dialog-title"
          fullScreen={fullScreen}
          key='sandbox-config-modal'
          onClose={this.handleClose}
          open={modalOpen}
        >
          <DialogTitle id="form-dialog-title">Sandbox Config</DialogTitle>
          <DialogContent>
            <Checkbox
              {...this.props}
              label="Is user registered"
              mocksConfig={mocksConfig}
              name='isUserRegistered'
              onChange={this.handleChangeConfig}
            />
            <Checkbox
              {...this.props}
              label="Is user pending registration"
              mocksConfig={mocksConfig}
              name='isUserPendingRegistration'
              onChange={this.handleChangeConfig}
            />
            <TextField
              fullWidth
              id='pendingTxID'
              label="If not empty, an unconfirmed tx will be generated in next received fake tx"
              margin="normal"
              onChange={({ target: { value } }) => this.handleChangeConfig('pendingTxID')(value)}
              placeholder=""
              value={mocksConfig.pendingTxID}
            />
          </DialogContent>
          <DialogActions>
            <Button
              data-qa-id="close-sandbox-config-button"
              onClick={this.handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    )
  }
}

SandboxConfigEditor.propTypes = {
  classes: T.object,
  fullScreen: T.bool,
  onChangeSandboxConfig: T.func,
  sandboxConfig: T.object
}

export default R.compose(
  withMobileDialog(),
  withStyles(styles)
)(SandboxConfigEditor)
