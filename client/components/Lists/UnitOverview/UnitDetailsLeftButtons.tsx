import IconSidebar from "@/components/IconSidebar/IconSidebar";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import paths from "@/lib/paths";
import IconSidebarButton from "../../IconSidebar/IconSidebarButton";
import DeleteUnitButton from "../EditList/DeleteUnitButton";

interface UnitDetailsLeftButtonsProps {
  listNumber: number;
  unitNumber: number;
  userIsAuthor: boolean;
  editMode?: boolean;
}

export default function UnitDetailsLeftButtons({
  listNumber,
  unitNumber,
  userIsAuthor,
  editMode,
}: UnitDetailsLeftButtonsProps) {
  return (
    <IconSidebar showOn="tablet" position="left">
      {!editMode && (
        <IconSidebarButton
          mode="back"
          link={paths.listDetailsPath(listNumber)}
        />
      )}
      {userIsAuthor && (
        <>
          {editMode && (
            <IconSidebarButton
              mode="back"
              label="Back to unit overview"
              link={paths.unitDetailsPath(listNumber, unitNumber)}
            />
          )}
          {!editMode && (
            <IconSidebarButton
              mode="edit"
              label="Edit this unit"
              link={paths.editUnitPath(listNumber, unitNumber)}
            />
          )}
          {editMode && (
            <MobileMenuContextProvider>
              <DeleteUnitButton listNumber={listNumber} mode="desktop" />
            </MobileMenuContextProvider>
          )}
        </>
      )}
    </IconSidebar>
  );
}
