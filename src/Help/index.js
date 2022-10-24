import { Fragment } from 'preact'
export default function Help() {
  return (<Fragment>
    <h3>Help</h3>
    <div>
      <span>Commands available to this terminal are:</span>
      <ul>
        <li>about</li>
        <li>experience</li>
        <li>contact</li>
      </ul>
    </div>
  </Fragment>)
}