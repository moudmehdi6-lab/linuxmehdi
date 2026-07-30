// Static launch content for marketing pages. Mirrors the Testimonial/FAQ
// Prisma models 1:1 so this can be seeded into the DB and swapped for a
// live query once the admin content manager (Phase 4) ships.

export type MarketingTestimonial = {
  id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
};

export const testimonials: MarketingTestimonial[] = [
  {
    id: "t1",
    name: "Marco R.",
    role: "Subscriber since 2023",
    rating: 5,
    content:
      "Switched from three different apps to one IPTVLinux subscription. Setup took less than five minutes and it hasn't buffered once.",
  },
  {
    id: "t2",
    name: "Sophie L.",
    role: "Subscriber since 2022",
    rating: 5,
    content:
      "The WhatsApp ordering process is refreshingly simple — no accounts, no forms, just a quick message and I was streaming the same day.",
  },
  {
    id: "t3",
    name: "Daniel K.",
    role: "Subscriber since 2024",
    rating: 5,
    content:
      "Picture quality on my Apple TV is excellent, and support actually replies fast when I have questions. Worth every euro.",
  },
  {
    id: "t4",
    name: "Amelie B.",
    role: "Subscriber since 2023",
    rating: 4,
    content:
      "Great value on the 12-month plan. Support helped me set it up on two Fire TV Sticks and a Smart TV without any hassle.",
  },
];

export type PricingFaqItem = { question: string; answer: string };

export const pricingFaqs: PricingFaqItem[] = [
  {
    question: "How does WhatsApp ordering work?",
    answer:
      "Choose your plan and tap the order button — it opens WhatsApp with a pre-filled message describing your selection. Our team confirms details and gets you streaming the same day.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. Message us on WhatsApp any time before your current plan ends and we'll help you move to a longer or shorter plan.",
  },
  {
    question: "Is there a setup fee?",
    answer:
      "No. The price you see is the full price — setup assistance is included at no extra cost.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Payment details are shared directly over WhatsApp once you reach out, so we can offer the most convenient option for your region.",
  },
];
