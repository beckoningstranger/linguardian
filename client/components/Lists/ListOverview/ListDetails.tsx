import Spinner from "@/components/Spinner";
import { MobileMenuContextProvider } from "@/context/MobileMenuContext";
import { Suspense } from "react";
import ListContainer from "../ListContainer";
import ChartsLButtonsLeaderboard from "./ChartsLearningButtonsLeaderBoard";
import DeleteListButton from "./DeleteListButton";
import ListHeader from "./ListHeader";
import ListUnits from "./ListUnits";

export default async function ListDetailPage() {
  return (
    <ListContainer>
      <MobileMenuContextProvider>
        <DeleteListButton />
      </MobileMenuContextProvider>
      <ListHeader />
      <Suspense fallback={<Spinner centered />}>
        <ChartsLButtonsLeaderboard />
      </Suspense>
      <ListUnits />
    </ListContainer>
  );
}
