import { SpinnerIcon } from '../ui/icons';

export const Video = ({ isLoading }: { isLoading?: boolean }) => {
  return (
    <div className="flex flex-col gap-2">
      <video
        className="w-1/2 rounded-xl md:h-[568px]"
        src="/videos/books.mp4"
        controls
      />
      <div
        className={`flex flex-row items-center gap-2 ${isLoading ? 'opacity-100' : 'opacity-0'}`}
      >
        <SpinnerIcon />
        <div className="text-sm text-zinc-500">Analyzing video...</div>
      </div>
    </div>
  );
};
