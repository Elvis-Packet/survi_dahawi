import { cn } from '@/utils/cn';

export default function Card({ children, className, hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={cn('card p-5', hover && 'transition hover:shadow-card hover:-translate-y-0.5 cursor-pointer', className)}
    >
      {children}
    </div>
  );
}
