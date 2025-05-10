import React from "react";
import { CreatePostCard } from "./CreatePostCard";
import { Form } from "../ui/form";

export const DialogCards = ({
  localCards,
  setLocalCards,
  textAreaRefs,
  setNewCardAdded,
}) => {
  const handleTextareaChange = (id, val) => {
    setLocalCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, text: val } : card))
    );
  };

  const handleImageSelect = (id, selectedImages) => {
    setLocalCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, media: selectedImages } : card
      )
    );
  };

  return (
    <div className="flex flex-col py-8 w-full items-start flex-1 h-full max-h-full = ">
      <Form>
        <form  className="!w-full h-[600px] space-y-6 flex flex-col   ">
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
                width={true}
              />
            ))}
        </form>
      </Form>
    </div>
  );
};
