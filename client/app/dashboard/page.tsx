import Dashboard from "@/components/Dashboard";
import DashboardContainer from "@/components/DashboardContainer";
import TopMenu from "@/components/Menus/TopMenu/TopMenu";

export default function DashboardPage() {
  return (
    <>
      <TopMenu />
      <DashboardContainer>
        <Dashboard />
      </DashboardContainer>
    </>
  );
}
