import { Briefcase } from "lucide-react";

const DevHireBrand = ({
  text = "DevHire",
  textClassName = "text-xl font-bold text-gray-800 leading-none",
  iconWrapperClassName = "w-9 h-9 rounded-lg bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-blue-50",
  iconClassName = "w-5 h-5",
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className={iconWrapperClassName} aria-hidden="true">
        <Briefcase className={iconClassName} />
      </div>
      <span className={textClassName}>{text}</span>
    </div>
  );
};

export default DevHireBrand;
