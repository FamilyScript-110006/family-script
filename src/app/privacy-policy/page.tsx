// app/privacy-policy/page.tsx

import PolicyPageWrapper from "../components/policy/PolicyPageWrapper";
import PolicyHeading from "../components/policy/PolicyHeading";
import PolicySection from "../components/policy/PolicySection";
import { PRIVACY_POLICY_BLOCKS } from "./privacyPolicyData";

export default function PrivacyPolicyPage() {
  return (
    <PolicyPageWrapper>
      <PolicyHeading>PRIVACY POLICY</PolicyHeading>
      <PolicySection blocks={PRIVACY_POLICY_BLOCKS} />
    </PolicyPageWrapper>
  );
}