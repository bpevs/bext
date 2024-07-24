/* @jsx h */
import { h, render } from 'preact'
import OptionsButton from './components/options_button.tsx'

const mountPoint = document.getElementById('mount')

if (mountPoint) {
  render(
    <main>
      <h1>HELLO!</h1>
      <OptionsButton />
    </main>,
    mountPoint,
  )
}
