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
let pokeNames;
let searchNumber = '';
let pokemonType = "";
let pokeMove;
let pokeMoveDescription;
let abilitiesPokemon=[];
let abilitiesDescription=[];
let pokemonMoves=[]
let MovesDescription=[]

const fetchData = async(urlApi) => {
    const response= await fetch(urlApi)
    const data = await response.json()
    return data;
}

const saveLocalStorage = (pokemon) => {
    console.log(pokemon);
    localStorage.setItem(pokemon.id, JSON.stringify(pokemon));
}

const pokemonJson = async(numberPokemon) => {
    try{
        const pokemon= await fetchData(`${pokemon_API}${numberPokemon}`);
        const formsUrl= await fetchData(pokemon.forms[0].url);
        const species= await fetchData(`${species_API}${numberPokemon}`)

        abilitiesContent.innerHTML = "";
        specialMoves.innerHTML = "";
        largeScreen.scrollTop = 0;
        pokemonType = "";

        if (pokemon.sprites.other.dream_world.front_default) {
            pokemonData.image = pokemon.sprites.other.dream_world.front_default
        } else {
            pokemonData.image = pokemon.sprites.other.home.front_default;
        }
        pokemonData.id = pokemon.id;
        pokemonData.name = species.names[6].name;
        pokemonData.attack = pokemon.stats[1].base_stat;
        pokemonData.defense = pokemon.stats[2].base_stat;
        pokemonData.experience = pokemon.base_experience;
        pokemonData.speed = pokemon.stats[5].base_stat;
        pokemonData.hp = pokemon.stats[0].base_stat;
        pokemonData.specialAttack = pokemon.stats[3].base_stat;
        pokemonData.specialDefense = pokemon.stats[4].base_stat;

        const abilityUrl= await Promise.all(
            pokemon.abilities.map((ability)=>{
                return fetchData(ability.ability.url);;
            })
        );

        const abilityName= abilityUrl.map((ability)=>{
                return ability.names
        });

        abilityName.forEach(language=>{
            language.find(idioma=>{
                if(idioma.language.name=="es"){
                    return abilitiesPokemon.push(idioma.name);
                  }
            })
        })

        abilityUrl.forEach(description=>{
            description.flavor_text_entries.find(item=>{
                if(item.language.name=="es"){
                    return abilitiesDescription.push(item.flavor_text);
                }
            })
        })

        abilitiesPokemon.forEach((ability, index)=>{
            pokemonData.abilities.push( {name: ability, description: abilitiesDescription[index] });
        })

        const TypesPokemon= await Promise.all(
            formsUrl.types.map((type)=>{
                return fetchData(type.type.url);
            })
        );

        TypesPokemon.forEach(language=>{
            language.names.find(item=>{
                if(item.language.name=="es"){
                    return pokemonData.type.push(item.name)
                }
            })
        })
        
        const movesPokemon= await Promise.all(
            pokemon.moves.map(move=>{
                return fetchData(move.move.url);
            })
        );

        movesPokemon.forEach(language=>{
            language.names.find(idioma=>{
                if(idioma.language.name=="es"){
                    return pokemonMoves.push(idioma.name);
                  }
            })
            language.flavor_text_entries.find(item=>{
                if(item.language.name=="es"){
                    return MovesDescription.push(item.flavor_text);
                }
            })
        })

        pokemonMoves.map((item,index)=>{
            pokemonData.moves.push({ name: item, description: MovesDescription[index] });
        })

        species.flavor_text_entries.find(description => {
            if (description.language.name == "es") {
                return pokemonData.description = description.flavor_text;
            }
        })

        pokedexPrint();
        saveLocalStorage(pokemonData);
    }catch (error){
        console.log(error);
    }
}

const pokedexPrint= ()=>{
    pokeImg.src = pokemonData.image;
    pokeID.textContent = "ID: " + pokemonData.id;
    pokeName.textContent = pokemonData.name;
    pokeDescription.textContent =pokemonData.description;
    pokeAttack.textContent = "ATK: " + pokemonData.attack;
    pokeDefense.textContent = "DEF: " + pokemonData.defense;
    pokeExperience.textContent = "EXP: " + pokemonData.experience;
    pokeSpeed.textContent = "SPE: " + pokemonData.speed;
    pokeHP.textContent = "HP: " + pokemonData.hp;
    pokeSpecialAttack.textContent = "SATK: " + pokemonData.specialAttack;
    pokeSpecialDefense.textContent = "SDEF: " + pokemonData.specialDefense;

    pokemonData.abilities.forEach(ability=>{
        const parrafo = document.createElement("p");
        abilitiesContent.appendChild(parrafo);
        parrafo.textContent = ability.name + ": " + ability.description;
    })

    pokemonData.type.forEach(type=>{
        pokemonType += type + "  |   ";
    })
    pokeType.textContent = "Tipo: " + pokemonType;

    pokemonData.moves.forEach(move=>{
        const parrafo = document.createElement("p");
        specialMoves.appendChild(parrafo);
        parrafo.textContent = `${move.name}: ${move.description}`;
    })
}

const namesPokemon = (async() => {
    pokeNames= await fetchData(pokemonNames_API)
})();


pokemonJson(pokemon);
const nextPokemon = () => {
    pokemon += 1;
    pokemonJson(pokemon);
}

const prevPokemon = () => {
    if (pokemon > 1) {
        pokemon -= 1;
        pokemonJson(pokemon);
    }
}

const buttonUp = () => {
    largeScreen.scrollTop -= 15;
}

const buttonDown = () => {
    largeScreen.scrollTop += 15;
}

const searchPokemon = () => {
    pokemonJson(searchNumber);
    pokemon = parseInt(searchNumber);
    numberSearch.textContent = "Buscar Pokemon";
    searchNumber = '';
    pokeLittleName.textContent = "";
}

const number = (x) => {
    checkNumber(x);
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
    console.log(pokemonData)
    pokemonData.type.map(type=>{
        const span = document.createElement("span");
        span.textContent=type;
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