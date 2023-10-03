import { Button } from 'antd'

const TreatmentInput = ({ control, errors, field, handleTreatmentSelection }) => {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="mar-15">
          <label className="label-contact">Treatment Type(s) offered</label>
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
                  <div className="flexmen">
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
