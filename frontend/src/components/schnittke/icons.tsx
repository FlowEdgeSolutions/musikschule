export type IconProps = {
  size?: number;
  color?: string;
};

export const MusicNotes = ({ size = 24, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M210.3 56.34l-80-24A8 8 0 0 0 120 40v108.26A48 48 0 1 0 136 184V98.75l69.7 20.91A8 8 0 0 0 216 112V64a8 8 0 0 0-5.7-7.66z"
      fill={color}
    />
  </svg>
);

export const MapPin = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M128 16a88.1 88.1 0 0 0-88 88c0 75.3 80 132.17 83.41 134.55a8 8 0 0 0 9.18 0C136 236.17 216 179.3 216 104a88.1 88.1 0 0 0-88-88zm0 56a32 32 0 1 1-32 32 32 32 0 0 1 32-32z"
      fill={color}
    />
  </svg>
);

export const Envelope = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M224 48H32a8 8 0 0 0-8 8v136a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a8 8 0 0 0-8-8zm-96 85.15L52.57 64h150.86zM98.71 128 40 181.81V74.19zm11.84 10.85 12 11.05a8 8 0 0 0 10.82 0l12-11.05L203.43 192H52.57zM157.29 128 216 74.18v107.64z"
      fill={color}
    />
  </svg>
);

export const ArrowRight = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M221.66 133.66l-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32z"
      fill={color}
    />
  </svg>
);

export const Phone = ({ size = 20, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M222.37 158.46l-47.11-21.11-.13-.06a16 16 0 0 0-15.17 1.4 8.12 8 0 0 0-.75.56L134.87 160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16 16 0 0 0 1.32-15.06v-.12L97.54 33.64a16 16 0 0 0-16.62-9.52A56.26 56.26 0 0 0 32 80c0 79.4 64.6 144 144 144a56.26 56.26 0 0 0 55.88-48.92 16 16 0 0 0-9.51-16.62z"
      fill={color}
    />
  </svg>
);

export const List = ({ size = 28, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M224 128a8 8 0 0 1-8 8H40a8 8 0 0 1 0-16h176a8 8 0 0 1 8 8zM40 72h176a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16zm176 112H40a8 8 0 0 0 0 16h176a8 8 0 0 0 0-16z"
      fill={color}
    />
  </svg>
);

export const X = ({ size = 28, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 256 256" fill="none">
    <path
      d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128z"
      fill={color}
    />
  </svg>
);

