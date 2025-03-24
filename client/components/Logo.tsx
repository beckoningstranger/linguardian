import { cn } from "@/lib/helperFunctionsClient";

type LogoProps = {
  mobileMenu?: boolean;
} & React.HTMLAttributes<HTMLHeadingElement>;

export default function Logo({ mobileMenu, ...props }: LogoProps) {
  const remainingProps = { ...props };
  delete remainingProps.className;

  const styling = { "text-6xl": mobileMenu };

  return (
    <h1
      className={cn(
        `grid font-bold text-blue-800 w-full place-items-center select-none cursor-pointer font-dancing text-4xl sm:text-6xl`,
        styling,
        props.className
      )}
      {...remainingProps}
    >
      Linguardian
    </h1>
  );
}
