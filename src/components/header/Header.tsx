import { Component } from "react";
import styles from "./Header.module.css";
interface HeaderProps {
    title: string; 
}

interface HeaderState {
    date: Date;
}
class Header extends Component<HeaderProps, HeaderState> {
    constructor(props: HeaderProps) {
        super(props);
      
    }
  componentDidMount() {
  }

  componentWillUnmount() {
  }
    render() {
        return (
            <header className={styles.header}>
                <a href="https://pokeapi.co/"><img src='/pokeapi_256.png' alt="PokeAPI Logo"/></a>
           
            </header>
            )
        }
    }
    export default Header;