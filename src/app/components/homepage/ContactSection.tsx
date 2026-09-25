"use client";

import { useEffect, useRef, useState } from "react";
import {
  FiArrowUp,
  FiChevronDown,
  FiMail,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ============================================================
   CONSTANTS
============================================================ */

const FIELD_BG = "rgba(72, 4, 36, 0.77)";
const FIELD_BORDER = "rgba(72, 4, 36, 0.77)";
const FIELD_OPTION_BG = "#480424";

/* ============================================================
   SERVICE OPTIONS
============================================================ */

const SERVICES = [
  { value: "memoir", label: "Memoirs, Anthologies, Biographies" },
  { value: "documentary", label: "Documentaries, Short Films" },
  { value: "archive", label: "Digital Archive Services" },
  { value: "exhibition", label: "Exhibition Design" },
  { value: "workshop", label: "Life Writing Workshops" },
  { value: "journals", label: "Bespoke Journals" },
  { value: "others", label: "Other" },
];

const STANDARD_PURPOSES = [
  { value: "personal", label: "Personal" },
  { value: "institutional", label: "Institutional" },
];

const JOURNAL_PURPOSES = [
  { value: "indigo-chronicles-hamper", label: "Indigo Chronicles: Set of 3 Journals" },
  { value: "cherish", label: "Cherish: A memory Journal" },
  { value: "celebrate", label: "Celebrate: Day to Day Journal" },
  { value: "create", label: "Create: Planner" },
];

/* ============================================================
   FORM FIELD
============================================================ */


function FormField({
  icon,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  icon?: React.ReactNode;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div
      className="contact-field group flex h-[46px] min-w-0 w-full items-center gap-3 rounded-[4px] border px-4 transition-colors duration-200"
      style={{
        backgroundColor: FIELD_BG,
        borderColor: FIELD_BORDER,
      }}
    >
      {icon && (
        <span className="flex shrink-0 items-center justify-center text-white/90">
          {icon}
        </span>
      )}

      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="futura-light min-w-0 w-full appearance-none border-0 bg-transparent text-[14px] tracking-[0.01em] text-white caret-white outline-none ring-0 placeholder:text-white/85 focus:border-0 focus:bg-transparent focus:text-white focus:outline-none focus:ring-0"
      />
    </div>
  );
}

/* ============================================================
   REUSABLE FORM SELECT
============================================================ */

/* ============================================================
   CUSTOM FORM SELECT
============================================================ */

function FormSelect({
  placeholder,
  value,
  options,
  onChange,
  required = false,
}: {
  placeholder: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      ref={selectRef}
      className={`contact-field relative min-w-0 w-full ${isOpen ? "z-50" : "z-10"
        }`}
    >
      {/* Dropdown trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="futura-light flex h-[46px] w-full min-w-0 items-center justify-between gap-3 rounded-[4px] border px-4 text-left text-[14px] tracking-[0.01em] text-white outline-none transition-colors duration-200 focus:border-white/40"
        style={{
          backgroundColor: FIELD_BG,
          borderColor: FIELD_BORDER,
        }}
      >
        <span
          className={`min-w-0 flex-1 truncate ${selectedOption ? "text-white" : "text-white/85"
            }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <FiChevronDown
          size={17}
          className={`shrink-0 text-white/90 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {/* Custom options panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-full overflow-hidden rounded-[4px] border shadow-xl"
          style={{
            backgroundColor: FIELD_OPTION_BG,
            borderColor: FIELD_BORDER,
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`futura-light block w-full px-4 py-3 text-left text-[14px] tracking-[0.01em] text-white transition-colors duration-150 hover:bg-white/10 ${value === option.value ? "bg-white/10" : ""
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Required validation */}
      {required && (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          required
          value={value}
          onChange={() => { }}
          className="pointer-events-none absolute h-px w-px opacity-0"
          style={{ bottom: 0, left: 0 }}
        />
      )}
    </div>
  );
}

/* ============================================================
   MESSAGE FIELD
============================================================ */


function MessageField() {
  return (
    <div
      className="contact-message col-span-1 sm:col-span-2 min-w-0 w-full rounded-[4px] border px-4 py-3 transition-colors duration-200"
      style={{
        backgroundColor: FIELD_BG,
        borderColor: FIELD_BORDER,
      }}
    >
      <textarea
        name="message"
        placeholder="Message"
        rows={4}
        className="futura-light block w-full resize-y appearance-none border-0 bg-transparent text-[14px] leading-[1.4] tracking-[0.01em] text-white caret-white outline-none ring-0 placeholder:text-white/85 focus:border-0 focus:bg-transparent focus:text-white focus:outline-none focus:ring-0"
      />
    </div>
  );
}

/* ============================================================
   SCROLL TO TOP
============================================================ */

function ScrollToTopButton() {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Scroll to top"
      className="group fixed bottom-6 right-4 z-[100] flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#691f3e] text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-white/60 hover:bg-[#581a34] focus:outline-none focus:ring-0 sm:right-6 md:bottom-12 md:right-14"
    >
      <FiArrowUp
        size={18}
        className="transition-transform duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}

/* ============================================================
   CONTACT SECTION
============================================================ */

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const [selectedService, setSelectedService] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState(false);

  const purposeOptions =
    selectedService === "journals"
      ? JOURNAL_PURPOSES
      : STANDARD_PURPOSES;

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
    setSelectedPurpose("");
  };


  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!selectedService || !selectedPurpose) {
      setSubmitError(true);
      setSubmitMessage(
        "Please select a service and documentation purpose."
      );
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      service:
        SERVICES.find((item) => item.value === selectedService)?.label ||
        selectedService,
      purpose:
        purposeOptions.find((item) => item.value === selectedPurpose)
          ?.label || selectedPurpose,
      message: formData.get("message"),
    };

    setIsSubmitting(true);
    setSubmitMessage("");
    setSubmitError(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to send your message."
        );
      }

      setSubmitError(false);
      setSubmitMessage(
        "Thank you! Your message has been sent successfully."
      );

      form.reset();
      setSelectedService("");
      setSelectedPurpose("");
    } catch (error) {
      setSubmitError(true);
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================
     GSAP ANIMATION
  ========================================================== */

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const form = formRef.current;
    const submit = submitRef.current;

    if (!section || !heading || !form || !submit) return;

    const fields = form.querySelectorAll<HTMLElement>(".contact-field");
    const message = form.querySelector<HTMLElement>(".contact-message");

    if (!message) return;

    const ctx = gsap.context(() => {
      gsap.set(heading, {
        opacity: 0,
        y: 12,
      });

      gsap.set(fields, {
        opacity: 0,
        y: 10,
      });

      gsap.set(message, {
        opacity: 0,
        y: 10,
      });

      gsap.set(submit, {
        opacity: 0,
        y: 10,
      });

      const timeline = gsap.timeline({
        paused: true,
      });

      timeline.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      });

      timeline.to(
        fields,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: "power2.out",
        },
        "-=0.18"
      );

      timeline.to(
        message,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        "-=0.12"
      );

      timeline.to(
        submit,
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        },
        "-=0.1"
      );

      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        onEnter: () => timeline.restart(),
        onEnterBack: () => timeline.restart(),
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      id="contact-us"
      ref={sectionRef}
      className="relative flex w-full flex-col"
    >
      {/* BACKGROUND IMAGE */}

      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <img
          src="/assets/homepage/GET_YOUR_STORY_SCRIPTED.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div
          className="absolute inset-0"
          style={{
            background: "rgba(246, 239, 218, 0.66)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "rgba(235, 220, 188, 0.12)",
          }}
        />
      </div>

      {/* MAIN CONTACT CONTENT */}

      <div className="relative z-10 w-full">
        <div className="flex w-full justify-center px-4 py-[6vh] sm:px-6 md:px-10 md:py-[7vh] lg:px-12">
          <div className="flex w-full max-w-[1000px] flex-col items-center sm:w-[90%] lg:w-[80%] xl:w-[72%]">
            {/* TITLE */}

            <h2
              ref={headingRef}
              className="futura-light mb-5 text-center text-[16px] leading-tight tracking-[0.03em] text-[#542338] sm:text-[19px] lg:text-[18px]"
            >
              Get your Story{" "}
              <span className="futura-bold">Scripted</span>
            </h2>

            {/* FORM */}

            <form
              ref={formRef}
              className="grid w-full grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2"
              onSubmit={handleSubmit}
            >
              <FormField
                name="firstName"
                icon={<FiUser size={15} />}
                placeholder="First name*"
                required
              />

              <FormField
                name="lastName"
                icon={<FiUser size={15} />}
                placeholder="Last name"
              />

              <FormField
                name="email"
                icon={<FiMail size={15} />}
                placeholder="Email*"
                type="email"
                required
              />

              <FormField
                name="phone"
                icon={<FiPhone size={15} />}
                placeholder="Phone*"
                type="tel"
                required
              />

              {/* Service dropdown */}
              <FormSelect
                placeholder="What service would you like to avail?*"
                value={selectedService}
                options={SERVICES}
                onChange={handleServiceChange}
                required
              />

              {/* Documentation purpose dropdown */}
              <FormSelect
                placeholder="Documentation purpose*"
                value={selectedPurpose}
                options={purposeOptions}
                onChange={setSelectedPurpose}
                required
              />

              {/* Message */}
              <MessageField />

              {/* Submission status */}
              {submitMessage && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`col-span-1 text-center text-sm sm:col-span-2 ${
                    submitError ? "text-red-700" : "text-[#542338]"
                  }`}
                >
                  {submitMessage}
                </p>
              )}

              {/* Submit button */}
              <div className="col-span-1 flex justify-center pt-1 sm:col-span-2">
                <button
                  ref={submitRef}
                  type="submit"
                  disabled={isSubmitting}
                  className="futura-light h-[40px] min-w-[120px] rounded-[4px] border border-[#6b203e]/20 bg-[#6b203e] px-8 text-[13px] tracking-[0.01em] text-white transition-all duration-200 hover:bg-[#581a34] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Sending..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* SCROLL TO TOP */}

      <ScrollToTopButton />
    </section>
  );
}