import styles from './Card.module.css';

export interface CardProps {
  name: string;
  url: string;
  description?: string;
}

const Card = ({ name, url, description }: CardProps) => {
  return (
    <div className={styles.card}>
      <img src={url} alt={name} />
      <h3>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default Card;
