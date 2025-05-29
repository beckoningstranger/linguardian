import IconSidebar from "@/components/IconSidebar/IconSidebar";
import IconSidebarButton from "@/components/IconSidebar/IconSidebarButton";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import DeleteListButton from "../EditList/DeleteListButton";
import StartLearningListButton from "./StartLearningListButton";
import StopLearningListButton from "./StopLearningListButton";

interface ListOverViewLeftButtonsProps {
  listNumber: number;
  userIsAuthor: boolean;
  editMode?: boolean;
}

export default function ListOverviewLeftButtons({
  listNumber,
  userIsAuthor,
  editMode,
}: ListOverViewLeftButtonsProps) {
  return (
    <IconSidebar position="left" showOn="tablet">
      {!editMode && (
        <>
          <StartLearningListButton mode="desktop" />
          <StopLearningListButton mode="desktop" />
          {userIsAuthor && (
            <IconSidebarButton
              mode="edit"
              link={paths.editListPath(listNumber)}
            />
          )}
        </>
      )}
      {editMode && (
        <>
          <IconSidebarButton
            mode="back"
            link={paths.listDetailsPath(listNumber)}
          />
          <MobileMenuContextProvider>
            <DeleteListButton mode="desktop" />
          </MobileMenuContextProvider>
        </>
      )}
    </IconSidebar>
  );
}
