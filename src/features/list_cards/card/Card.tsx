import { Component } from 'react';
import styles from './Card.module.css';

interface CardProps {
  name: string;
  url: string;
}

class Card extends Component<CardProps> {
  render() {
    const { name } = this.props;
    return (
      <div className={styles.card}>
        <h3>{name}</h3>
      </div>
    );
  }
}

export default Card;
