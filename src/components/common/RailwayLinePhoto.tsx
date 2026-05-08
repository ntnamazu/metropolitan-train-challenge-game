import type { RailwayPhoto } from '../../types';

interface RailwayLinePhotoProps {
  photo: RailwayPhoto;
}

export function buildAttributionText(photo: RailwayPhoto): string {
  const licenseText = photo.licenseVersion
    ? `${photo.license} ${photo.licenseVersion}`
    : photo.license;
  return `📷 ${photo.photographer} / Wikimedia Commons / ${licenseText}`;
}

export function RailwayLinePhoto({ photo }: RailwayLinePhotoProps) {
  return (
    <div className="w-full">
      <img
        src={photo.imageUrl}
        alt=""
        aria-hidden="true"
        className="w-full h-40 object-cover rounded-lg"
        loading="lazy"
      />
      <p className="text-xs text-gray-400 mt-1 px-1">
        {buildAttributionText(photo)}
      </p>
    </div>
  );
}
