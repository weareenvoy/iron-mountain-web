import LogoWithIconDark from '@/components/ui/icons/LogoWithIconDark';

const AmbientView = () => {
  return (
    <div className="absolute top-40 left-1/2 flex -translate-x-1/2 items-center justify-center">
      <LogoWithIconDark className="h-[182px] w-[700px]" />
    </div>
  );
};

export default AmbientView;
