import LogoDark from '@/components/ui/icons/LogoDark';

const AmbientView = () => {
  // TODO ask for colored logo svg
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <LogoDark className="h-[78px] w-[300px]" />
    </div>
  );
};

export default AmbientView;
