export const Button = ({ children }) => {
  return (
    <button className="rounded-md bg-black">
      <span className="block -translate-x-1 -translate-y-1 rounded-md border-2 border-black bg-green-600 px-4 py-2 text-2xl transition-all hover:translate-x-0 hover:translate-y-0">
        {children}
      </span>
    </button>
  );
};
