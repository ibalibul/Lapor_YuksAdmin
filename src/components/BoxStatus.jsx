const BoxStatus = ({
  bottomColor,
  bodyColor,
  Icon,
  bodyLabel,
  bottomLabel,
  value,
}) => {
  return (
    <div className="text-white">
      <div
        className={`flex p-8 justify-between ${bodyColor} rounded-t-lg items-center`}
      >
        {Icon}
        <div className="text-center">
          <p className="font-bold text-5xl">{value}</p>
          <p>{bodyLabel}</p>
        </div>
        <div className="text-center">
          <p className="font-bold text-5xl">{""}</p>
          <p>{bodyLabel}</p>
        </div>
      </div>
      <div className={`${bottomColor} rounded-b-lg text-center`}>
        <p className="text-lg">{bottomLabel}</p>
      </div>
    </div>
  );
};

export default BoxStatus;
