const Select = ({ value, onChange, options }) => {
  return (
    <select
      className="block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:border-blue-500"
      value={value}
      onChange={onChange}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  );
};

export default Select;
