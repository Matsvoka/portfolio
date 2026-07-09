export function ProjectPreviewVideo({ src, title }: { src: string; title: string }) {
  return (
    <video
      aria-label={`Preview em vídeo do projeto ${title}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="ui-preview-video mt-2 w-full rounded-md bg-bg-dim object-cover"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
