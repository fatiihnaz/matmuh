import Breadcrumb from "./components/Breadcrumb";

export default function SubHeader({ title, subTitle, lastLabel }) {
  return (
    <div className="bg-primary-500 -mt-px">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        <Breadcrumb lastLabel={lastLabel} />
        <h1 className="text-white text-[28px] font-light mt-4">{title}</h1>
        {subTitle && (
          <p className="text-neutral-400 text-sm font-light mt-2">{subTitle}</p>
        )}
      </div>
    </div>
  );
}