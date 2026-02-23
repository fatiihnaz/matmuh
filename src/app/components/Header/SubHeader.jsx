import Breadcrumb from "./components/Breadcrumb";

export default function SubHeader({ title, subTitle }) {
  return (
    <div className="bg-primary-500">
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-6">
        <Breadcrumb />
        <h1 className="text-white text-[28px] font-light mt-4">{title}</h1>
        {subTitle && (
          <p className="text-neutral-400 text-sm font-light mt-2">{subTitle}</p>
        )}
      </div>
    </div>
  );
}