import StaffDashboard from "./StaffDashboard";
import Orders from "./Orders";

export default function StaffOrdersPage() {
  return (
    <StaffDashboard defaultTab="orders">
      <Orders />
    </StaffDashboard>
  );
}
