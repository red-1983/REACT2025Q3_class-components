import styles from './Card.module.css';

export interface CardProps {
  name: string;
  url: string;
  description?: string;
  onClick?: () => void;
}

const Card = ({ name, url, description, onClick }: CardProps) => {
  return (
    <div
      className={styles.card}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${name}`}
    >
      <img src={url} alt={name} />
      <h3>{name}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};

export default Card;
