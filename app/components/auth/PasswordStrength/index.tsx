import { cn } from '@/app/lib/utils';

interface Props {
  passStrength: number;
}

export default function PasswordStrength({ passStrength }: Props) {
  return (
    <div className="flex w-full gap-2">
      {Array.from({ length: passStrength + 1 }).map((_i, index) => (
        <div
          key={index}
          className={cn('h-1 w-1/4 rounded-md', {
            'bg-red-500': passStrength === 0,
            'bg-orange-500': passStrength === 1,
            'bg-yellow-500': passStrength === 2,
            'bg-green-500': passStrength === 3
          })}
        ></div>
      ))}
    </div>
  );
}
