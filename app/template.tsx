export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out fill-mode-both w-full h-full flex flex-col flex-1">
      {children}
    </div>
  );
}
