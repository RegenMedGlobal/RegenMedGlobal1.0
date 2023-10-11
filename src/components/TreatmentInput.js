import styled from "styled-components";
import { Button } from 'antd'
import { useForm, Controller } from 'react-hook-form';

const StyledControllerContainer = styled.div`
  margin-bottom: 1rem;

  /* Added styles for positioning */
  position: relative;
  z-index: 0;

  /* Added styles for dropdown container */
  .country-dropdown-container {
    position: relative;
    z-index: 9999;
  }

  /* Added styles for dropdown menu */
  .react-dropdown-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 99999;
    margin-top: 4px;
  }

  /* Media query for mobile */
  @media (max-width: 768px) {
    .flexmen {
      flex-direction: column; /* Stack buttons vertically */
    }
  }
`;

const TreatmentInput = ({ control, errors, field, handleTreatmentSelection }) => {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="mar-15">
          <label className="label-contact">Choose Treatment Type(s) offered at your clinic</label>
          <StyledControllerContainer>
            <Controller
              name="treatments"
              control={control}
              defaultValue={[]}
              rules={{
                required: "At least one Treatment Type must be selected",
              }}
              render={({ field }) => (
                <div>
                  <div className="flexmen"> {/* Updated className */}
                    <Button
                      variant={field.value.includes("PRP") ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleTreatmentSelection(field.value, "PRP", field)}
                      className={field.value.includes("PRP") ? " active " : ""}
                    >
                      PRP
                    </Button>
                    <Button
                      variant={field.value.includes("Stem Cell") ? "contained" : "outlined"}
                      className={field.value.includes("Stem Cell") ? " active " : ""}
                      color="primary"
                      onClick={() => handleTreatmentSelection(field.value, "Stem Cell", field)}
                    >
                      Stem Cell Therapy
                    </Button>
                    <Button
                      variant={field.value.includes("Prolotherapy") ? "contained" : "outlined"}
                      className={field.value.includes("Prolotherapy") ? " active " : ""}
                      color="primary"
                      onClick={() => handleTreatmentSelection(field.value, "Prolotherapy", field)}
                    >
                      Prolotherapy
                    </Button>
                    {/* Add more buttons for different treatments */}
                  </div>
                </div>
              )}
            />
            {errors.treatments && <p>{errors.treatments.message}</p>}
          </StyledControllerContainer>
        </div>
      </div>
    </div>
  );
};

export default TreatmentInput;
