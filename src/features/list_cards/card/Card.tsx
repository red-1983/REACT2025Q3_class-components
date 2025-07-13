import { Component } from 'react';
import styles from './Card.module.css';

interface CardProps {
  name: string;
  url: string;
  description?: string;
}

class Card extends Component<CardProps> {
  render() {
    const { name, url, description } = this.props;
    return (
      <div className={styles.card}>
        <img src={url} alt={name} />
        <h3>{name}</h3>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    );
  }
}

export default Card;
