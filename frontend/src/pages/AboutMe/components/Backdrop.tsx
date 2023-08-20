const Backdrop = () => {
  return (
    <div className="fixed top-0 left-0 bg-carbondale-base h-screen w-screen -z-10">
      <div className="backdrop-blur-sm bg-stone-950/60 h-full w-full"></div>
    </div>
  );
};

export default Backdrop;
