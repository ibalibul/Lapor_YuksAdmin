const ReusableInput = ({ type, label, value, onChange, ...rest }) => {
  const handleChange = (event) => {
    if (type === "file") {
      onChange(event.target.files[0]);
      return;
    }
    onChange(event.target.value);
  };

  if (type === "file") {
    return (
      <div className="flex flex-col mb-2">
        <label htmlFor={label} className="font-semibold">
          {label}
        </label>
        <input
          type={type}
          id={label}
          onChange={handleChange}
          className="ml-2 border border-gray-300 px-2 py-1 rounded-md"
          {...rest}
        />
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="mb-2 flex flex-col">
        <label htmlFor={label} className="font-semibold">
          {label}
        </label>
        <textarea
          id={label}
          value={value}
          onChange={handleChange}
          className="ml-2 border border-gray-300 px-2 py-1 rounded-md"
          {...rest}
        />
      </div>
    );
  }

  return (
    <div className="mb-2 flex flex-col">
      <label htmlFor={label} className="font-semibold">
        {label}
      </label>
      <input
        type={type}
        id={label}
        value={value}
        onChange={handleChange}
        className="ml-2 border border-gray-300 px-2 py-1 rounded-md"
        {...rest}
      />
    </div>
  );
};

export default ReusableInput;
