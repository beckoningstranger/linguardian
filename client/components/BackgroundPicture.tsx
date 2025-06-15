interface BackgroundPictureProps {
  bgPicture: string;
  backGroundOpacity?: "opacity-80" | "opacity-90" | "opacity-100";
}

export default function BackgroundPicture({
  bgPicture,
  backGroundOpacity,
}: BackgroundPictureProps) {
  return (
    <div
      id="BackgroundImage"
      className={`fixed top-0 inset-x-0 min-h-screen -z-10 bg-cover bg-center ${backGroundOpacity}`}
      style={{ backgroundImage: `url(${bgPicture})` }}
    />
  );
}
