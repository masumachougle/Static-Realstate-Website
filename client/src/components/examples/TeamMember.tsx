import TeamMember from "../TeamMember";
import memberImage from "@assets/generated_images/Male_team_member_headshot_c2c47ddc.png";

export default function TeamMemberExample() {
  return (
    <div className="p-8 max-w-sm">
      <TeamMember
        name="Ahmed Al Mansouri"
        role="Senior Real Estate Consultant"
        image={memberImage}
        email="ahmed@realstateproperties.com"
        phone="+971 50 123 4567"
      />
    </div>
  );
}
