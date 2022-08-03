const pokeImg = document.querySelector(".pokeimg");
const pokeDescription = document.querySelector(".poke-description");
const largeScreen = document.querySelector(".large-screen");
const specialMoves = document.querySelector(".special-moves");
const abilitiesContent = document.querySelector(".abilities-content");
const pokeType = document.querySelector(".pokemon-type")
const pokeID = document.querySelector(".poke-id");
const pokeName = document.querySelector(".poke-name");
const pokeAttack = document.querySelector(".poke-attack");
const pokeDefense = document.querySelector(".poke-defense");
const pokeExperience = document.querySelector(".poke-experiencie")
const pokeSpecialAttack = document.querySelector(".poke-special-attack");
const pokeSpecialDefense = document.querySelector(".poke-special-defense");
const pokeSpeed = document.querySelector(".poke-speed");
const pokeHP = document.querySelector(".poke-hp");
const greenScreen = document.querySelector(".green-screen");
const numberSearch = document.querySelector(".number-pokemon-search");
const pokeLittleName = document.querySelector(".pokemon-name-litte");
const pokedex = document.querySelector(".pokedex-container");



const BASE_API = "https://pokeapi.co/api/v2/";
const pokemon_API = `${BASE_API}pokemon/`;
const species_API = `${BASE_API}pokemon-species/`;
const pokemonNames_API = `${BASE_API}pokemon?limit=898&offset=0`;

let pokemonData = {
    abilities: [],
    type: [],
    moves: [],
};
let pokemon = 1;
let currentPokemon;
let descriptionPokemon;
let pokeNames;
let searchNumber = '';
let pokemonType = "";
let pokeMove;
let pokeMoveDescription;

const fetchData = (API) => {
    return fetch(API)
        .then((res) => res.json())
        .then((data) => data)
}

const saveLocalStorage = (pokemon) => {
    localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
}

const printPokemon = (numberPokemon) => {
    pokemonData = {
        abilities: [],
        type: [],
        moves: [],
    };
    setTimeout(() => {
        saveLocalStorage(pokemonData);
    }, 500)

    fetchData(`${pokemon_API}${numberPokemon}`).then(data => {
        currentPokemon = data;
        if (data.sprites.other.dream_world.front_default) {
            pokemonData.image = data.sprites.other.dream_world.front_default
        } else {
            pokemonData.image = data.sprites.other.home.front_default;
        }
        pokeImg.src = pokemonData.image;

        pokemonData.id = data.id;
        pokeID.textContent = "ID: " + pokemonData.id;

        pokemonData.attack = data.stats[1].base_stat;
        pokeAttack.textContent = "ATK: " + pokemonData.attack;

        pokemonData.defense = data.stats[2].base_stat;
        pokeDefense.textContent = "DEF: " + pokemonData.defense;

        pokemonData.experience = data.base_experience;
        pokeExperience.textContent = "EXP: " + pokemonData.experience;

        pokemonData.speed = data.stats[5].base_stat;
        pokeSpeed.textContent = "SPE: " + pokemonData.speed;

        pokemonData.hp = data.stats[0].base_stat;
        pokeHP.textContent = "HP: " + pokemonData.hp;

        pokemonData.specialAttack = data.stats[3].base_stat;
        pokeSpecialAttack.textContent = "SATK: " + pokemonData.specialAttack;

        pokemonData.specialDefense = data.stats[4].base_stat;
        pokeSpecialDefense.textContent = "SDEF: " + pokemonData.specialDefense;

        abilitiesContent.innerHTML = "";
        specialMoves.innerHTML = "";
        largeScreen.scrollTop = 0;



        data.abilities.map(ability => fetchData(ability.ability.url).then(data => {
            const parrafo = document.createElement("p");
            abilitiesContent.appendChild(parrafo);
            data.names.find(language => {
                if (language.language.name == "es") {
                    data.flavor_text_entries.find(description => {
                        if (description.language.name == "es") {
                            return pokemonData = { ...pokemonData, abilities: [...pokemonData.abilities, { name: language.name, description: description.flavor_text }] };
                        }
                    })
                    return language.name;
                }
            });

            pokemonData.abilities.map(ability => {
                parrafo.textContent = ability.name + ": " + ability.description;
            })
        }));


        pokemonType = "";
        fetchData(data.forms[0].url).then(data => {
            data.types.map(type => {
                fetchData(type.type.url).then(data => {
                    data.names.find(language => {
                        if (language.language.name == "es") {
                            pokemonData = { ...pokemonData, type: [...pokemonData.type, { name: language.name }] };
                            pokemonType += language.name + "  |   ";
                            return pokeType.textContent = "Tipo: " + pokemonType;
                        }
                    })
                })
            })
        })


        data.moves.map(move => {
            fetchData(move.move.url).then(data => {
                const parrafo = document.createElement("p");
                specialMoves.appendChild(parrafo);
                data.names.find(language => {
                    if (language.language.name == "es") {
                        data.flavor_text_entries.find(description => {
                            if (description.language.name == "es") {
                                pokemonData = { ...pokemonData, moves: [...pokemonData.moves, { name: language.name, description: description.flavor_text }] };
                                return pokeMoveDescription = description.flavor_text;
                            }
                        })
                        return pokeMove = language.name;
                    }
                })

                parrafo.textContent = `${pokeMove}: ${pokeMoveDescription}`;

            })
        })
        return pokemonData;


    })

}

