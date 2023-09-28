import styled from 'styled-components';

export const IconWrapper = styled.div`
  position: relative;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  pointer-events: none;

  svg {
    position: absolute;
    width: 16px;
    height: 16px;
    color: purple;
  }
`;

export const StyledErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

export const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-top: 15rem;

  .treatment-text {
    color: var(--main-color);
    font-weight: bold;
  }

  @media screen and (max-width: 768px) {
    margin-top: 10rem;
  }

  .ant-input {
    width: 0rem;
    height: 50px;

    @media screen and (max-width: 768px) {
      width: 80%;
    }
  }

  .type-button {
    width: fit-content;
    margin-left: 5px;
  }
`;

export const StyledContainer = styled.div`
  height: 90vh;
  background: url(${MainBack});
  background-image: ;
  background-size: cover;

  h5 {
    color: var(--main-color);
    font-weight: bold;
  }

  h1 {
    color: white;
    padding-top: 6rem;
    text-align: center;

    @media screen and (max-width: 768px) {
      padding-top: 3rem;
      font-size: 1.5rem;
    }
  }

  .form-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }

    .location-input,
    .search-input {
      width: 22rem;

      @media screen and (max-width: 768px) {
        width: 100%;
      }
    }
  }

  .button-group {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .search-button {
    margin-top: 1rem;
    width: 7rem;
  }
`;
