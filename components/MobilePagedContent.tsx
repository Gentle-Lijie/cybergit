import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

interface MobilePagedContentProps {
  sections: React.ReactNode[];
}

const MOBILE_RATIO_WIDTH = 9;
const MOBILE_RATIO_HEIGHT = 16;

const getPageMaxHeight = (): number => {
  if (typeof window === 'undefined') return 480;

  const ratioHeight = (window.innerWidth * MOBILE_RATIO_HEIGHT) / MOBILE_RATIO_WIDTH;
  const logicalScreenHeight = Math.min(window.innerHeight, ratioHeight);
  return Math.max(280, Math.floor(logicalScreenHeight * 0.75));
};

export const MobilePagedContent: React.FC<MobilePagedContentProps> = ({ sections }) => {
  const measureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pageMaxHeight, setPageMaxHeight] = useState<number>(getPageMaxHeight);
  const [sectionHeights, setSectionHeights] = useState<number[]>([]);
  const [activePage, setActivePage] = useState<number>(0);

  useEffect(() => {
    const recalc = () => setPageMaxHeight(getPageMaxHeight());
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, []);

  useLayoutEffect(() => {
    const raf = requestAnimationFrame(() => {
      const heights = sections.map((_, index) => {
        const el = measureRefs.current[index];
        return el ? Math.ceil(el.getBoundingClientRect().height) : 0;
      });
      setSectionHeights(heights);
    });

    return () => cancelAnimationFrame(raf);
  }, [sections, pageMaxHeight]);

  const pageGroups = useMemo<number[][]>(() => {
    if (sections.length === 0) return [];

    const validHeights = sectionHeights.length === sections.length
      ? sectionHeights.map(h => (h > 0 ? h : 1))
      : sections.map(() => Math.max(1, Math.floor(pageMaxHeight / 2)));

    const pages: number[][] = [];
    let currentPage: number[] = [];
    let currentHeight = 0;

    validHeights.forEach((height, index) => {
      const normalizedHeight = Math.min(height, pageMaxHeight);

      if (currentPage.length > 0 && currentHeight + normalizedHeight > pageMaxHeight) {
        pages.push(currentPage);
        currentPage = [index];
        currentHeight = normalizedHeight;
      } else {
        currentPage.push(index);
        currentHeight += normalizedHeight;
      }
    });

    if (currentPage.length > 0) pages.push(currentPage);

    return pages.length > 0 ? pages : [sections.map((_, i) => i)];
  }, [sectionHeights, sections, pageMaxHeight]);

  useEffect(() => {
    setActivePage(prev => Math.min(prev, Math.max(0, pageGroups.length - 1)));
  }, [pageGroups.length]);

  if (sections.length === 0) return null;

  const totalPages = pageGroups.length;
  const currentIndexes = pageGroups[activePage] || [];

  return (
    <div className="md:hidden w-full relative">
      <div className="absolute -z-10 opacity-0 pointer-events-none w-full" aria-hidden>
        {sections.map((section, index) => (
          <div
            key={`measure-${index}`}
            ref={(el) => {
              measureRefs.current[index] = el;
            }}
            className="mb-6"
          >
            {section}
          </div>
        ))}
      </div>

      <div
        className="w-full border border-primary/30 bg-black/50 rounded-lg overflow-hidden"
        style={{
          aspectRatio: `${MOBILE_RATIO_WIDTH} / ${MOBILE_RATIO_HEIGHT}`,
          maxHeight: `${pageMaxHeight}px`
        }}
      >
        <div className="h-full overflow-y-auto custom-scrollbar p-2">
          <div className="flex flex-col gap-6">
            {currentIndexes.map(index => (
              <div key={`page-${activePage}-section-${index}`}>
                {sections[index]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-3 flex items-center justify-between px-1">
          <button
            onClick={() => setActivePage(p => Math.max(0, p - 1))}
            disabled={activePage === 0}
            className="text-[10px] px-2 py-1 border border-primary/30 text-primary disabled:opacity-30 rounded"
          >
            PREV
          </button>

          <div className="flex items-center gap-1.5">
            {pageGroups.map((_, idx) => (
              <button
                key={`dot-${idx}`}
                onClick={() => setActivePage(idx)}
                aria-label={`Go to page ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${idx === activePage ? 'bg-primary' : 'bg-primary/30'}`}
              />
            ))}
          </div>

          <button
            onClick={() => setActivePage(p => Math.min(totalPages - 1, p + 1))}
            disabled={activePage === totalPages - 1}
            className="text-[10px] px-2 py-1 border border-primary/30 text-primary disabled:opacity-30 rounded"
          >
            NEXT
          </button>
        </div>
      )}
    </div>
  );
};
