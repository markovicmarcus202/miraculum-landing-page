import logoImg from "../assets/logo.webp";

type LogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function Logo({ size = 32, className, title = "Miraculum" }: LogoProps) {
  return (
    <img
      src={logoImg}
      width={size}
      height={size}
      alt={title}
      className={className}
      style={{ objectFit: "cover", borderRadius: "28%" }}
    />
  );
}
