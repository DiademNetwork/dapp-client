import React from 'react'
import * as R from 'ramda'
import AchievementsList from 'components/shared/AchievementsList'
import withContainer from './container'

const AllAchievementsList = (props) => (
  <AchievementsList
    {...props}
    loadMore={(page) => props.fetch({ page })}
    noAchievementText='You have created no achievement'
  />
)

export default R.compose(
  withContainer
)(AllAchievementsList)