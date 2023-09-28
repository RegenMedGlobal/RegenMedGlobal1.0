import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const StyledCardList = styled.div`
  display: flex;
  justify-content: space-around;
  height: 40vh;
  width: 75%;
  margin: 0 auto;
  margin-top: 2%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    height: auto;
    width: 90%;
  }
`;

const CardList = () => {
  const cards = [
    {
      id: 1,
      title: 'Stem Cell Therapy',
      body:
        'Stem cell therapy is a form of regenerative medicine designed to repair damaged cells within the body by reducing inflammation and modulating the immune system.',
    },
    {
      id: 2,
      title: 'PRP/Platelet Rich Plasma',
      body:
        'Platelet-rich plasma (PRP) therapy uses injections of a concentration of a patient’s own platelets to accelerate the healing of injured tendons, ligaments, muscles and joints.',
    },
    {
      id: 3,
      title: 'Prolotherapy',
      body:
        'Prolotherapy is a non-surgical injection procedure used to relieve back pain by treating connective tissue injuries (ligaments and tendons) of the musculoskeletal system that have not healed by either rest or conservative therapy in order to relieve back pain.',
    },

  ];

  return (
    <StyledCardList>
      {cards.map((card) => (
        <Card key={card.id} header={card.title} body={card.body} />
      ))}
    </StyledCardList>
  );
};

export default CardList;
