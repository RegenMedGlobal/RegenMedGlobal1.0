import { cond, debounce } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getConditions } from "../../functions/getConditions";
import ConditionsInput from "../ConditionsInput";
import { Select } from "antd";

const SelectConditions = ({ selectedOptions, options, onInputChange }) => {
  const [showConditionsDropdown, setShowConditionsDropdown] = useState(false);
  const [conditions, setConditions] = useState([]);
  const conditionRef = useRef(null);
  const [filterTerm, setFilterTerm] = useState("");
  const [conditionsArr, setConditionsArr] = useState([]);
  const {
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
    getValues,
    getFieldState,
    reset,
  } = useForm({
    defaultValues: {
      treatments: [], // Set initial value as an empty array
      conditions: [], // Set initial value as an empty array
      conditionsSuggestions: [], // Set initial value as an empty array
    },
  });

  console.log(options, selectedOptions);

  useEffect(() => {
    // Define a debounced version of fetchConditions
    const debouncedFetchConditions = debounce(async () => {
      const conditionsData = await getConditions(filterTerm); // Pass the filterTerm to getConditions
      setConditions(conditionsData);
    }, 300); // Adjust the debounce delay (in milliseconds) as needed

    // Call the debounced function when the component mounts
    debouncedFetchConditions();

    return () => {
      // Cleanup: Clear the debounced function when the component unmounts
      debouncedFetchConditions.cancel();
    };
  }, [filterTerm]); // Include filterTerm in the dependency array

  const handleConditionSelect = (selectedOption) => {
    console.log("Selected Conditions:", selectedOption);
    const conditionsLoweredCased = watch("conditions").map((option) =>
      option.toLowerCase()
    );

    if (!conditionsLoweredCased.includes(selectedOption.toLowerCase())) {
      setValue("conditions", watch("conditions").concat(selectedOption));
    }
    console.log('batman is here too with event', selectedOption);
    setValue("conditionsSuggestions", []);
    //setShowConditionsDropdown(false);
  };

  const handleInputChange = (newValue) => {
    console.log("Input Value in Register:", newValue);
    setFilterTerm(newValue);
  };

  useEffect(() => {
    const toLift = conditionsArr.map((condition) => {
      if(condition.value) {
        return condition.value;
      } else {
        return condition;
      }
    });
    onInputChange("conditions", toLift.join(","))
  }, [conditionsArr])

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mar-15-0 sero-rad">
            <ConditionsInput
              control={control}
              showConditionsDropdown={showConditionsDropdown}
              conditionRef={conditionRef}
              handleConditionSelect={handleConditionSelect}
              terms={conditions} // Pass the conditions array
              watch={watch}
              selection={selectedOptions}
              options={options}
              filterTerm={filterTerm} // Pass the filter term as a prop
              handleInputChange={handleInputChange} // Pass the handleInputChange function
              //setShowConditionsDropdown={setShowConditionsDropdown} // Pass setShowConditionsDropdown as a prop
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-12">
          <div className="mar-15 zer-radi">
            <Controller
              name="conditions"
              control={control}
              render={({ field }) => {
                setConditionsArr(field.value);
                return (
                  <div>
                    <Select
                      mode="multiple"
                      open={false}
                      style={{
                        width: "100%",
                        marginTop: "1rem",
                      }}
                      placeholder="Conditions/Diseases treated"
                      {...field}
                      options={[]}
                    />
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectConditions;
