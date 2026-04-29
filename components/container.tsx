type ContainerProps = {
  children: React.ReactNode;
};

export default function Container({ children }: ContainerProps) {
  return (
    /* 1. Added bg-black to ensure the area behind the container is never blue.
       2. Added min-h-screen so the black stretches to the bottom of the display.
       3. Added text-white to ensure visibility.
    */
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {children}
      </div>
    </div>
  );
}