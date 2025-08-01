import styles from './Card.module.css';

export interface CardProps {
  name: string;
  url: string;
  description?: string;
  onClick?: () => void;
  isChecked: boolean;
  onToggle: () => void;
}

const Card = ({
  name,
  url,
  description,
  onClick,
  isChecked,
  onToggle,
}: CardProps) => {
  const checkboxId = `checkbox-${name.replace(/\s+/g, '-')}`;

  return (
    <div className={styles.card}>
      <div
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
      <p className={styles.checkboxContainer}>
        <label htmlFor={checkboxId} className={styles.checkboxLabel}>
          Выбрать персонаж:
        </label>
        <input
          type="checkbox"
          id={checkboxId}
          className={styles.checkbox}
          checked={isChecked}
          onChange={onToggle}
        />
      </p>
    </div>
  );
};

export default Card;
