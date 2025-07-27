import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <h1>О приложении</h1>
      <p>
        Это приложение создано в рамках обучения в The Rolling Scopes School.
      </p>
      <p>
        <strong>Автор:</strong> Yura Benza
      </p>
      <p>
        Приложение использует &nbsp;
        <a
          href="https://rickandmortyapi.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          The Rick and Morty API
        </a>
        &nbsp; для отображения информации о персонажах.
      </p>
      <p>
        Узнать больше о курсе:{' '}
        <a href="https://rs.school" target="_blank" rel="noopener noreferrer">
          RS School - React Course
        </a>
      </p>
    </div>
  );
};

export default About;
