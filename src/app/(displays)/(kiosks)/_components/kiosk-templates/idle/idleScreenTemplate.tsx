'use client';

export interface IdleScreenTemplateProps extends Record<string, unknown> {
  readonly onNavigateDown?: () => void;
  readonly videoSrc?: string;
}

const IdleScreenTemplate = ({ onNavigateDown, videoSrc }: IdleScreenTemplateProps) => {
  return (
    <div
      className="relative flex h-screen w-full cursor-pointer flex-col overflow-hidden"
      data-scroll-section="idle-screen"
      onClick={onNavigateDown}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onNavigateDown?.();
        }
      }}
      role="button"
      tabIndex={0}
    >
      {/* Full-screen video */}
      {videoSrc && (
        <video autoPlay className="absolute inset-0 h-full w-full object-cover" loop muted playsInline src={videoSrc}>
          <track kind="captions" />
        </video>
      )}
    </div>
  );
};

export default IdleScreenTemplate;
