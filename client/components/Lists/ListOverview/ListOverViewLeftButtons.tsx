import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import DeleteListButton from "./DeleteListButton";
import StartLearningListButton from "./StartLearningListButton";
import StopLearningListButton from "./StopLearningListButton";

export default function ListOverviewLeftButtons({
  listNumber,
  userIsAuthor,
}: {
  listNumber: number;
  userIsAuthor: boolean;
}) {
  return (
    <IconSidebar position="left" showOn="tablet">
      <StartLearningListButton mode="desktop" />
      <StopLearningListButton mode="desktop" />
      {userIsAuthor && (
        <IconSidebarButton type="edit" link={paths.editListPath(listNumber)} />
      )}
      <MobileMenuContextProvider>
        <DeleteListButton mode="desktop" />
      </MobileMenuContextProvider>
    </IconSidebar>
  );
}
