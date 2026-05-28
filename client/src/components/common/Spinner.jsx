export default function Spinner({ fullPage = false }) {
  const inner = (
    <div className="flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-richblack-600 border-t-primary-400 rounded-full animate-spin" />
    </div>
  );
  if (!fullPage) return inner;
  return <div className="min-h-[60vh] flex items-center justify-center">{inner}</div>;
}
