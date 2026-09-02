import logoAsset from "../assets/logo-transparent.png.asset.json";

type LogoProps = {
  size?: number;
  className?: string;
  title?: string;
};

export function Logo({ size = 32, className, title = "Logo" }: LogoProps) {
  return (
    <img
      src={logoAsset.url}
      width={size}
      height={size}
      alt={title}
      className={className}
      style={{ objectFit: "contain" }}
    />
  );
}
