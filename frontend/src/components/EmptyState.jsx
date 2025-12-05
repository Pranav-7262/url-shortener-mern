const EmptyState = ({
  title = "No data yet",
  subtitle = "Get started by creating something",
}) => {
  return (
    <div className="p-6 text-center bg-white/5 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mt-2">{subtitle}</p>
    </div>
  );
};

export default EmptyState;
