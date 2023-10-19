const Backdrop = () => {
  return (
    <div className="fixed top-0 left-0 bg-carbondale-base h-screen w-screen -z-10">
      <div className="backdrop-blur-[6px] bg-stone-950/50 h-full w-full"></div>
    </div>
  );
};

export default Backdrop;
