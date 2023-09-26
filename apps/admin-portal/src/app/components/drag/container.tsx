import update from "immutability-helper";
import { FC, useEffect } from "react";
import { useCallback, useState } from "react";

import { Card } from "./Item";

export interface Item {
  id: string;
  component: any;
}

export interface ContainerState {
  cards: Item[];
}

interface Prop {
  onMove: (elementId: string, value: number, index2: number) => void;
  items: Item[];
}

export const Container: FC<Prop> = ({ items, onMove }) => {
  {
    const [cards, setCards] = useState<Array<any>>(items);

    useEffect(() => {
      setCards(items);
    }, [items]);

    const moveCard = useCallback(
      (dragIndex: number, hoverIndex: number, elementId: string) => {
        onMove(elementId, hoverIndex, dragIndex);
        setCards((prevCards: Item[]) =>
          update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex] as Item],
            ],
          })
        );
      },
      []
    );

    const renderCard = useCallback((card: Item, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          component={card.component}
          moveCard={(dragIndex, hoverIndex) => {
            console.log({ dragIndex, hoverIndex });
            moveCard(dragIndex, hoverIndex, card.id);
          }}
        />
      );
    }, []);

    return (
      <>
        <div>{cards?.map((card, i) => renderCard(card, i))}</div>
      </>
    );
  }
};
