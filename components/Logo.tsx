interface LogoProps {
  classes?: string;
}

export default function Logo({ classes }: LogoProps) {
  return <div className={`${classes}`}>Linguardian</div>;
}
