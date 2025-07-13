import { Component } from 'react';
import Card from './card/Card';

interface Pokemon {
  name: string;
  url: string;
}

interface ListCardsState {
  pokemons: Pokemon[];
}

class ListCards extends Component<{}, ListCardsState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      pokemons: [],
    };
  }

  async componentDidMount() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10');
      if (response.ok) {
        const data = await response.json();
        this.setState({ pokemons: data.results });
      } else {
        console.error('Ошибка при загрузке данных:', response.status);
      }
    } catch (error) {
      console.error('Ошибка при запросе:', error);
    }
  }

  render() {
    const { pokemons } = this.state;
    return (
      <div>
        {pokemons.map((pokemon) => (
          <Card key={pokemon.name} name={pokemon.name} url={pokemon.url} />
        ))}
      </div>
    );
  }
}

export default ListCards;
