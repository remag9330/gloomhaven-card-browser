import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import { useSpoilers } from "../hooks/useSpoilers";
import { characters } from "../data/common";
import SvgCharacterIcon from "./svg";

function CharacterSpoiler({ char }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleCharacterSpoilerToggle() {
    const id = char.id;
    let newSet = spoilers.characters;

    if (spoilers.characters?.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    updateSpoilers({ ...spoilers, characters: newSet });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({ ...spoilers, characters: Array.from(newSet) })
    );
  }

  return (
    <li className="spoiler-check-option">
      <input
        checked={spoilers.characters.has(char.id)}
        onChange={handleCharacterSpoilerToggle}
        style={{ accentColor: char.colour }}
        type="checkbox"
      />
      <SvgCharacterIcon character={char.id} />
      <span>{char.name}</span>
    </li>
  );
}

function ItemSpoiler({ label, path }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleItemSpoilerToggle() {
    let newSpoilers = { ...spoilers };
    newSpoilers.items[path] = !spoilers.items[path];

    updateSpoilers(newSpoilers);
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...newSpoilers,
        characters: Array.from(newSpoilers.characters),
      })
    );
  }

  return (
    <div className="spoiler-check-option">
      <input
        checked={spoilers.items[path]}
        onChange={handleItemSpoilerToggle}
        type="checkbox"
      />
      <span>{label}</span>
    </div>
  );
}

function ProsperitySpoiler({ level }) {
  const { spoilers, updateSpoilers } = useSpoilers();

  function handleProsperityChange() {
    updateSpoilers({
      ...spoilers,
      items: { ...spoilers.items, prosperity: level },
    });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        characters: Array.from(spoilers.characters),
        items: { ...spoilers.items, prosperity: level },
      })
    );
  }

  return (
    <li className="flex">
      <input
        checked={spoilers.items.prosperity === level}
        className="prosperity-option"
        onChange={handleProsperityChange}
        type="radio"
      />
      <span>{level}</span>
    </li>
  );
}

function Spoilers({ open, onClose }) {
  const { spoilers, updateSpoilers } = useSpoilers();
  const unlockabelClasses = characters.filter((c) => !c.base);

  function handleCharacterSpoilerToggleAll() {
    let newArr = [];
    if (unlockabelClasses.some((c) => !spoilers.characters.has(c.id))) {
      newArr = unlockabelClasses.map((c) => c.id);
    }

    updateSpoilers({ ...spoilers, characters: new Set(newArr) });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        ...spoilers,
        characters: newArr,
      })
    );
  }

  function handleItemSpoilerToggleAll() {
    let items = { prosperity: "9", recipes: true, other: true };
    if (allItemSpoilers) {
      items = { prosperity: "1", recipes: false, other: false };
    }
    updateSpoilers({
      ...spoilers,
      items: items,
    });
    localStorage.setItem(
      "spoilers",
      JSON.stringify({
        characters: Array.from(spoilers.characters),
        items: items,
      })
    );
  }

  const allCharacterSpoilers = unlockabelClasses.every((c) =>
    spoilers.characters.has(c.id)
  );
  const allItemSpoilers =
    spoilers.items.recipes &&
    spoilers.items.other &&
    spoilers.items.prosperity === "9";

  return (
    <>
      <div
        className="spoilers-overlay"
        onClick={onClose}
        style={{ display: open ? "block" : "none" }}
      />
      <div className="spoilers" style={{ width: open ? "360px" : "0px" }}>
        <div className="spoilers-inner">
          <FontAwesomeIcon
            className="spoilers-close-icon"
            icon={faClose}
            onClick={onClose}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div className="spoiler-check-option">
                <input
                  checked={allCharacterSpoilers}
                  onChange={handleCharacterSpoilerToggleAll}
                  type="checkbox"
                />
                <h4>Character Spoilers</h4>
              </div>
              <ul className="character-spoilers">
                {unlockabelClasses.map((char, idx) => (
                  <CharacterSpoiler key={idx} char={char} />
                ))}
                <li className="spoiler-check-option" />
              </ul>
            </div>

            <div>
              <div className="spoiler-check-option">
                <input
                  checked={allItemSpoilers}
                  onChange={handleItemSpoilerToggleAll}
                  type="checkbox"
                />
                <h4>Item Spoilers</h4>
              </div>
              <div className="prosperity-spoilers">
                <h5>Prosperity</h5>
                <ul>
                  {Array.from({ length: 9 }, (_, i) => String(i + 1)).map(
                    (idx) => (
                      <ProsperitySpoiler key={idx} level={idx} />
                    )
                  )}
                </ul>
              </div>
              <ItemSpoiler label="Random Item Designs" path="recipes" />
              <ItemSpoiler label="Other Items" path="other" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Spoilers;
