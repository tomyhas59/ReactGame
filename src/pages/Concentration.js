import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 200px;
  height: 300px;
  perspective: 1000px;
  cursor: pointer;
  margin: 10px;
`;

const Card = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const Front = styled(Card)`
  background-color: blue;
  transform: ${(props) =>
    props.isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

const Back = styled(Card)`
  background-color: ${(props) => props.color};
  transform: ${(props) =>
    props.isFlipped ? "rotateY(0deg)" : "rotateY(-180deg)"};
`;

function Concentration() {
  const [colors, setColors] = useState([
    "red",
    "orange",
    "yellow",
    "green",
    "white",
    "pink",
    "cyan",
    "violet",
    "gray",
    "black",
  ]);
  const total = 6;
  const initialCards = () => {
    let randomColors = [];
    while (colors.length > 0) {
      const random = Math.floor(Math.random() * colors.length);
      randomColors = randomColors.concat(colors.splice(random, 1));
    }
    let selectedColors = randomColors.slice(0, total / 2);
    let colorCopy = [...selectedColors, ...selectedColors];
    let newShuffled = [];
    for (let i = 0; colorCopy.length > 0; i += 1) {
      const randomIndex = Math.floor(Math.random() * colorCopy.length);
      newShuffled = [...newShuffled].concat(colorCopy.splice(randomIndex, 1));
    }
    setColors(newShuffled);
    return newShuffled.map(() => false); // 모든 카드 front, false면 front
  };

  const [cards, setCards] = useState(initialCards);
  const [clicked, setClicked] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [clickable, setClickable] = useState(true);

  const handleClick = (index) => {
    if (!clickable) {
      return; // 클릭 불가능할 때 함수를 실행하지 않음
    }
    if (!cards[index] && clicked.length < 2) {
      // 클릭한 카드가 back이고 클릭된 카드가 2개 미만(2개까지 클릭 가능)
      const updatedCards = [...cards];
      updatedCards[index] = true; // front면 back으로
      setCards(updatedCards);
      // 클릭한 카드의 인덱스를 clicked 상태에 추가
      setClicked((prevClicked) => [...prevClicked, index]);
    }
  };

  useEffect(() => {
    if (clicked.length === 2) {
      // 클릭한 카드가 2개인 경우
      const [firstIndex, secondIndex] = clicked;
      if (colors[firstIndex] === colors[secondIndex]) {
        // 두 카드의 색상이 같으면
        setCompleted((prevCompleted) => [
          ...prevCompleted,
          firstIndex,
          secondIndex,
        ]);
        setClicked([]);
      } else {
        // 두 카드의 색상이 다르면 1초 후에 두 카드를 다시 뒤집음
        setTimeout(() => {
          const updatedCards = [...cards];
          updatedCards[firstIndex] = false;
          updatedCards[secondIndex] = false;
          setCards(updatedCards);
          setClicked([]);
        }, 1000);
      }
    }
  }, [cards, clicked, colors]);

  useEffect(() => {
    if (completed.length === total) {
      setTimeout(() => {
        alert("성공!");
      }, 200);
      setClicked([]);
      setCompleted([]);
    }
  }, [completed.length]);

  const startGame = () => {
    setClickable(false);
    const startCard = [...cards];
    for (let i = 0; i < cards.length; i++) {
      setTimeout(() => {
        startCard[i] = true;
        setCards([...startCard]);
      }, i * 500); // 0.5초 간격으로 카드 뒤집기
    }

    setTimeout(() => {
      setClickable(true);
      const flippedCard = [...startCard];
      // 모든 카드가 다시 뒤집히도록
      for (let i = 0; i < cards.length; i++) {
        flippedCard[i] = false;
      }
      setCards([...flippedCard]);
    }, cards.length * 500 + 3000); // 모든 카드가 뒤집힌 후 3초 후에 다시 뒤집기
  };

  return (
    <div>
      <button onClick={startGame}>게임 시작</button>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {cards.map((isFlipped, index) => (
          <CardContainer key={index} onClick={() => handleClick(index)}>
            <Front isFlipped={isFlipped}>Front</Front>
            <Back isFlipped={isFlipped} color={colors[index]}>
              Back
            </Back>
          </CardContainer>
        ))}
      </div>
    </div>
  );
}

export default Concentration;
