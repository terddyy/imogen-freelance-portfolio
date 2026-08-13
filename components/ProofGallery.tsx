"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  type ProofDesktopLayout,
  type ProofMobileLayout,
  type ProofMoment,
  proofMoments,
} from "@/lib/portfolio-data";
import styles from "@/components/ProofGallery.module.css";

const mobileLayoutClass: Record<ProofMobileLayout, string> = {
  hero: styles.mobileHero,
  tall: styles.mobileTall,
  default: styles.mobileDefault,
  team: styles.mobileTeam,
  onsite: styles.mobileOnsite,
};

const desktopLayoutClass: Record<ProofDesktopLayout, string> = {
  feature: styles.desktopFeature,
  meeting: styles.desktopMeeting,
  workshop: styles.desktopWorkshop,
  team: styles.desktopTeam,
  onsite: styles.desktopOnsite,
};

type ProofCellProps = {
  moment: ProofMoment;
  index: number;
  layoutClass: string;
  imageSizes: string;
  onOpen: (index: number) => void;
};

function ProofCell({ moment, index, layoutClass, imageSizes, onOpen }: ProofCellProps) {
  return (
    <figure className={`${styles.cell} ${layoutClass}`} role="listitem">
      <button
        type="button"
        className={styles.cellButton}
        onClick={() => onOpen(index)}
        aria-label={`View ${moment.label}: ${moment.alt}`}
      >
        <Image
          className={styles.image}
          src={moment.src}
          alt=""
          fill
          sizes={imageSizes}
        />
        <span className={styles.caption}>{moment.label}</span>
      </button>
    </figure>
  );
}

export function ProofGallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = activeIndex !== null ? proofMoments[activeIndex] : null;

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current - 1 + proofMoments.length) % proofMoments.length;
    });
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return (current + 1) % proofMoments.length;
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    }

    if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, showNext, showPrevious]);

  return (
    <section className={styles.section} id="proof" aria-labelledby="proof-title">
      <div className={`${styles.inner} shell`}>
        <div className={styles.header}>
          <span className="sectionLabel">In practice</span>
          <h2 id="proof-title">A few snapshots from recent work.</h2>
        </div>

        <div className={styles.gridMobile} role="list" aria-label="Work snapshots">
          {proofMoments.map((moment, index) => (
            <ProofCell
              key={moment.id}
              moment={moment}
              index={index}
              layoutClass={mobileLayoutClass[moment.layout]}
              imageSizes="(max-width: 980px) 45vw, 22vw"
              onOpen={setActiveIndex}
            />
          ))}
        </div>

        <div className={styles.gridDesktop} role="list" aria-label="Work snapshots">
          {proofMoments.map((moment, index) => (
            <ProofCell
              key={`desktop-${moment.id}`}
              moment={moment}
              index={index}
              layoutClass={desktopLayoutClass[moment.desktopLayout]}
              imageSizes="(min-width: 981px) 32vw, 45vw"
              onOpen={setActiveIndex}
            />
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="proofDialog"
        aria-labelledby={active ? "proof-dialog-title" : undefined}
        onClose={close}
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            close();
          }
        }}
      >
        {active && activeIndex !== null ? (
          <div className="proofDialogPanel">
            <header className="proofDialogHeader">
              <div>
                <p className="proofDialogEyebrow">In practice</p>
                <h3 id="proof-dialog-title">{active.label}</h3>
              </div>
              <button
                type="button"
                className="proofDialogClose"
                onClick={close}
                aria-label="Close image viewer"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="proofDialogImageWrap">
              <Image
                className="proofDialogImage"
                src={active.src}
                alt={active.alt}
                fill
                sizes="100vw"
                priority
              />
            </div>

            <p className="proofDialogCaption">{active.alt}</p>

            <nav className="proofDialogNav" aria-label="Browse proof images">
              <button
                type="button"
                className="proofDialogNavButton"
                onClick={showPrevious}
                aria-label="Previous image"
              >
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <span className="proofDialogCounter">
                {activeIndex + 1} / {proofMoments.length}
              </span>
              <button
                type="button"
                className="proofDialogNavButton"
                onClick={showNext}
                aria-label="Next image"
              >
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </nav>
          </div>
        ) : null}
      </dialog>
    </section>
  );
}
