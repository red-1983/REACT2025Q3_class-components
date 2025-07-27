import { useEffect, useState } from 'react';
import { Character } from '../../features/list_cards/ListCards';
import Spinner from '../../components/Spinner/Spinner';
import styles from './CharacterDetail.module.css';

interface CharacterDetailProps {
  characterId: number;
  onClose: () => void;
}

const CharacterDetail = ({ characterId, onClose }: CharacterDetailProps) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://rickandmortyapi.com/api/character/${characterId}`
        );
        if (!response.ok) {
          throw new Error(`Персонаж с ID ${characterId} не найден.`);
        }
        const data: Character = await response.json();
        setCharacter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [characterId]);

  if (loading) {
    return (
      <aside className={styles.detailSection}>
        <Spinner />
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={styles.detailSection}>
        <div className={styles.errorMessage}>
          <p>{error}</p>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
      </aside>
    );
  }

  if (!character) return null;

  return (
    <aside className={styles.detailSection}>
      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Закрыть"
      >
        &times;
      </button>
      <img
        src={character.image}
        alt={character.name}
        className={styles.characterImage}
      />
      <h2>{character.name}</h2>
      <ul className={styles.detailsList}>
        <li>
          <strong>Статус:</strong> {character.status}
        </li>
        <li>
          <strong>Вид:</strong> {character.species}
        </li>
      </ul>
    </aside>
  );
};

export default CharacterDetail;
