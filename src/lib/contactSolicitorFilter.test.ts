import { describe, expect, it } from "vitest";
import {
  contactSubmissionLooksLikePitch,
  textLooksLikeSolicitorPitch,
} from "./contactSolicitorFilter";

describe("contactSolicitorFilter", () => {
  it("flags common SEO / agency pitches", () => {
    expect(
      textLooksLikeSolicitorPitch(
        "We offer SEO services to help you rank on Google.",
      ),
    ).toBe(true);
    expect(textLooksLikeSolicitorPitch("Interested in a guest post?")).toBe(
      true,
    );
    expect(
      textLooksLikeSolicitorPitch(
        "Our digital marketing agency specializes in backlinks.",
      ),
    ).toBe(true);
  });

  it("flags pitches matching real solicitation templates", () => {
    expect(
      textLooksLikeSolicitorPitch(
        "I build fast websites for local businesses, plus an AI chat assistant that answers customer questions 24/7. Would you be open to a quick 10-minute call this week? No commitment needed.",
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        "Black Bean Consulting supports prospect research and B2B outreach for service companies. Would a 15-minute conversation about that approach be useful?",
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        "For a flat $99 we deliver a written audit of your website and business email.",
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        "We set up a 24/7 AI response system that follows up with missed calls and website inquiries by SMS in under 60 seconds.",
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        'Reply "yes" and I\'ll send a short audit of your ads within a day.',
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        "Greetings from Ahaan Software Consulting! Opportunities to strengthen your online presence and lead-generation potential.",
      ),
    ).toBe(true);
    expect(
      textLooksLikeSolicitorPitch(
        "I'm testing a simple handoff that turns those details into a short walkthrough brief.",
      ),
    ).toBe(true);
  });

  it("allows typical customer questions", () => {
    expect(
      textLooksLikeSolicitorPitch(
        "I found you on Google — can you clean a 3-bedroom in Tigard?",
      ),
    ).toBe(false);
    expect(
      textLooksLikeSolicitorPitch(
        "What is included in a deep clean? We have two dogs.",
      ),
    ).toBe(false);
    expect(
      textLooksLikeSolicitorPitch(
        "You confirm pricing after a walkthrough — when could someone come out?",
      ),
    ).toBe(false);
  });

  it("combines name and message", () => {
    expect(
      contactSubmissionLooksLikePitch({
        name: "Link Building Co",
        message: "Hello, reaching out about your website.",
      }),
    ).toBe(true);
  });
});