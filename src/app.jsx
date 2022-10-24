import { useEffect, useState } from 'preact/hooks'
import { Fragment } from 'preact'
import Intro from './Intro'
import About from './About'
import Help from './Help'

function writeit(from, e){ /* the magic starts here, this function requires the element from which the value is extracted and an event object */
  var keycode = e.keyCode || e.which
  e = e || window.event; /* window.event fix for browser compatibility */
  var fakeTerminal = document.getElementById("fakeTerminal"); /* get the place to write */
  const setter = document.getElementById('setter')
  var textareaValue = e.target.value; /* get the value of the textarea */
  
  fakeTerminal.innerHTML = nl2br(textareaValue)
}

function nl2br(txt){
  return txt.replace(/\n/g, "<br /> <span class='tilde'>~</span>")
}

function moveIt(count, e, value){ /* function to move the "fake caret" according to the keypress movement */
    e = e || window.event; /* window.event fix again */
    var keycode = e.keyCode || e.which; /* keycode fix */
//				alert(count); /* for debugging purposes */
    if(keycode == 37 && parseInt(cursor.style.left) >= (0-((count-1)*10))){ // if the key pressed by the user is left and the position of the cursor is greater than or equal to 0 - the number of words in the textarea - 1 * 10 then ...
      cursor.style.left = parseInt(cursor.style.left) - 10 + "px"; // move the cursor to the left
    } else if(keycode == 39 && (parseInt(cursor.style.left) + 10) <= 0){ // otherwise, if the key pressed by the user if right then check if the position of the cursor + 10 is smaller than or equal to zero if it is then ...
      cursor.style.left = parseInt(cursor.style.left) + 10 + "px"; // move the "fake caret" to the right
    }
  }

  function terminalSimulator(command) {
    
    if (!command.length) return ''
    if(!availableCommands[command.trim()]) {
      return commandNotFound(command)
    } else {
      console.log(availableCommands[command.trim()])
      return availableCommands[command.trim()]()
    }
  }

  function commandNotFound(command) {
    return 'command not found: ' + command
  }

  function catchKeyPress (e) {
    // on enter
    e = e || window.event
    var keycode = e.keyCode || e.which

    if (keycode == 13) {
      e.preventDefault()
      const setter = document.getElementById('setter')
      var fakeTerminal = document.getElementById("fakeTerminal")
      let textareaValue = e.target.value
      const splitOnNewLines = textareaValue.split('\n')
      const lastLine = splitOnNewLines[splitOnNewLines.length - 1]
      
      let commandAnswer = terminalSimulator(lastLine) || lastLine
      
      console.log(commandAnswer)
      // if(!commandAnswer) {

      //   setter.value = `${lastLine} \n`
  
      //   fakeTerminal.innerHTML = lastLine+ "<br /> <span class='tilde'>~</span>"
      // } else {
      if(commandAnswer === 'clear') return
      splitOnNewLines.pop()
      textareaValue = splitOnNewLines.length ? `${splitOnNewLines.join('\n')}\n${commandAnswer} \n` : `${commandAnswer} \n`
      setter.value = textareaValue

      fakeTerminal.innerHTML = commandAnswer
      // }
    } else {
    }

  }

  function preventBackspace(e) {
    if (e.keyCode == 8) {
      e.preventDefault()
      let textareaValue = e.target.value
      const splitOnNewLines = textareaValue.split('\n')
      const lastLine = splitOnNewLines[splitOnNewLines.length - 1]
      const updatedLastLine = lastLine.slice(0, -1)

      splitOnNewLines[splitOnNewLines.length - 1] = updatedLastLine
      setter.value = splitOnNewLines.join('\n')
      fakeTerminal.innerHTML = nl2br(textareaValue)
    }
  }

  function clearContent () {
    const allContentHTMLCollection = document.getElementById('contentContainer').children
    const allContent = [...allContentHTMLCollection]
    allContent.map((e) => {
      e.style.display = 'none'
    })
    console.log(allContentHTMLCollection)
  }

  function clear () {
    document.getElementById("fakeTerminal").innerHTML = ''
    document.getElementById('setter').value = ''
    return 'clear'
  }

  function hello () {
    return 'Oh hello there to you too!'
  }

  function about () {
    clearContent()
    document.getElementById('about').style.display = 'inline'
  }

  function help () {
    clearContent()
    document.getElementById('help').style.display = 'inline'
  }
  const availableCommands = {clear, hello, about, help}

export function App(props) {
  const [showIntro, setShowIntro] = useState(true)
  useEffect(() => {
    const loadingElement = document.getElementById('loading')
    const welcomeElement = document.getElementById('welcome')
    const cursorElement = document.getElementById('cursor')
    const setter = document.getElementById('setter')
    const tilde = document.getElementById('tilde')
    // const pressKeyTxtElement = document.getElementById('pressKeyTxt')
    const welcome2Element = document.getElementById('welcome2')

    cursorElement.style.left = '0px'
    let cursorTimer
    function keyPressed(e) {
      // pressKeyTxtElement.style.display = 'none'
      setFocusToTerminal()
      cursorElement.style.display = 'inline'
      welcome2Element.style.display = 'inline'
      welcomeElement.style.display = 'none'
      cursorTimer = setInterval(() => blink(), 500)
      document.removeEventListener('keydown', keyPressed)
      setShowIntro(true)
    }


    function setFocusToTerminal () {
      setter.focus()
    }

    function blink(){ 
      var div = document.getElementById("cursor"); 
      if(div.style.display == "none"){ 
      div.style.display = "initial"; 
      } else {
      div.style.display = "none";
      }
    }

    
    
    let timer = setTimeout(() => {
      loadingElement.style.display = 'none'
      welcomeElement.style.display = 'inline'
    }, 4000)

    let pressKeyTimer = setTimeout(() => {
      document.addEventListener('keydown', keyPressed)
      document.addEventListener("click", setFocusToTerminal)
    }, 4000)

    return () => {
      clearInterval(timer)
      clearInterval(pressKeyTimer)
      clearInterval(cursorTimer)
    }
  }, [])
  
  return (
    <Fragment>
      <span id='loading'>Loading...</span>
      <div id='welcome'>Welcome to Nderims Terminal! Press a key to continue...</div>
      <div id='welcome2'>--- Welcome to Nderims Terminal! ---</div>
      <br /><br />

      {showIntro ? <Intro /> : null}

      <div id="terminal">
        <textarea type="text" id="setter"
        onKeyDown={(e) =>{
          preventBackspace(e)
        }}
        onKeyPress={(e) => {
          catchKeyPress(e)
        }}
        onKeyUp={(event) => {
          // debugger
          writeit(this, event)
          moveIt(event.target.value.length, event, event.target.value)
         }}
        //  onKeyUp={(event) => writeit(this, event)}
        //  onKeyPress={(event) => writeit(this, event)}
         >

         </textarea>
        <div id="getter">
          <span class="tilde">~</span><span id="fakeTerminal"></span><b class="cursor" id="cursor">B</b>
        </div>
      </div>
      <div id="contentContainer">
        <div id="about" class='content'>
          <About />
        </div>
        <div id="help" className="content">
          <Help />
        </div>
      </div>
    </Fragment>
  )
}
