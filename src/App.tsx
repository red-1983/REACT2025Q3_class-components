import { Component } from 'react'
import {Header, Main, Footer} from './components'
import './App.css'

class App extends Component {
 
render(){
   return (
    <>
    <Header title='Заголовок'/>
    <Main>
        <p>Привет из классового компонента</p>
        <h1>Vite + React</h1>
      <div className="card">
            
      </div>
      </Main>
      <Footer/>
      <h1>Привет</h1>
      
      
    </>
  )
}
 
}

export default App
