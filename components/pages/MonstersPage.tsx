import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

import {
  getBaseUrl,
  getCharacterColor,
  getDefaultMonster,
  verifyQueryParam,
} from "../../common/helpers";
import { Monster, Option } from "../../common/types";
import CardList from "../../components/CardList";
import Dropdown from "../../components/Dropdown";

type MonsterStatCardProps = {
  index: number;
  game: string;
  handleIndexChange: () => void;
  monster: Monster;
};

const MonsterStatCard = ({
  game,
  handleIndexChange,
  index,
  monster,
}: MonsterStatCardProps) => {
  const [rotation, setRotation] = useState(monster.isVertical ? 0 : -90);

  const handleBtnClick = () => {
    if (monster.isVertical) {
      setRotation(rotation - 180);
    } else {
      setRotation(rotation - 90);
    }
  };

  useEffect(() => {
    setRotation(monster.isVertical ? 0 : -90);
  }, [monster]);

  const displayIndex = index * (monster.isVertical ? 2 : 4);

  return (
    <div className="monster-stat-card" key={monster.id}>
      <div
        className="monster-img-outer"
        style={{
          paddingTop: monster.isVertical && game !== "fh" ? "150%" : "100%",
        }}
      >
        {monster.statCards?.map((img, idx) => (
          <img
            key={idx}
            className={`monster-img ${
              index === idx ? "monster-img-active" : ""
            }`}
            alt=""
            src={getBaseUrl() + img}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        ))}
      </div>
      <button className="card-index-btn" onClick={handleIndexChange}>
        {displayIndex}
      </button>
      <button className="card-flip-btn" onClick={handleBtnClick}>
        <FontAwesomeIcon
          className="card-flip-svg"
          icon={faRotateLeft}
          height="48px"
        />
      </button>
    </div>
  );
};

type MonsterSearch = {
  monster: Monster;
  monsterList: Option[];
};

type PageProps = {
  game: string;
  searchResults: MonsterSearch;
};

const MonstersPage = ({ game, searchResults }: PageProps) => {
  const { monsterList, monster } = searchResults;

  const [index, setIndex] = useState(0);
  const router = useRouter();

  const monsterSearch = verifyQueryParam(
    router.query.monster,
    getDefaultMonster(game)
  );

  const handleIndexChange = () => {
    setIndex((index + 1) % monster?.statCards?.length);
  };

  const handleMonsterChange = (newMonster: string) => {
    setIndex(0);
    router.push(hreffn(newMonster));
  };

  const hreffn = (newMonster: string) => {
    return `/${game}/monsters/${newMonster}`;
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--primary",
      getCharacterColor(null)
    );
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [game]);

  const cardList =
    monster?.abilityCards?.map((abilityImage) => ({
      name: "",
      image: abilityImage,
    })) || [];

  const horizontal = ![
    "manifestation-of-corruption",
    "enraged-vanquisher",
  ].includes(monster?.id);

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-inner">
          {monsterList && monsterList.length > 0 && (
            <Dropdown
              href={hreffn}
              onChange={handleMonsterChange}
              options={searchResults.monsterList || []}
              value={monsterSearch}
            />
          )}
        </div>
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {monster?.statCards && monster.statCards.length > 0 && (
          <MonsterStatCard
            handleIndexChange={handleIndexChange}
            game={game}
            index={index}
            monster={monster}
          />
        )}
        <CardList cardList={cardList} horizontal={horizontal} />
      </div>
    </>
  );
};

export default MonstersPage;
