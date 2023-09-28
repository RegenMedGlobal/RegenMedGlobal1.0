import React, { useState } from "react";
import Collapse from "react-collapse";
import plus from "../assets/plus.png"
import minus from "../assets/minus.png"

const Faq = ({ questions }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? -1 : index);
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div className="my-faq" key={index}>
          <button className="bt-my" onClick={() => handleToggle(index)}>
            {question.question}
            <div className="fax-icon">
            {activeIndex === index ? <img className="faq-both faq-minus" src={minus} alt="" /> : <img className="faq-both faq-plus" src={plus} alt="" /> }
            </div>
          </button>
          <Collapse isOpened={activeIndex === index}>
            {question.answer}
          </Collapse>
        </div>
      ))}
    </div>
  );
};

export default Faq;