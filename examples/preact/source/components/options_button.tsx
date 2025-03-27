/* @jsx h */
import { h } from 'preact'

import { useCallback } from 'preact/hooks'
import browserAPI from 'browser'

export default function OptionsButton() {
  const onClick = useCallback(() => {
    browserAPI.runtime.openOptionsPage()
  }, [])

  return (
    <button type='button' onClick={onClick}>
      Options
    </button>
  )
}
