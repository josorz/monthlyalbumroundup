export const CanvasLayout = ({
  children,
  ref,
}: {
  children: React.ReactNode;
  ref: any;
}) => {
  return (
    <div
      className="relative inline-block overflow-hidden rounded-xl outline-2 outline-black m-2"
      style={{ width: `${1080 * 0.3}px`, height: `${1920 * 0.3}px` }}
    >
      <div
        className="w-[1080px] h-[1920px] bg-white transform origin-top-left"
        style={{ transform: `scale(${0.3})` }}
        ref={ref}
      >
        <div className="w-full h-full bg-white p-10 ">{children}</div>
      </div>
    </div>
  );
};
