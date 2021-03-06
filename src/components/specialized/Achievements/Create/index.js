import React, { Component, Fragment } from 'react'
import * as R from 'ramda'
import network from 'configurables/network'
import { PropTypes as T } from 'prop-types'
import TextField from '@material-ui/core/TextField'
import DialogContentText from '@material-ui/core/DialogContentText'
import withContainer from './container'
import Modal from 'components/shared/Modal'
import NetworkLinkHelp from './NetworkLinkHelp'
import StarIcon from '@material-ui/icons/Star'
import { withStyles } from '@material-ui/core/styles'

const LINK_INITIAL_VALUE = ''
const TITLE_INITIAL_VALUE = ''
const MAX_TITLE_CARACTERS = 60

const initialForm = {
  isLinkValid: false,
  isTitleValid: false,
  link: LINK_INITIAL_VALUE,
  title: TITLE_INITIAL_VALUE
}

const styles = (theme) => ({
  openButton: {
    [theme.breakpoints.down('sm')]: {
      color: '#FFF',
      backgroundColor: theme.palette.primary.light,
      borderRadius: '0',
      position: 'fixed',
      zIndex: 1,
      width: '100%',
      height: theme.spacing.unit * 7,
      bottom: theme.spacing.unit * 6,
      '&:hover': {
        backgroundColor: theme.palette.primary.light
      },
      '&:active': {
        backgroundColor: theme.palette.primary.light
      },
      '&:focus': {
        backgroundColor: theme.palette.primary.light
      }
    }
  }
})

class CreateAchievement extends Component {
  state = initialForm

  handleChange = name => e => {
    const value = e.target.value
    if (name === 'link') {
      const isLinkValid = network.inputs.link.isValid({ previousLink: '' })(value)
      this.setState({ link: value, isLinkValid })
    } else if (name === 'title') {
      const isTitleValid = value.length > 0 && value.length <= MAX_TITLE_CARACTERS
      this.setState({ title: value, isTitleValid })
    }
  }

  handleConfirm = () => {
    const { createAchievement } = this.props
    const { link, title } = this.state
    createAchievement({ link, title })
    this.resetForm()
  }

  resetForm = () => this.setState(initialForm)

  render () {
    const { isLinkValid, isTitleValid, link, title } = this.state
    const { classes, isPrimaryWalletReady } = this.props
    const isFormValid = isLinkValid && isTitleValid
    return (
      <Modal
        confirmButtonDisabled={!isFormValid}
        confirmButtonText="Create"
        disabled={!isPrimaryWalletReady}
        name="achievement-create-modal"
        onConfirm={this.handleConfirm}
        openButtonText="Create Achievement"
        openButtonIcon={<StarIcon />}
        openButtonClassName={classes.openButton}
        title="Create an achievement"
        render={({ fullScreen }) => (
          <Fragment>
            <DialogContentText key="help">
              {`To create an achievement, please provide the link to your ${network.name} achievement post and provide a title for it`}
            </DialogContentText>
            <NetworkLinkHelp key="link-help" />
            <TextField
              key="link"
              autoFocus={!fullScreen}
              error={link !== LINK_INITIAL_VALUE && !isLinkValid}
              margin="normal"
              id='link'
              label={`Your ${network.name} post link`}
              value={link}
              onChange={this.handleChange('link')}
              placeholder={network.inputs.link.placeholder}
              fullWidth
              helperText={`max ${network.inputs.link.maxCaracters} caracters`}
            />
            <TextField
              key="title"
              error={title !== TITLE_INITIAL_VALUE && !isTitleValid}
              margin="normal"
              id='title'
              label="Title for you achievement"
              value={title}
              onChange={this.handleChange('title')}
              placeholder='Help the world by my action...'
              fullWidth
              helperText={`max ${MAX_TITLE_CARACTERS} caracters`}
            />
          </Fragment>
        )}
      />
    )
  }
}

CreateAchievement.propTypes = {
  classes: T.object,
  isPrimaryWalletReady: T.bool,
  createAchievement: T.func
}

export default R.compose(
  withContainer,
  withStyles(styles)
)(CreateAchievement)
