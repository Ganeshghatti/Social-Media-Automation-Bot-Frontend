import React from "react";
import { CreatePostCard } from "./CreatePostCard";
import { Form } from "../ui/form";

export const DialogCards = ({
  localCards,
  setLocalCards,
  handleTextareaChange,
  textAreaRefs,
  setNewCardAdded,
}) => {
  return (
    <div className="flex flex-col py-14 w-full  items-start flex-1">
      <Form>
        <form className="w-full flex-1    overflow-y-auto justify-center items-center ">
          {localCards &&
            localCards.map((card, index) => (
              <CreatePostCard
                key={card.id}
                threadNumber={index + 1}
                value={card.text}
                onChange={(val) => handleTextareaChange(card.id, val)}
                setCards={setLocalCards}
                cards={localCards}
                textareaRef={(el) => {
                  if (textAreaRefs && textAreaRefs.current) {
                    textAreaRefs.current[index] = el;
                  }
                }}
                setNewCardAdded={setNewCardAdded}
                isFirst={index === 0}
                isLast={index === localCards.length - 1}
                width={"600px"}
              />
            ))}
        </form>
      </Form>
    </div>
  );
};

