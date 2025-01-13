import ReusableInput from "./ReusuableInput";

const BodyModal = ({ inputs }) => {
  return (
    <div>
      {inputs.map((input) => (
        <ReusableInput
          label={input.label}
          value={input.value}
          onChange={input.setValue}
          type={input.type}
        />
      ))}
    </div>
  );
};

export default BodyModal;
