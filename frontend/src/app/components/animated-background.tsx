export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <div className="absolute w-full h-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-purple-500/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
    </div>
  );
}