const speciesPokemon = (numberPokemon) => {
    fetchData(`${species_API}${numberPokemon}`).then(data => {
        descriptionPokemon = data;
        pokemonData.name = data.names[6].name;
        pokeName.textContent = data.names[6].name;
        data.flavor_text_entries.find(description => {
            if (description.language.name == "es") {
                pokemonData.description = description.flavor_text;
                return pokeDescription.textContent = pokemonData.description;
            }
        })
    })
}

const namesPokemon = () => {
    fetchData(pokemonNames_API).then(data => {
        pokeNames = data;
    })
}

printPokemon(pokemon);
speciesPokemon(pokemon);
namesPokemon();
const nextPokemon = () => {
    pokemon += 1;
    printPokemon(pokemon);
    speciesPokemon(pokemon);
}

const prevPokemon = () => {
    if (pokemon > 1) {
        pokemon -= 1;
        printPokemon(pokemon);
        speciesPokemon(pokemon);
    }
}

const buttonUp = () => {
    largeScreen.scrollTop -= 15;
}

const buttonDown = () => {
    largeScreen.scrollTop += 15;
}

const searchPokemon = () => {
    printPokemon(searchNumber);
    speciesPokemon(searchNumber);
    pokemon = parseInt(searchNumber);
    numberSearch.textContent = "Buscar Pokemon";
    searchNumber = '';
    pokeLittleName.textContent = "";
}

const number1 = () => {
    checkNumber('1');
}

const number2 = () => {
    checkNumber('2');
}

const number3 = () => {
    checkNumber('3');
}
const number4 = () => {
    checkNumber('4');
}
const number5 = () => {
    checkNumber('5');
}
const number6 = () => {
    checkNumber('6');
}
const number7 = () => {
    checkNumber('7');
}
const number8 = () => {
    checkNumber('8');
}
const number9 = () => {
    checkNumber('9');
}
const number0 = () => {
    checkNumber('0');
}

const checkNumber = (number) => {
    if (searchNumber.length < 3) {
        searchNumber = searchNumber + number;
        if (searchNumber > 898) {
            numberSearch.textContent = "solo hay 898";
            searchNumber = '';
        } else {
            numberSearch.textContent = searchNumber;
            pokeLittleName.textContent = pokeNames.results[searchNumber - 1].name;
        }
    }
}

const eraseLetter = () => {
    searchNumber = searchNumber.slice(0, -1);
    if (searchNumber == '') {
        numberSearch.textContent = "Pokemon Numero";
        pokeLittleName.textContent = "";
    } else {
        numberSearch.textContent = searchNumber;
        pokeLittleName.textContent = pokeNames.results[searchNumber - 1].name;
    }
}

const pokeInfo=document.querySelector(".pokemon-info");
const pokeInfoH1 = document.querySelector(".pokemon-title");
const pokeInfoImage = document.querySelector(".pokemon-image");
const pokeInfoDescription = document.querySelector(".pokemon-description");
const pokeInfoTypes = document.querySelector(".pokemon-types");
const pokeInfoAbilities=document.querySelector(".pokemon-abilities");
const pokeInfoMoves=document.querySelector(".pokemon-moves");

const cloceData= ()=>{
    pokedex.style= "display:block"
    pokeInfo.style= "display:none"
    pokeInfoTypes.textContent="";
}

const infoButton = () => {
    pokedex.style = "display:none";
    pokeInfo.style= "display:block"
    pokeInfoH1.textContent = pokemonData.name;
    pokeInfoImage.src = pokemonData.image;
    pokeInfoDescription.textContent = pokemonData.description;
    pokemonData.type.map(type=>{
        const span = document.createElement("span");
        span.textContent=type.name;
        pokeInfoTypes.appendChild(span);
    })
    pokemonData.abilities.map(ability=>{
        const div = document.createElement("div");
        const span = document.createElement("span");
        const p=document.createElement("p");
        div.appendChild(span);
        div.appendChild(p);
        span.textContent=ability.name;
        p.textContent=ability.description;
        pokeInfoAbilities.appendChild(div);
    })

    pokemonData.moves.map(move=>{
        const div = document.createElement("div");
        const span = document.createElement("span");
        const p=document.createElement("p");
        div.appendChild(span);
        div.appendChild(p);
        span.textContent=move.name;
        p.textContent=move.description;
        pokeInfoMoves.appendChild(div);
    })
}