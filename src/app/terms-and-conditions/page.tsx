// app/terms-and-conditions/page.tsx

import PolicyPageWrapper from "../components/policy/PolicyPageWrapper";
import PolicyHeading from "../components/policy/PolicyHeading";
import PolicySection from "../components/policy/PolicySection";
import {
  TERMS_AND_CONDITIONS_BLOCKS,
  RETURNS_AND_REFUNDS_BLOCKS,
  SHIPPING_POLICY_BLOCKS,
} from "./termsAndConditionsData";

export default function TermsAndConditionsPage() {
  return (
    <PolicyPageWrapper>
      <section className="mb-16 md:mb-20">
        <PolicyHeading>TERMS AND CONDITIONS</PolicyHeading>
        <PolicySection blocks={TERMS_AND_CONDITIONS_BLOCKS} />
      </section>

      <section className="mb-16 md:mb-20">
        <PolicyHeading>RETURNS &amp; REFUNDS</PolicyHeading>
        <PolicySection blocks={RETURNS_AND_REFUNDS_BLOCKS} />
      </section>

      <section>
        <PolicyHeading>SHIPPING POLICY</PolicyHeading>
        <PolicySection blocks={SHIPPING_POLICY_BLOCKS} />
      </section>
    </PolicyPageWrapper>
  );
}