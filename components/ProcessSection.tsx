"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { processSteps } from "@/lib/portfolio-data";
import styles from "@/components/ProcessSection.module.css";

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="shell pageSection" id="process">
      <div className="sectionHeading">
        <div>
          <h2>From first message to launch.</h2>
          <p>Clear checkpoints so the work stays on track.</p>
        </div>
      </div>
      <div className={styles.list}>
        {processSteps.map((step, index) => {
          const isActive = index === activeStep;
          const panelId = `process-panel-${step.number}`;
          return (
            <div
              className={isActive ? `${styles.item} ${styles.active}` : styles.item}
              key={step.number}
            >
              <button
                type="button"
                className={styles.header}
                aria-expanded={isActive}
                aria-controls={panelId}
                onClick={() => setActiveStep(index)}
              >
                <span className={styles.badge}>{step.number}</span>
                <span className={styles.meta}>
                  <small className={styles.label}>{step.label}</small>
                  <h3 className={styles.title}>{step.title}</h3>
                </span>
                <ChevronDown className={styles.chevron} size={20} aria-hidden />
              </button>
              <div className={styles.panel} id={panelId} role="region">
                <div className={styles.panelInner}>
                  <p className={styles.desc}>{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
