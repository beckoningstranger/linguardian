import IconSidebar from "@/components/IconSidebar/IconSidebar";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import DeleteListButton from "./DeleteListButton";
import EditListButton from "./EditListButton";
import StartLearningListButton from "./StartLearningListButton";
import StopLearningListButton from "./StopLearningListButton";

export default function ListOverviewLeftButtons() {
  return (
    <IconSidebar position="left" showOn="tablet">
      <StartLearningListButton mode="desktop" />
      <StopLearningListButton mode="desktop" />
      <EditListButton />
      <MobileMenuContextProvider>
        <DeleteListButton mode="desktop" />
      </MobileMenuContextProvider>
    </IconSidebar>
  );
}
